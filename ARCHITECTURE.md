# Poscally — Technical Architecture

> Poscally is a self-hostable, AI-assisted social-media scheduling platform. You connect social accounts, compose posts
> (one shared post with per-platform variations), schedule them on a calendar, and a Temporal workflow publishes each
> post to the right platform at the right time — with status, error recovery, notifications, and analytics.
>
> This document describes the **actual** codebase as of `v1.47.0`. Where the project's own `CLAUDE.md` / README
> statements disagree with the code, the code wins and the discrepancy is called out.

---

## 1. Table of contents

1. System overview & high-level architecture
2. Monorepo layout
3. Tech stack
4. Runtime components
5. Core domain flow — post scheduling & publishing (end-to-end)
6. Data model (Prisma / PostgreSQL)
7. Backend (NestJS API)
8. Orchestrator (Temporal background jobs)
9. Provider / integration abstraction
10. Authentication & authorization
11. Frontend (Next.js App Router)
12. Shared libraries
13. Storage & external services
14. Configuration surface (environment variables)
15. Deployment, containerization & CI/CD
16. Cross-cutting concerns (multi-tenancy, reliability, Temporal versioning)
17. Testing
18. Key file reference

---

## 2. System overview

Poscally is a **pnpm workspace monorepo** with a single shared Node.js runtime. Three long-running services plus a
browser extension and public SDK sit on top of PostgreSQL and Redis, with **Temporal** providing durable, retryable
background orchestration.

### 2.1 High-level architecture

```
                                ┌──────────────────────────────────────────────┐
                                │           Browser (Next.js App)              │
                                │  /auth /overview /launches /analytics /media │
                                │  /third-party /settings /billing /p/[id]     │
                                │  CopilotKit agent UI · i18n · SWR · zustand  │
                                └───────────────┬──────────────────────────────┘
                                                │ HTTP (fetch, cookie JWT)
                                                ▼
       ┌──────────────────────────────┐   ┌────────────────────────────────────────┐
       │   backend  (NestJS, :3000)    │   │      orchestrator (NestJS, :3002)      │
       │                               │   │                                        │
       │  · controllers / DTOs         │   │  · Temporal WORKERS (main + per-        │
       │  · CASL ABAC (PoliciesGuard)  │   │    provider task queues)                │
       │  · JWT auth middleware        │   │  · workflows  postWorkflowV1.0.x, auto-  │
       │  · Temporal CLIENT (enqueues) │   │    post, refresh-token, email, streak,   │
       │  · Stripe / billing           │   │    missing-post                         │
       │  · Public API (/public/v1)    │   │  · activities (publish directly!)       │
       │  · Mastra agent + MCP server  │   │  · health /health/status                │
       └───────────────┬──────────────┘   └───────────────────┬────────────────────┘
                       │  gRPC (start / signal / terminate)  │
                       └──────────────► Temporal Service ◄───┘
                             (address :7233 · namespace default)
                       ┌──────────────────────┴──────────────────────┐
                       │   Temporal server + Elasticsearch + UI       │
                       └──────────────────────────────────────────────┘
                                  │                            │
                      ┌───────────▼───────────┐      ┌─────────▼──────────┐
                      │  PostgreSQL 17       │      │  Redis 7.2          │
                      │  (Prisma, org-scoped)│      │  throttling, cache, │
                      └──────────────────────┘      │  queued email       │
                                                    └─────────────────────┘

     Orchestrator activities → Social platform APIs directly (X, LinkedIn, Instagram, YouTube, TikTok, …)
```

Key architectural decisions:

- **Shared Prisma DB between backend and orchestrator.** There is **no REST/internal API boundary** between the API
  service and the Temporal workers. Both run NestJS and import the same `nestjs-libraries` Prisma services against the
  same PostgreSQL database. The backend is a Temporal **client**; the orchestrator is the Temporal **worker** (and also
  a client for nested workflow calls).
- **Publishing happens in the orchestrator, directly to platform APIs.** The backend never publishes; it only schedules.
- **Temporal is the async backbone** for posting, token refresh, email, digests, streaks, autopost and stuck-workflow
  sweeps. There is no `@nestjs/schedule`/`@Cron` in the codebase — all recurring work is long-running Temporal workflows.
- **Multi-tenancy by `organizationId`** on (virtually) every row, including Temporal search attributes and throttler keys.
- **Design discipline:** provider-specific logic is isolated behind a `SocialProvider` interface, never in generic code
  (see the CLAUDE.md "no `if(facebookProvider)`" rule).

---

## 3. Monorepo layout

```
posthub/
├─ apps/                    # runnable applications (workspace packages)
│  ├─ backend/              # NestJS REST API (+ Swagger, public API, Copilot/MCP)
│  ├─ orchestrator/         # NestJS + Temporal workers, workflows, activities
│  ├─ frontend/             # Next.js 16 App Router web app
│  ├─ extension/            # Chrome Manifest V3 (cookie-based platform auth)
│  ├─ commands/             # NestJS CLI (token refresh, config check, agent run)
│  └─ sdk/                  # @poscally/node public Node SDK
├─ libraries/               # shared code (workspace packages, imported by path alias)
│  ├─ nestjs-libraries/     # backend/orchestrator shared: Prisma, providers, services
│  ├─ react-shared-libraries/  # shared React components/hooks (no package.json)
│  └─ helpers/              # cross-cutting utilities (fetch, i18n, swagger, auth)
├─ prd.md                   # product requirements (target/future state)
├─ schema.sql               # SQL mirror of the Prisma schema (reflective, not source of truth)
├─ docker-compose.yaml      # production-like all-in-one stack
├─ docker-compose.dev.yaml  # dev infra (Postgres/Redis/pgAdmin/RedisInsight/Temporal)
├─ Dockerfile.dev           # single-stage image (builds whole monorepo; runs via nginx + pm2)
├─ dynamicconfig/           # Temporal dev config
├─ Jenkins/                 # declarative Jenkinsfiles + SonarQube
├─ .github/workflows/       # GitHub Actions CI/CD
└─ var/docker/              # docker build/create scripts + nginx.conf
```

