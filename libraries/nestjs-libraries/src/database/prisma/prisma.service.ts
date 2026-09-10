import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: ['warn', 'error'],
    });
  }

  async onModuleInit() {
    // Neon (serverless Postgres) hibernates when idle and can take 1-3 s to wake.
    // Retry the initial connection a few times before giving up so that the
    // backend doesn't crash on cold-starts.
    const maxAttempts = 5;
    const delayMs = 2000;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.$connect();
        this.logger.log('Database connection established.');
        return;
      } catch (err: any) {
        this.logger.warn(
          `Database connection attempt ${attempt}/${maxAttempts} failed: ${err?.message ?? err}`
        );
        if (attempt < maxAttempts) {
          this.logger.log(`Retrying in ${delayMs / 1000}s…`);
          await new Promise((r) => setTimeout(r, delayMs));
        } else {
          this.logger.error('Could not connect to the database after all retries.');
          throw err;
        }
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

@Injectable()
export class PrismaRepository<T extends keyof PrismaService> {
  public model: Pick<PrismaService, T>;
  constructor(private _prismaService: PrismaService) {
    this.model = this._prismaService;
  }
}

@Injectable()
export class PrismaTransaction {
  public model: Pick<PrismaService, '$transaction'>;
  constructor(private _prismaService: PrismaService) {
    this.model = this._prismaService;
  }
}
