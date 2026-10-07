import { initializeSentry } from '@gitroom/nestjs-libraries/sentry/initialize.sentry';
initializeSentry('backend', true);
import compression from 'compression';

import { loadSwagger } from '@gitroom/helpers/swagger/load.swagger';
import { json } from 'express';
import { Runtime } from '@temporalio/worker';
Runtime.install({ shutdownSignals: [] });

process.env.TZ = 'UTC';

process.on('uncaughtException', (err) => {
  console.warn(
    'Backend process caught uncaughtException:',
    err?.message || err
  );
  if (err instanceof Error && err.stack) {
    console.warn(err.stack);
  }
});
process.on('unhandledRejection', (reason) => {
  console.warn('Backend process caught unhandledRejection:', reason);
  if (reason instanceof Error && reason.stack) {
    console.warn(reason.stack);
  }
});

// Render env values are often pasted without a protocol ("app.example.com"),
// which later throws TypeError: Invalid URL. Fix the common HTTP ones early.
for (const key of [
  'FRONTEND_URL',
  'MAIN_URL',
  'NEXT_PUBLIC_BACKEND_URL',
  'BACKEND_INTERNAL_URL',
] as const) {
  const raw = (process.env[key] || '').trim().replace(/\/+$/, '');
  if (!raw) continue;
  if (!/^https?:\/\//i.test(raw)) {
    process.env[key] = `https://${raw}`;
    console.warn(`[env] ${key}: prepended https:// → ${process.env[key]}`);
  }
}

import cookieParser from 'cookie-parser';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SubscriptionExceptionFilter } from '@gitroom/backend/services/auth/permissions/subscription.exception';
import { PostValidationExceptionFilter } from '@gitroom/backend/api/routes/posts.validation.exception';
import { HttpExceptionFilter } from '@gitroom/nestjs-libraries/services/exception.filter';
import { ConfigurationChecker } from '@gitroom/helpers/configuration/configuration.checker';
import { startMcp } from '@gitroom/nestjs-libraries/chat/start.mcp';

function corsOrigins() {
  const raw = [
    process.env.FRONTEND_URL,
    process.env.MAIN_URL,
    'http://localhost:6274',
    'http://localhost:4200',
  ]
    .filter((value): value is string => !!value)
    .map((value) => value.trim().replace(/\/+$/, ''));

  const origins = new Set<string>();
  for (const origin of raw) {
    origins.add(origin);
    try {
      const url = new URL(origin);
      if (url.hostname.startsWith('www.')) {
        origins.add(`${url.protocol}//${url.hostname.slice(4)}`);
      } else if (url.hostname.includes('.')) {
        origins.add(`${url.protocol}//www.${url.hostname}`);
      }
    } catch {
      // Ignore invalid URLs; the configuration checker will warn.
    }
  }
  return [...origins];
}

async function start() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    cors: {
      credentials: true,
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'auth',
        'showorg',
        'impersonate',
        'x-copilotkit-runtime-client-gql-version',
      ],
      exposedHeaders: [
        'reload',
        'onboarding',
        'activate',
        'logout',
        'x-copilotkit-runtime-client-gql-version',
        ...(process.env.NOT_SECURED ? ['auth', 'showorg', 'impersonate'] : []),
      ],
      origin: corsOrigins(),
    },
  });

  try {
    await startMcp(app);
  } catch (e) {
    Logger.warn(
      `MCP server failed to start: ${e instanceof Error ? e.message : e}`
    );
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  app.use(['/copilot/{*splat}', '/posts'], (req: any, res: any, next: any) => {
    json({ limit: '50mb' })(req, res, next);
  });

  app.use(cookieParser());
  app.use(compression());
  app.useGlobalFilters(new SubscriptionExceptionFilter());
  app.useGlobalFilters(new PostValidationExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  loadSwagger(app);

  // Render (and most PaaS) require binding 0.0.0.0 so the port scanner can see it.
  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST || '0.0.0.0';

  try {
    await app.listen(port, host);
    console.log(`Backend started successfully on ${host}:${port}`);

    checkConfiguration(); // Do this last, so that users will see obvious issues at the end of the startup log without having to scroll up.

    Logger.log(`🚀 Backend is running on: http://${host}:${port}`);
  } catch (e) {
    Logger.error(`Backend failed to start on ${host}:${port}`, e);
    process.exit(1);
  }
}

function checkConfiguration() {
  const checker = new ConfigurationChecker();
  checker.readEnvFromProcess();
  checker.check();

  if (checker.hasIssues()) {
    for (const issue of checker.getIssues()) {
      Logger.warn(issue, 'Configuration issue');
    }

    Logger.warn('Configuration issues found: ' + checker.getIssuesCount());
  } else {
    Logger.log('Configuration check completed without any issues');
  }
}

start();