### 3.1 Workspace packages (`pnpm-workspace.yaml`)

```yaml
packages:
  - apps/*
  - libraries/*
```

### 3.2 Path aliases (`tsconfig.base.json`)

| Alias | Maps to |
|---|---|
| `@gitroom/frontend/*` | `apps/frontend/src/*` |
| `@gitroom/react/*` | `libraries/react-shared-libraries/src/*` |
| `@gitroom/helpers/*` | `libraries/helpers/src/*` |
| `@gitroom/nestjs-libraries/*` | `libraries/nestjs-libraries/src/*` |
| `@gitroom/backend/*` | `apps/backend/src/*` |
| `@gitroom/orchestrator/*` | `apps/orchestrator/src/*` |
| `@gitroom/plugins/*` | `libraries/plugins/src/*` |
| `@gitroom/extension/*` | `apps/extension/src/*` |

---

## 4. Tech stack

| Concern | Choice |
|---|---|
| Package manager | **pnpm** 10.6.1 (Node ≥22.12, <23) |
| Language | TypeScript (strict, `strictNullChecks: false`) |
| API / backend | NestJS 11 (`@nestjs/common` 11.1.21) |
| Background jobs | Temporal (`@temporalio/client` / `nestjs-temporal-core`) |
| ORM / DB | Prisma 6.5.0 + PostgreSQL 17 |
| Cache / queue | **Redis 7.2** (ioredis; throttling, analytics cache, email queue) |
| Frontend | **Next.js 16 App Router**, React 19, Tailwind 3.4, Mantine 5 |
| State | React Context + **Zustand** (composer & modal stores) |
| Data fetching | **SWR** 2.x over a custom `useFetch` wrapper |
| Auth | **JWT cookie** + **CASL** ABAC (no Passport) |
| Payments | Stripe (embedded checkout, $1 auth-void, proration, coupons) |
| Email | **Resend** / SMTP, queued via Temporal |
| Storage | **local / Cloudflare R2 / Supabase** (switch by `STORAGE_PROVIDER`) |
| Observability | **Sentry** (`@sentry/nextjs`, `@sentry/node`), PostHog, Plausible, GTM, FB Pixel |
| AI | Mastra + LangGraph + CopilotKit, OpenAI model (GPT-4.1 / GPT-5.2), Fal.ai, Veo3 |
| Short links | Dub / Short.io / Kutt / LinkDrip (by env key) |

> **Note / discrepancy:** `CLAUDE.md` describes the frontend as "Vite ReactJS". The actual app is **Next.js 16 App
> Router** (React 19). Vite exists in the repo only for the **browser-extension build** and for tests. React Router is
> not used; routing is file-based under `src/app`. `CLAUDE.md` also references `tailwind.config.js`; the real file is
> `tailwind.config.cjs`.

---

## 5. Runtime components

### 5.1 `apps/backend` — NestJS REST API (port 3000)

- **Bootstrap** `apps/backend/src/main.ts`: Sentry init first, `process.env.TZ='UTC'`, `ValidationPipe({transform})`,
  cookie-parser, compression, per-path body limits (`/copilot/*`, `/posts` → 50mb), global filters
  (`SubscriptionExceptionFilter`, `PostValidationExceptionFilter`, `HttpExceptionFilter`, Sentry), Swagger at `/docs`.
- **App module** `app.module.ts` (`@Global`): imports `DatabaseModule`, `ApiModule`, `PublicApiModule`, `AgentModule`,
  `ThirdPartyModule`, `VideoModule`, `ChatModule`, `getTemporalModule(false)` (client), Temporal search-attribute +
  infinite-workflow registers, `ThrottlerModule` (1h / `API_LIMIT||90`, Redis-backed).
- **Controllers** under `apps/backend/src/api/routes/` — one per capability:
  admin, analytics, announcements, approved-apps, auth, autopost, billing, copilot, enterprise, integrations, media,
  monitor, no-auth-integrations, notifications, oauth(-app/-authorized), posts, public, root, sets, settings, signature,
  stripe, third-party, users, webhooks.
- **Public API** under `apps/backend/src/public-api/routes/v1/` (`/public/v1`) with its own auth middleware.

### 5.2 `apps/orchestrator` — Temporal workers (port 3002)

- **Bootstrap** `apps/orchestrator/src/main.ts`: Sentry, `ipv4first` DNS, bootstraps Nest from `AppModule`, listens for
  `/health/status` only.
- **App module** imports `DatabaseModule` + `getTemporalModule(true, workflowsPath, activities)`.
- One Temporal **worker per provider task queue** plus `main`. See §8.

### 5.3 `apps/frontend` — Next.js web app (port 4200)

- Next.js 16 App Router, entry via `src/app`.
- Route groups `(app)` (main app), `(provider)` (OAuth/webview bridge), `(extension)` (standalone modal UI).
- Middleware: `src/proxy.ts` (Next 16 successor to `middleware.ts`) handles locale detection and auth gating.

### 5.4 `apps/extension` — Chrome Manifest V3

- Purpose: **cookie-based platform auth** (currently only Skool) for platforms without OAuth.
- MV3 service worker `src/background.ts`: extracts cookies via `chrome.cookies.getAll`, POSTs base64 cookies to
  `/integrations/extension-refresh`, daily `cookie-refresh` alarm, 5 message types
  (`PING`, `GET_PROVIDERS`, `GET_COOKIES`, `STORE_REFRESH_TOKEN`, `REMOVE_REFRESH_TOKEN`).
- `externally_connectable`: `localhost` + `*.poscally.com`.

### 5.5 `apps/sdk` — public Node SDK (`@poscally/node`)

- Class `Poscally(apiKey, path?)` defaulting to `https://api.poscally.com`.
- Methods hitting `/public/v1/*`: `post`, `postList`, `upload`, `integrations`, `deletePost`.

### 5.6 `apps/commands` — NestJS CLI

- `@Command`-decorated tasks: `refresh` (refresh integration tokens), `config:check` (validate env), `run:agent`
  (execute a LangGraph agent graph).

---

## 6. Core domain flow — scheduling & publishing (end-to-end)

The canonical, reliability-critical path. Traced from the backend enqueue through the Temporal worker to the X platform.

### 6.1 Schedule (backend)

1. `POST /posts` → `PostsController.createPost` (`posts.controller.ts:184`) → `PostsService.createPost`
   (`posts.service.ts:1083`), persisting rows via `.../database/prisma/posts/` repository.
2. For non-draft posts, `createPost` calls `startWorkflow(providerBase, postId, orgId, state)`
   (`posts.service.ts:1143`).
3. `startWorkflow` (`posts.service.ts:865`):
   - terminates any existing **running** workflow with `postId=...`;
   - returns early if state is `DRAFT`;
   - starts `**postWorkflowV107**` with `workflowId: post_{id}`, `taskQueue: 'main'`,
     `workflowIdConflictPolicy: TERMINATE_EXISTING`, args `{ taskQueue, postId, organizationId }`, and typed search
     attributes `postId` + `organizationId`.
   - The `taskQueue` arg is `post.settings.__type.split('-')[0].toLowerCase()` (e.g. `x`, `linkedin`, `instagram`).

### 6.2 Publish (orchestrator)

4. `postWorkflowV107` (`apps/orchestrator/src/workflows/post-workflows/post.workflow.v1.0.7.ts`) runs on the `main`
   worker. It defines a `poke` signal, loads the post, sleeps until `publishDate` (durable Temporal timer), then
   proxies activities onto the **provider task queue**.
5. `postSocialPending` activity (`post.activity.ts:225`) runs on the provider queue worker, calls
   `provider.postPending(...)` — **nothing irreversible happened yet**. Platform returns `status: 'pending'` with
   pending media/processing data.
6. The workflow `resolvePending` polls the read-only `checkPostStatus` activity (up to 90 × 20s ≈ 30 min).
7. When ready, `finalizePost` activity runs (`maximumAttempts: 1`, heartbeat-wrapped) — the **irreversible mutation**.
   For X, this is a 3-way handshake (arm → confirm → publish) so a create that dies mid-flight is *detected* rather than
   *retried into a duplicate*.
8. On success: `updatePost` (record platform post id + URL), `inAppNotification`, `sendWebhooks` (SSRF-safe), start
   `streakWorkflow`. `repeat-post` may spawn a child workflow (`parentClosePolicy: ABANDON`).

### 6.3 Reschedule / delete

- `PUT /posts/:id/date` → `changeDate` (`posts.service.ts:1356`) → `startWorkflow` (terminate old, start new).
- `DELETE /posts/:group` → `deletePost` (`posts.service.ts:823`) → terminate by `postId` search attribute.

### 6.4 Backend ↔ Temporal

The backend is a pure **client** via `nestjs-temporal-core` (`TemporalService`). It calls
`client.getRawClient().workflow.start(...)`, `.signalWithStart(...)`, `.list(...)`, and
`getWorkflowHandle(id).terminate()/.describe()`. **No `query()` calls exist.** Connection is gRPC to
`TEMPORAL_ADDRESS || localhost:7233`.

---

## 7. Data model (Prisma / PostgreSQL)

- **Schema:** `libraries/nestjs-libraries/src/database/prisma/schema.prisma` (970 lines, **48 models, 11 enums**).
- **Service:** `PrismaService` extends `PrismaClient` with Neon-aware cold-start retry (5 attempts).
- **Migrations: `prisma db push` — NOT `prisma migrate`.** No `prisma/migrations/` directory. Root scripts use
  `db push --accept-data-loss`; `postinstall` runs `prisma-generate`; the container runtime (`pm2-run`) runs
  `db push` before boot. Schema changes are applied destructively with no migration history/rollback.

### 7.1 Key entities (grouped by domain)

| Domain | Models | Notes |
|---|---|---|
| Tenancy & auth | `Organization`, `User`, `UserOrganization` | `Organization` is the **tenancy root**; `UserOrganization` carries `role` (SUPERADMIN/ADMIN/USER), M2M. |
| Subscription/billing | `Subscription` (1:1 org), `Credits`, `UsedCodes`, `Customer` | `subscriptionTier`: STANDARD/PRO/TEAM/ULTIMATE; `period`: MONTHLY/YEARLY. |
| Accounts/channels | `Integration` | **One row = one connected social account** (`providerIdentifier` = e.g. `twitter`, `instagram`; plain string, extensible). Stores `token`, `refreshToken`. |
| Posts | `Post` | **One Post targets exactly ONE Integration.** `state`: QUEUE/PUBLISHED/ERROR/DRAFT; `group` groups posts published together; `parentPostId` self-relation for master/variant & reposts; `creationMethod`: WEB/MCP/API/AUTOPOST/CLI. |
| Media | `Media` | Org-scoped asset library, soft-delete (`deletedAt`), referenced by User/Agency/OAuthApp. |
| Messaging | `Comments`, `MessagesGroup`, `Messages` | Marketplace (buyer↔seller) conversations. |
| Marketplace | `Orders`, `OrderItems`, `PayoutProblems` | Trade social accounts/posts cross-org. |
| Notifications | `Notifications`, `Announcement` | In-app + broadcast banners. |
| Webhooks | `Webhooks`, `IntegrationsWebhooks` | Outbound event delivery, SSRF-safe. |
| Automations | `AutoPost`, `Sets`, `Signatures` | RSS auto-posting, reusable content sets, signatures. |
| OAuth | `OAuthApp`, `OAuthAuthorization` | Poscally acting as its own OAuth provider. |
| AI | `mastra_threads`, `mastra_messages`, `mastra_resources`, `mastra_traces`, `mastra_workflow_snapshot`, … | Mastra agent memory + observability (2 tables `@@ignore`d by Prisma). |
| Misc | `ThirdParty`, `Errors` (per-post/org error log), `Trending`/`Star`, `Agencies`, `PopularPosts` | |

### 7.2 Relational highlights

- **Organization →  everything** (posts, integrations, media, users, subscription, tags, credits, webhooks, …).
- **Post → Integration is many-to-one.** To broadcast to N channels you create N `Post` rows sharing a `group` value
  (or link via `parentPostId`).
- **User ↔ Organization** many-to-many through `UserOrganization` (adds RBAC `role`).
- **Subscription → Organization** one-to-one.
- **Tags ↔ Post** many-to-many via explicit `TagsPosts`. **Integration ↔ Webhook** many-to-many via `IntegrationsWebhooks`.

### 7.3 Enums (11)

`State`, `SubscriptionTier`, `Period`, `Provider` (LOCAL/GITHUB/GOOGLE/FARCASTER/WALLET/GENERIC), `Role`,
`APPROVED_SUBMIT_FOR_ORDER`, `CreationMethod`, `ShortLinkPreference`, `AnnouncementColor`, `OrderStatus`, `From`.

> There is **no integration-type enum** — `Integration.providerIdentifier` and `Integration.type` are plain strings to
> keep the provider set open/extensible (per the CLAUDE.md provider-abstraction rule).

---

## 8. Orchestrator (Temporal) in detail

### 8.1 Worker bootstrap

`libraries/nestjs-libraries/src/temporal/temporal.module.ts` → `getTemporalModule(isWorkers, path?, activityClasses?)`.

- Connection via gRPC: `address = TEMPORAL_ADDRESS || 'localhost:7233'`; TLS when `TEMPORAL_TLS === 'true'`;
  `TEMPORAL_API_KEY` for Temporal Cloud; `namespace = TEMPORAL_NAMESPACE || 'default'`.
- **One Worker per provider task queue.** Built from `socialIntegrationList` (~34 providers) plus a synthetic
  `{ identifier: 'main' }`; filters out `-` variants, uses `identifier.split('-')[0]` as the queue name (`x`, `reddit`,
  `linkedin`, …). The `main` worker is the **only** worker with a `workflowsPath` bundle; all others are activity-only.
- Per-provider concurrency = `maxConcurrentJob / WORKER_CONCURRENCY_DIVIDER` (never < 1); `EXCLUDE_QUEUE` pins queues.

### 8.2 Workflows (`apps/orchestrator/src/workflows/`)

| Workflow | Purpose |
|---|---|
| `postWorkflowV107` (current; v1.0.1–1.0.6 kept on disk) | The scheduling/publish core. See §6. |
| `autoPostWorkflow` | Infinite loop: `autoPost` then `sleep(1h)`. |
| `missingPostWorkflow` | Hourly sweep (started at boot when `RUN_CRON` set) — finds stuck `QUEUE` posts and `signalWithStart`s the post workflow with the `poke` signal. |
| `refreshTokenWorkflow` | Sleeps until token expiry → refresh → loop. |
| `streakWorkflow` | Per-publish 24h lifecycle (set streak, warn, end). |
| `sendEmailWorkflow` | Signal-driven rate-limited email queue, `continueAsNew`. |
| `digestEmailWorkflow` | Signal-driven batched email digest, `continueAsNew`. |

### 8.3 Activities (`apps/orchestrator/src/activities/`)

`PostActivity` (`post.activity.ts` — `postSocialPending`, `checkPostStatus`, `finalizePost`, `postComment`,
`refreshToken`, `searchForMissingThreeHoursPosts`, `sendWebhooks`, `inAppNotification`, …), `EmailActivity`,
`IntegrationsActivity`, `AutopostActivity`. All `@Injectable` + `@ActivityMethod`; type-registered, dispatched by name.

Long-running publish/comment/finalize methods are wrapped in `withHeartbeat`
(`temporal.heartbeat.ts`) → `Context.current().heartbeat()` every 15s.

### 8.4 Versioning rules (critical, from CLAUDE.md)

- **A workflow file on `origin/main` can never be edited** — changing it breaks in-flight executions. Instead, create a
  new versioned file (`post.workflow.v1.0.8.ts`) and switch every caller to the new name.
- **Activity parameters cannot change** — if needed, create a new activity+workflow.
- Currently the post-workflow call sites to update on a new version are:
  - `posts.service.ts:900` (backend create/schedule),
  - `post.activity.ts:81` (missing-post sweep),
  - `post.workflow.v1.0.7.ts:658` (repeat-post child start — must reference its own version).

### 8.5 Signals

`poke` (post workflow), `sendEmail` (sendEmailWorkflow), `email` (digestEmailWorkflow). No queries.

### 8.6 Reliability patterns

- **Idempotent-ish publish handshake:** `postPending` (reversible) → poll `checkPostStatus` (read-only) →
  `finalizePost` (irreversible, `maximumAttempts: 1`, 3-min heartbeat timeout, no auto-retry) — prevents missing
  retries at timeout endpoints and duplicate publishes.
- **Heartbeat timeouts** on the comment/mutation proxies so a genuinely dead worker is detected fast without a
  duplicate publish.
- **Token-refresh retry loop** (`handleActivityError`, 5 iterations) classifying
  `RefreshToken` / `BadBody` / `timeout` / `unknown` failures.

---

## 9. Provider / integration abstraction

- **Interface:** `libraries/nestjs-libraries/src/integrations/social/social.integrations.interface.ts`
  (`SocialProvider`): `post`, `postPending?`, `comment`, `checkPostStatus`, `finalizePost`, `refreshToken`,
  `generateAuthUrl`, `analytics`, `maxLength`, `checkValidity`, etc. Plus contract fields `identifier`,
  `refreshCron`, `customFields?`, `isWeb3?`, `isChromeExtension?`, `editor`, `scopes`.
- **Base class:** `social.abstract.ts` → `SocialAbstract` (default `maxConcurrentJob = 1`), with SSRF-safe `fetch`,
  streamed uploads, media chunking, and `ApplicationFailure` subclasses `RefreshToken` / `BadBody`.
- **Registry:** `integration.manager.ts` — `socialIntegrationList` instantiates every provider;
  `IntegrationManager.getSocialIntegration(identifier)` is the single generic selector.
- **34 active providers** under `.../integrations/social/`: `x`, `linkedin`, `linkedin-page`, `reddit`, `instagram`,
  `instagram-standalone`, `facebook`, `threads`, `youtube`, `gmb`, `tiktok`, `pinterest`, `dribbble`, `discord`,
  `slack`, `kick`, `twitch`, `mastodon`, `bluesky`, `lemmy`, `farcaster(wrapcast)`, `telegram`, `nostr`, `vk`,
  `medium`, `devto`, `hashnode`, `wordpress`, `listmonk`, `moltbook`, `whop`, `skool`, `mewe`, `tumblr`.

Dispatch is fully generic — the orchestration activity selects the provider via the manager and calls `postPending ?? post`;
it never branches on provider name.

---

## 10. Authentication & authorization

### 10.1 Auth transport

- **JWT in an `auth` cookie** via `libraries/helpers/src/auth/auth.service.ts` (`jsonwebtoken`, HS256, no in-token
  expiry; cookie carries 1-year expiry). Same module provides bcrypt password hashing and AES-256-CBC
  `fixedEncryption`/`fixedDecryption` for at-rest OAuth secrets/codes/tokens.
- **No Passport / JwtStrategy / AuthGuard.** Auth is Express **middleware**:
  `apps/backend/src/services/auth/auth.middleware.ts` bound only to authenticated controllers. It reads
  `req.headers.auth || req.cookies.auth`, verifies the signature, then **re-resolves the user from DB** by `payload.id`
  (never trusts token-body claims like `isSuperAdmin`/`activated`), checks activation, resolves the org from `showorg`
  cookie, sets `req.user`/`req.org`.
- Cookie flags are toggled by `NOT_SECURED` (secured = HttpOnly+Secure+SameSite=None; dev = plain cookie + `auth`
  header echo).

### 10.2 Authorization — CASL ABAC

- `PoliciesGuard` (`permissions.guard.ts`) is a global `APP_GUARD`. Reads `@CheckPolicies`
  (`permissions.ability.ts`) tuples of `[AuthorizationActions, Sections]` (`CHANNEL`, `POSTS_PER_MONTH`, `AI`,
  `TEAM_MEMBERS`, `WEBHOOKS`, `ADMIN`, …). `PermissionsService.check` builds a CASL `AppAbility` from the org's
  subscription tier.
- When `STRIPE_PUBLISHABLE_KEY` is unset (self-hosted), everything is allowed (default tier PRO). With Stripe and no
  subscription, tier FREE → `SubscriptionException` → 402 + billing URL.

### 10.3 OAuth login providers

`AuthProviderAbstract` + `@AuthProvider({provider})` decorator, resolved via `ModuleRef` in `providers.manager.ts`.
Concrete: `GithubProvider`, `GoogleProvider`, `FarcasterProvider` (Neynar), `WalletProvider` (Solana ed25519 + Redis
challenge), `OauthProvider` (generic self-hosted Authentik-style OAuth via `POSCALLY_OAUTH_*`).

### 10.4 Poscally as an OAuth provider

Separate subsystem minting `pca_` client ids, `pcs_` secrets, 10-min auth codes, and `pos_` access tokens
(`.../database/prisma/oauth/oauth.service.ts`), consumed by the public API's `PublicAuthMiddleware`.

### 10.5 Impersonation

Super-admins can swap identity via the `impersonate` cookie/header (`auth.middleware.ts:60`); endpoints in
`users.controller.ts`.

---

## 11. Frontend (Next.js App Router)

### 11.1 Routing & route groups

- File-based routing in `src/app`. Groups: `(app)` (main), `(provider)` (OAuth webview bridge), `(extension)`.
- **Authenticated workspace** `(app)/(site)`:
  `/overview` (dashboard), `/launches` (calendar), `/analytics`, `/media` (bulk tools), `/teams`, `/settings`,
  `/third-party` (connections), `/api-keys`, `/billing`, `/referral`, `/docs`, `/admin/*`.
- **Public preview** `(app)/(preview)`: `/p/[id]`.
- **Auth**: `/auth`, `/auth/login`, `/auth/activate`, `/auth/forgot`.
- **OAuth**: `/oauth/authorize`; `/integrations/social/[provider]` (callback continuation).
- **Landing**: `/`, `/landing`, `/welcome`, `/bluesky`, `/facebook`, `/instagram`, `/linkedin`, `/tiktok`, `/twitter`,
  `/youtube`, `/pinterest`, `/threads`.
- **Extension UI**: `/modal/[style]/[platform]`.
- **Middleware** `src/proxy.ts`: locale detection + auth gating + `DISABLE_REGISTRATION`.

> **Note:** `/agents` and `/plugs` are deprecated redirect stubs to `/overview` (the AI agent components exist
> in-tree but no active route mounts them).

### 11.2 Providers & state

- No single root `layout.tsx`; each route group ships its own. The app layout nest is
  `VariableContextComponent` → `SentryComponent` → analytics (`DubAnalytics`, `FacebookComponent`, `GTM`,
  `PlausibleProvider`, PostHog) → `LayoutContext` (fetch wrapper + cookie interceptors) → `UtmSaver`.
- `UserContext` (`ContextWrapper`) provides the enriched user; auth/session is cookie-based, not React state.
- **Zustand** stores: the post editor/composer store (`components/new-launch/store.ts`) and a modal store.
- `MantineWrapper` does **not** render `MantineProvider` (the app greps zero `MantineProvider` hits); Mantine components
  are themed at the global CSS level.

### 11.3 Data fetching

- **`useFetch`** split across `libraries/helpers/src/utils/custom.fetch.tsx` (provider/context) and
  `custom.fetch.func.ts` (the `customFetch` factory). It reads `auth`/`showorg`/`impersonate` cookies and attaches them
  as request headers, uses `credentials: 'include'`, and supports a `?loggedAuth=` query param for share/preview.
- The `afterRequest` interceptor (in `components/layout/layout.context.tsx`) persists rotated JWTs from response
  headers, handles `401`/`logout` → redirect, `402` → billing dialog, `406` → trial dialog.
- **SWR** usage follows the CLAUDE.md rule strictly: one hook per `useSWR`, no `eslint-disable`. Examples:
  `components/workspace-home/use.week.posts.ts`, `use.workspace.overview.ts`, `layout/use.organizations.ts`.

### 11.4 AI / Copilot

Frontend `components/agents/` built on **CopilotKit** (`@copilotkit/react-ui`, `@copilotkit/react-core`), wired to the
backend Mastra agent at `/copilot/agent`: agent list, chat, thread history, media/integration pickers, and a
`manualPosting` action (human-in-the-loop confirmation before scheduling). The extension layout and app layout import
CopilotKit styles.

### 11.5 Styling / design system

Tailwind 3.4 on top of Mantine 5, themed via CSS variables. `apps/frontend/src/app/colors.scss` defines the
`.dark`/`.light` token blocks (Group A `--new-*` preferred, Group B `--color-*` + deprecated `--color-custom*`) and
`global.scss` imports colors + `@tailwind base/components/utilities`, plus global theming for Mantine modals,
SweetAlert2, Uppy, TipTap/ProseMirror, RTL helpers. `components/ui/` holds native inline-SVG icons and a few small
primitives; most components live in feature folders under `components/` with `.client.tsx` suffixes.

---

## 12. Shared libraries

### 12.1 `libraries/nestjs-libraries` (server-shared, imported via `@gitroom/nestjs-libraries/*`)

- `database/prisma` — `DatabaseModule` (`@Global`, central DI hub exporting ~50 providers), `PrismaService`,
  `PrismaRepository<T>`, domain service/repository pairs (organizations, users, integrations, posts, media,
  subscriptions, notifications, webhooks, signatures, autopost, sets, third-party, oauth, errors, agencies, admin-stats).
- `integrations` — provider registry, `SocialAbstract`, `RefreshIntegrationService`, `@Tool`/`@Rules`/`@Plug`.
- `agent` — LangGraph `AgentGraphService` (Tavily → topic → GPT-4.1 → optional DALL·E → free-slot finder).
- `chat` — Mastra MCP agent `poscally` + 12 tools (`IntegrationList`, `GroupList`, `IntegrationValidation`,
  `IntegrationTrigger`, `IntegrationSchedulePost`, `PostsList`, `PostSettings`, `GenerateImage`, `GenerateVideo`,
  `UploadFromUrl`, …) over HTTP/SSE at `/mcp`; auth by API key or `pos_` token.
- `temporal` — `getTemporalModule`, search-attribute register, `infinite.workflow.register`, `withHeartbeat`.
- `upload` — `UploadFactory.createStorage()` strategy-by-`STORAGE_PROVIDER` (Local / Cloudflare R2 / Supabase).
- `emails`, `newsletter`, `openai` (image/post gen, Fal), `redis`, `sentry`, `services` (Email, Stripe, Codes),
  `short-linking`, `throttler`, `track` (FB CAPI), `videos` (`@Video` registry: Veo3, ImagesSlides), `3rdparties`
  (`@ThirdParty` registry: Heygen, ReelFarm), `dtos` (incl. per-platform post DTOs + SSRF-safe dispatcher), `user`.

### 12.2 `libraries/react-shared-libraries` (frontend-shared, no package.json — path alias only)

Form primitives (`button`, `input`, `textarea`, `select`, `checkbox`, `slider`, `color.picker`, …), `toaster`,
translation/i18n (16 locales, `useT`), Sentry init helpers, and `helpers/` (`variable.context.tsx`, `posthog.tsx`,
`delete.dialog.tsx`, `safe.image.tsx`, `video.or.image.tsx`, `uppy.upload.ts`, `mantine.wrapper.tsx`, …).

### 12.3 `libraries/helpers` (hybrid utils)

`custom.fetch.*`, `internal.fetch.ts`, `sanitize.post.content.ts`, `strip.links.ts`, `count.length.ts`, `utm.saver.tsx`,
`auth/auth.service.ts`, `configuration.checker.ts`, `swagger/load.swagger.ts`, `subdomain.management.ts`, decorators.

---

## 13. Storage & external services

- **Media/output storage** picked by `STORAGE_PROVIDER` (`local` default):
  - `local` → `UPLOAD_DIRECTORY` (served via `/uploads/*`);
  - `cloudflare` → **Cloudflare R2** (`@aws-sdk/client-s3`, `r2.uploader.ts` multipart proxy, `CLOUDFLARE_*`);
  - `supabase` → Supabase Storage (`SUPABASE_*`).
  - Remote fetches are SSRF-guarded and MIME-sniffed with `file-type`.
- **Email**: `EmailInterface` with `ResendProvider` / `NodeMailerProvider` / `EmptyProvider`, chosen per
  `EMAIL_PROVIDER`; queued through Temporal.
- **Short links**: Dub / Short.io / Kutt / LinkDrip / Empty by env key.
- **AI**: OpenAI (GPT-4.1 / GPT-5.2), Fal.ai (image/video), Google Veo3, Mastra + LangGraph + CopilotKit.
- **Analytics embedding**: PostHog, Plausible, GTM, FB Conversions API, Dub Analytics.

---

## 14. Configuration surface (`/.env.example` — 142 lines)

Key switches:

| Concern | Variable | Values |
|---|---|---|
| DB / cache | `DATABASE_URL`, `REDIS_URL` | Postgres, Redis |
| Auth | `JWT_SECRET`, `NOT_SECURED`, `DISABLE_REGISTRATION` | |
| App | `FRONTEND_URL`, `NEXT_PUBLIC_BACKEND_URL`, `BACKEND_INTERNAL_URL`, `MAIN_URL`, `IS_GENERAL` | hosted vs self-hosted |
| Storage | `STORAGE_PROVIDER` | `local` \| `cloudflare` \| `supabase` |
| Email | `RESEND_API_KEY`, `EMAIL_FROM_*` | presence ↔ activation required |
| Payments | `STRIPE_*`, `FEE_AMOUNT` | Stripe engine |
| Short links | `DUB_*` / `SHORT_IO_*` / `KUTT_*` / `LINK_DRIP_*` | mutually exclusive |
| OAuth SSO | `POSCALLY_GENERIC_OAUTH`, `POSCALLY_OAUTH_*` | Authentik-style |
| Public API | `API_LIMIT` (default 30/h) | per-org |
| Temporal | `TEMPORAL_ADDRESS`, `TEMPORAL_NAMESPACE`, `TEMPORAL_TLS`, `TEMPORAL_API_KEY` | (not documented in `.env.example`) |
| AI | `OPENAI_API_KEY` | (no `ANTHROPIC_*` anywhere) |
| Social | one client-id/secret block per provider (X, LinkedIn, Reddit, GitHub, Threads, FB, YT, TikTok, Pinterest, Dribbble, Tumblr, Discord, Slack, Mastodon, Beehiiv, Listmonk) | |
| Misc | `EXTENSION_ID`, `DISABLE_SSRF_PROTECTION`, `RUN_CRON`, `EXCLUDE_QUEUE` | |

---

## 15. Deployment, containerization & CI/CD

### 15.1 Docker

- **`Dockerfile.dev`** (despite the name, it's the production image): base `node:22.20-bookworm-slim`, installs build
  tools + nginx + pnpm/pm2, `COPY . /app`, `pnpm install`, `pnpm run build`, CMD
  `nginx && pnpm run pm2`. **Single all-in-one container** — nginx on port 5000 + pm2 managing three Node processes
  (backend `:3000` proxied at `/api/`, frontend `:4200` proxied at `/`, orchestrator). No per-app Dockerfiles.
  - `var/docker/docker-build.sh` references `--target dist`/`--target devcontainer`, but `Dockerfile.dev` has **no
    named stages** (discrepancy — the flags are inert).
- **`docker-compose.yaml`** (self-hosted): `poscally` app (`ghcr.io/gitroomhq/poscally-app:latest`, host `4007`→`5000`),
  `poscally-postgres` (`postgres:17-alpine`), `poscally-redis` (`redis:7.2`), Spotlight (Sentry), and a full Temporal
  stack (`temporal`, `temporal-elasticsearch`, `temporal-postgresql`, `temporal-admin-tools`, `temporal-ui`).
- **`docker-compose.dev.yaml`** (dev-only): Postgres, Redis, pgAdmin, RedisInsight + the same Temporal stack; the app
  runs on the host via pm2.

### 15.2 CI/CD — GitHub Actions (`.github/workflows/`)

| Workflow | Trigger | Purpose |
|---|---|---|
| `build-containers.yml` | tag push + manual | Multi-arch image build → `ghcr.io/gitroomhq/poscally-app:<ver>-arm64/amd64` + manifest → `latest`. **Canonical release path.** |
| `build.yml` | push/PR | Node 22 + pnpm install + `pnpm run build` (build gate). |
| `eslint` | push/PR | SARIF eslint for backend/frontend (`continue-on-error`). |
| `codeql.yml` | push to main | CodeQL SAST (JS/TS). |
| `build-extension.yaml` / `publish-extension.yml` | manual | Build extension zip → Nextcloud staging / Chrome Web Store publish. |
| `stale.yml` | cron | Close inactive issues/PRs. |
| `issue-label-triggers.yml` | issue labeled | Auto-close redirected public-website issues. |

### 15.3 Jenkins + SonarQube

`/Jenkins/` has `Build.Jenkinsfile` (push) and `BuildPR.Jenkinsfile` (PR-decoration); both install Node/pnpm, build,
then run the Sonar Scanner against `sonar-project.properties` (`sonar.projectKey=gitroomhq_poscally-app_...`).

### 15.4 Deployment targets

- **Self-hosted (primary):** `docker-compose.yaml` all-in-one; `IS_GENERAL: 'true'`, `STORAGE_PROVIDER: 'local'`.
- **Hosted SaaS:** same image; `IS_GENERAL` gates `poscally.com` branding/analytics.
- **Railway:** `railway.toml` is a minimal Nixpacks setup phase only (relies on `Dockerfile.dev`).
- **Kubernetes:** no committed manifests (only a `kompose.volume.type: configMap` label on `temporal`).

### 15.5 Known drift in infra

- Node/pnpm version inconsistency across `build.yml` (Node 22 / pnpm 10), Jenkins/copilot-instructions
  (Node 20 / pnpm 8), and `Dockerfile.dev` (Node 22.20 / pnpm 10.6).
- `.dockerignore`/scripts reference legacy `apps/workers`, `apps/cron` paths that no longer exist.
- ESLint workflow installs eslint via npm instead of pnpm.

---

## 16. Cross-cutting concerns

- **Multi-tenancy:** `organizationId` on virtually every tenant row, used as a Temporal search attribute and as a
  throttler key. RBAC via `UserOrganization.role` + CASL `@CheckPolicies` gated by subscription tier.
- **Reliability / idempotency:** the reversible `postPending` → read-only `checkPostStatus` → irreversible
  `finalizePost` handshake; `maximumAttempts: 1` on mutations; `heartbeatTimeout` on long publish/comment proxies;
  terminate-existing on reschedule; the `missingPostWorkflow` sweep recovers stuck `QUEUE` posts via the `poke` signal.
- **Temporal versioning discipline (immutable workflows):** never edit a workflow file on `main`; the lifecycle is
  encoded as a *documented* set of enqueue call-sites that must all move together.
- **Provider extensibility:** providers are open-set strings + an interface, not an enum; specific logic lives only in
  the provider implementations. Registry + `ModuleRef`-based `@Tool`/`@ThirdParty`/`@Video`/`@Plug` decoration is the
  standard extension idiom.
- **SSRF hardening:** `SSRF`-safe dispatcher used for webhooks, remote uploads, and `SocialAbstract.fetch`; easily
  toggled off for trusted private networks via `DISABLE_SSRF_PROTECTION`.

---

## 17. Testing

- **Framework:** Jest 29 (root, `@nx/jest` preset) + `jest-junit` to `reports/junit.xml`; `ts-jest`; jsdom/node envs;
  `@testing-library/react`. Vitest is installed but unused (no config).
- **Coverage:** `pnpm test` runs with `--coverage`.
- **Current state:** the repo contains **zero committed test files** (`*.test.ts(x)`/`*.spec.ts(x)` = 0). The only
  evidence of prior testing is a stale `reports/junit.xml` (a `PermissionsService` suite, 11 tests, 2025-03-24).
  The `@nx/jest` helper (`getJestProjects`) returns an empty projects list without an `nx.json`, so `pnpm test` likely
  errors or no-ops.

---

## 18. Key file reference

| Area | Path |
|---|---|
| Backend bootstrap | `apps/backend/src/main.ts`, `apps/backend/src/app.module.ts`, `apps/backend/src/api/api.module.ts` |
| Auth | `apps/backend/src/services/auth/auth.middleware.ts`, `permissions/*`, `providers/*` |
| Post flow | `apps/backend/src/api/routes/posts.controller.ts`, `libraries/nestjs-libraries/src/database/prisma/posts/posts.service.ts` |
| Orchestrator | `apps/orchestrator/src/main.ts`, `apps/orchestrator/src/app.module.ts` |
| Workflows | `apps/orchestrator/src/workflows/index.ts`, `.../post-workflows/post.workflow.v1.0.7.ts` |
| Activities | `apps/orchestrator/src/activities/*.activity.ts` |
| Temporal module | `libraries/nestjs-libraries/src/temporal/temporal.module.ts`, `temporal.heartbeat.ts`, `infinite.workflow.register.ts` |
| Prisma schema | `libraries/nestjs-libraries/src/database/prisma/schema.prisma` |
| Database DI | `libraries/nestjs-libraries/src/database/prisma/database.module.ts`, `prisma.service.ts` |
| Provider interface | `libraries/nestjs-libraries/src/integrations/social/social.integrations.interface.ts`, `social.abstract.ts`, `integration.manager.ts` |
| Provider example | `libraries/nestjs-libraries/src/integrations/social/x.provider.ts` |
| Frontend root layout | `apps/frontend/src/app/(app)/layout.tsx`, `(app)/(site)/layout.tsx` |
| Frontend fetch | `libraries/helpers/src/utils/custom.fetch.{tsx,func.ts}`, `apps/frontend/src/components/layout/layout.context.tsx` |
| Frontend design | `apps/frontend/src/app/{colors.scss,global.scss}`, `apps/frontend/tailwind.config.cjs` |
| Composer store | `apps/frontend/src/components/new-launch/store.ts` |
| Schema SQL mirror | `schema.sql` |

---

*Generated from a full repository exploration. Where product docs (`prd.md`) sketch a future/target state (mobile apps,
more granular post states, per-destination status), this file reflects the current shipped code.*
