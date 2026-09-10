# Poscally.co — Developer MVP PRD

**Version:** 1.1  
**Date:** August 2026  
**Audience:** Engineering day-to-day build reference  
**Source:** Condensed from the Developer MVP Product Requirements Document

This document is the developer’s build brief for the web application, iOS application, Android application, and shared platform services. The full strategic PRD remains a background product reference only.

---

## Core instruction

Build the complete publishing lifecycle first. A user must be able to:

1. Connect accounts
2. Create content
3. Schedule it
4. Close the application
5. Have it publish correctly
6. Receive the result
7. Review basic performance

**Reliability is more important than additional features.** Duplicate publishing, incorrect times, and draft loss are release-blocking defects.

---

## 0. Build summary

### Product promise

Poscally is a fast, simple, and mobile-first social media management platform for creators, freelancers, small businesses, and social media managers. It provides one place to create, schedule, publish, and understand content across multiple social platforms.

### Build priorities

1. Reliable publishing and accurate scheduling
2. A clean composer that supports one shared post with platform-specific variations
3. A useful web calendar and a genuinely usable mobile publishing experience
4. Clear publishing status, errors, and recovery actions
5. Basic analytics that explain performance without overwhelming users
6. Practical AI tools that assist content creation but never publish automatically

### MVP applications

| Application | Primary purpose |
|---|---|
| Responsive web application | Detailed planning, high-volume scheduling, account management, analytics, settings, and billing |
| iOS application | Content capture, mobile composing, scheduling, approvals, notifications, and basic analytics |
| Android application | Same core mobile capabilities as iOS |
| Shared backend services | Authentication, workspaces, publishing, integrations, media processing, analytics, AI, notifications, and billing |

### MVP social platforms

Use **official platform APIs only**. Where a platform does not permit direct publishing for a selected account type or post format, Poscally must use an assisted publishing flow or clearly mark the feature as unavailable. Do not claim support until the workflow has been successfully tested.

| Platform | Minimum MVP support |
|---|---|
| Instagram | Personal accounts and professional Business or Creator accounts. Eligible image posts, carousels, video or Reels, captions, and available analytics |
| Facebook | Personal profiles, Professional Mode profiles, and Business Pages. Eligible text, image, multi-image, video, and link posts, plus available analytics |
| LinkedIn | Member profiles and Company Pages, limited to publishing and analytics LinkedIn officially allows for each account type |
| TikTok | Personal and business accounts. Eligible video posts, captions, visibility options, direct or assisted publishing, and available video analytics |
| YouTube | Channels. Eligible standard video uploads and Shorts, titles, descriptions, thumbnails, scheduling, and available video analytics |
| Threads | Eligible profiles. Text, links, images, video, and available analytics through the official Threads API |
| Pinterest | Personal and business accounts. Eligible image and video Pins, titles, descriptions, links, board selection, and available analytics |

**Do not include X, Bluesky, or Google Business Profile in the MVP Connections page unless scope changes later.**

### MVP boundary

Do **not** build in the first release:

- Social inbox or direct message management
- Social listening or competitor tracking
- Paid advertising management
- Influencer discovery
- Advanced agency portals or white-label client portals
- Custom enterprise permissions, SSO, or directory sync
- Advanced editing tools or a Canva replacement
- Predictive post performance scoring
- Autonomous AI publishing
- Unlimited social platform integrations
- Multi-stage approval workflows
- Advanced campaigns and complex recurring automation

---

## 1. Product scope and principles

### 1.1 Target users

- Independent creators managing several social profiles
- Freelancers and consultants publishing their own content or handling a small number of clients
- Small business owners who need consistency without learning enterprise software
- Social media managers handling several accounts and a shared calendar

### 1.2 Product rules

| Rule | Developer interpretation |
|---|---|
| Simple by default | Primary workflows must be obvious. Advanced settings stay collapsed until needed |
| Mobile is a complete product | Users must be able to create, schedule, approve, and recover failed posts from mobile |
| Never lose work | Autosave drafts, preserve uploaded media, and recover interrupted sessions |
| Status is always clear | Every post and every platform destination has a visible state |
| Errors are actionable | Show what failed, which account was affected, and what the user can do next |
| One post, multiple versions | A shared base post can have separate platform captions, media, and schedules |
| AI assists only | AI output is editable and never publishes without user confirmation |
| Reliability before expansion | Duplicate publishing, incorrect times, and draft loss are release-blocking defects |

---

## 2. Core platform structure

### 2.1 Data hierarchy

| Object | Required relationship and purpose |
|---|---|
| User | A person with authentication, profile, preferences, and workspace memberships |
| Organisation | Subscription and ownership layer. Owns billing and one or more workspaces |
| Workspace | A brand, business, or client. Contains social accounts, posts, media, members, and analytics |
| Social account | A connected publishing destination belonging to one workspace |
| Post | The shared content object containing base content, selected accounts, media, and workflow state |
| Publishing destination | One platform-specific version of a post, with its own caption, media, schedule, result, and analytics |
| Media asset | Reusable image or video stored within a workspace |
| Subscription | Plan, entitlements, usage, payment status, and billing owner for an organisation |

### 2.2 Required post states

| State | Meaning |
|---|---|
| Draft | Saved but not scheduled |
| Awaiting approval | Submitted to an approver and cannot publish yet |
| Changes requested | Returned to the creator for edits |
| Approved | Allowed to be scheduled or published |
| Scheduled | Publishing jobs exist for a future time or queue slot |
| Preparing | Media and account checks are running |
| Publishing | One or more platform requests are in progress |
| Published | Every selected destination published successfully |
| Partially published | Some destinations succeeded and others failed |
| Failed | No remaining destination can complete without retry or user action |
| Cancelled | Future publishing was intentionally stopped |

### 2.3 Cross-device behaviour

- Web and mobile use the same users, workspaces, drafts, posts, schedules, permissions, and analytics records
- A draft saved on mobile must appear on web
- A schedule changed on web must update on mobile
- Notifications must deep link into the correct workspace and object
- Simultaneous edits must not silently overwrite meaningful changes

---

## 3. Web application

### 3.1 Design direction

The supplied PostBridge screens are a **structural reference only**. Use the same clear left-sidebar shell, generous desktop canvas, simple cards, and direct empty states. Apply Poscally branding, typography, and spacing. Do not copy the PostBridge logo, wording, or green accent.

Poscally must use its **blue primary colour (`#2563EB`)** and a cleaner Apple-inspired visual treatment.

| Area | Required layout |
|---|---|
| Desktop shell | Fixed left sidebar approximately 230–250 px wide, with a thin divider. Main content fills the remaining width |
| Main canvas | Light neutral grey page background with white content cards, subtle borders, and restrained shadows |
| Page spacing | Approximately 24–32 px page padding and clear vertical separation between page heading, controls, and content |
| Primary actions | Poscally blue for Create Post, active states, selected tabs, and primary CTAs. Do not use green |
| Responsive behaviour | Collapse the sidebar to an icon rail or drawer on smaller desktop/tablet widths. Mobile uses the separate mobile navigation specification |
| Empty states | Centred title, one short explanation, and one clear action. Avoid large empty dashboards with multiple competing prompts |

### 3.2 Left sidebar navigation

The sidebar is the persistent navigation. It remains visible on normal desktop widths and scrolls independently only when required. The selected page uses a soft blue-tinted background and blue icon/text treatment.

| Sidebar area | Items and behaviour |
|---|---|
| Brand header | Poscally logo and wordmark at the top |
| Workspace | Current workspace row with home icon, workspace name, and dropdown. Clicking the row opens Workspace Home; the dropdown switches or creates workspaces |
| Primary action | Full-width **Create Post** button directly below the workspace selector |
| Create | New Post and Bulk Tools. **The Studio section must not exist anywhere in Poscally** |
| Posts | Calendar, All, Scheduled, Posted, Drafts, and Analytics. “Posted” is the navigation label; the underlying system status remains Published |
| Workspace | Connections and Teams |
| Configuration | Settings, API Keys, and Billing |
| Support | Share Feedback, Referral, and Docs only. Remove Stay Updated, Growth Guide, and any other support items |
| Account footer | Pinned to the bottom. Avatar, account name, current plan, and a menu for profile, workspace switching, and sign out |

### 3.3 Workspace Home

Opened through the workspace row at the top of the sidebar. It is an operational summary, not a large analytics dashboard.

Required blocks:

- **Attention Required:** failed posts, disconnected accounts, approval tasks, and payment issues relevant to the current user
- Next scheduled post and a short list of upcoming posts
- Counts for Drafts, Scheduled, Posted, and Failed
- Connected account health and the most urgent reconnect action
- A short recent-performance summary when analytics data exists
- Quick actions for Create Post, Connect Account, and View Calendar

### 3.4 New Post entry screen and composer

Selecting Create Post or New Post opens a simple “Create a new post” entry screen with four large content-type cards.

| Content card | Behaviour |
|---|---|
| Text Post | Starts a text-first composer and shows only platforms that support the selected text format |
| Image Post | Starts the composer with image upload or Media Library selection |
| Video Post | Starts the composer with video upload, processing status, and platform-specific video requirements |
| Story Post | Shown only for platforms and account types that support Story publishing. Use assisted/manual publishing where direct publishing is unavailable |

Additional rules:

- Show small platform icons on each card to indicate supported destinations
- If no social accounts are connected, show one full-width **Connect Your Social Media Accounts** callout with a Connect Accounts button
- After a type is selected, open the full composer. On wide screens use a two- or three-panel layout: content/media, platform variations and preview, then schedule/publish controls
- Composer must include account selection, shared caption, media, platform-specific variations, preview, validation, autosave, Save Draft, Publish Now, Schedule, Add to Queue, and Submit for Approval where enabled
- On narrower screens, collapse the composer into clear steps or tabs

### 3.5 Bulk Tools

Bulk Tools replaces any need for a Studio navigation item.

| Tool | MVP behaviour |
|---|---|
| Bulk Video Upload | Upload multiple videos, create one draft per file, assign accounts, and schedule each item |
| Bulk Image Upload | Upload multiple images, create one draft per file or grouped carousel, assign accounts, and schedule each item |
| Bulk Video Creation | Do not include as an active MVP feature unless separately approved. It may appear later as Coming Soon, not as a broken control |

### 3.6 Calendar

- Page title at top left. Centre the current month or week with previous and next controls
- Top-right controls: platform/account filter and Month/Week view switch. Agenda may be offered if already implemented
- Month view uses a full-width seven-column calendar grid with day labels and clear current-day treatment in Poscally blue
- Scheduled content appears as compact cards with thumbnail, time, platform icons, and status
- Clicking an empty date opens the composer with the selected date prefilled
- Clicking a post opens the post detail/editor. Dragging may reschedule on desktop after confirmation
- When no content exists, the calendar still renders normally; avoid repeating “No posts” in every cell

### 3.7 All, Scheduled, Posted, and Drafts

These pages use the same list/card system with different default filters.

| Page | Required state |
|---|---|
| All | Every draft, scheduled, publishing, posted, partially posted, and failed item the user can access |
| Scheduled | Future scheduled and queued posts |
| Posted | Successfully published posts. Backend status remains Published |
| Drafts | Saved content that is not currently scheduled |

- Empty state: centred page-specific heading, one sentence, and Create Post button
- Populated state: thumbnail, caption preview, platforms, scheduled/published time, status, and quick actions
- Provide search and filters when data exists, not as unnecessary controls in the empty state
- Common actions: edit, duplicate, reschedule, cancel, delete eligible draft, and retry failed destination

### 3.8 Analytics

- Two primary tabs: **Overview** and **Posts**
- Overview: workspace/account totals, period comparison, top content, format performance, publishing consistency, and plain-language insights
- Posts: sortable list of published posts with destination-level metrics
- If analytics is not in the current plan, show one gated state with the benefit, required plan, and View Plans button
- Do not expose unavailable platform metrics as zero. Show last updated time and missing-data explanation

### 3.9 Connections

One large white card containing the MVP platforms only.

Before connection: platform icon and Connect button.  
After connection: account avatar/name, connection state, last sync, reconnect, and disconnect.  
Allow filtering when a workspace has many connected accounts.

### 3.10 Teams

- Page heading and short description at top
- If team creation is plan-gated, show one compact upgrade banner rather than repeated upgrade prompts
- Main content card lists members, role, status, and actions
- Empty state: “No Team Members Yet” and Invite Member when eligible
- Users who can join a team but cannot create one should still be able to accept invitations without upgrading

### 3.11 Settings, API Keys, and Billing

| Page | Ideal layout |
|---|---|
| Settings | Tabbed or sectioned cards for Profile, Email, Password and Security, Notification Preferences, Platform Preferences, Weekly Posting Goal, Queue, and Connected Apps |
| API Keys | Plan-gated page with Create Key, active/revoked key list, one-time key reveal, revoke action, webhook URL, and API documentation link. MCP/AI-agent setup is post-MVP unless separately approved |
| Billing | Monthly/Yearly switch and three plan cards. Show plan name, audience, price, included limits, current plan, and clear upgrade/downgrade action. Pricing values must come from Poscally configuration, not reference screenshots |

MVP plan structure: **Creator**, **Pro**, and **Agency**.

### 3.12 Support and documentation

- Share Feedback opens a simple feedback form or support conversation
- Referral opens the Poscally referral page. Commission wording must come from the final commercial policy
- Docs opens a separate help centre with search and categories: Getting Started, Social Connections, Scheduling, Media Limits, Account and Billing, Troubleshooting, API, Integrations, and FAQ

### 3.13 Web layout acceptance criteria

- The sidebar contains no Studio item and no unapproved support items
- All primary pages use the same app shell, spacing, typography, active-state treatment, and Poscally blue accent
- A user can reach Create Post, Calendar, account connections, and settings in one click from the sidebar
- Empty, populated, loading, locked, and error states are defined for each primary page
- The layout remains usable at common laptop widths without horizontal page scrolling

---

## 4. Mobile applications

### 4.1 Bottom navigation

| Tab | Purpose |
|---|---|
| Home | Attention items, next post, today’s schedule, account health, and quick actions |
| Calendar | Day, agenda, and compact week planning views |
| Create | Central action to capture or create content |
| Posts | Drafts, scheduled, published, and failed posts |
| Analytics | Basic metrics, top content, and short insights |

### 4.2 Mobile composer flow

1. Capture or select media, or choose an existing Media Library asset
2. Write the shared caption
3. Select social accounts
4. Review and edit platform variations
5. Select Publish Now, Schedule, Queue, Draft, or Approval
6. Review warnings and previews
7. Confirm the action

### 4.3 Native mobile requirements

- Persistent login. Do not force login on every application open
- Native sharing of images, videos, links, and text into Poscally
- Offline draft creation and later synchronisation
- Push notifications with deep links
- Background media uploads where the operating system permits
- Mobile approval screen with Approve, Request Changes, and Comment
- Failed post recovery and account reconnection
- One-handed layout using bottom sheets and touch-friendly controls

---

## 5. Publishing engine

### 5.1 Required publishing modes

- Publish Now
- Schedule for a specific date and time
- Add to the next available queue slot
- Save as Draft
- Submit for Approval
- Manual publishing reminder when direct publishing is not supported

### 5.2 Publishing job model

**Critical architecture rule:** one Poscally post may target several social accounts, but each account must create an independent publishing destination and job. This allows Instagram to succeed while LinkedIn fails, without republishing the successful destination.

| Job requirement | Expected behaviour |
|---|---|
| Unique execution identity | Every destination has a unique job and idempotency key |
| Validation | Validate while composing, when scheduling, and again shortly before publishing |
| Media readiness | Do not publish until required media processing is complete |
| Timezone accuracy | Store the selected timezone and the universal execution time |
| Duplicate prevention | Repeated jobs, retries, or timeouts must not create duplicate platform posts |
| Retry handling | Retry temporary platform and network failures using controlled backoff |
| Permanent failures | Stop retries for invalid content, lost permissions, or unsupported formats |
| Partial success | Show destination-level results and allow retry only for failed destinations |
| Background operation | Publishing must continue when web or mobile is closed |
| History | Store attempts, responses, timestamps, errors, and the final platform post identifier |

### 5.3 Validation levels

| Level | Examples |
|---|---|
| Blocking error | Disconnected account, character limit exceeded, unsupported media, missing approval, or invalid time |
| Warning | Low resolution media, possible crop issue, similar recent content, or unavailable link preview |
| Recommendation | Suggested posting time, alternative text, shorter caption, or stronger format |

### 5.4 Failure recovery

- Preserve all caption, media, schedule, and account selections
- Explain the affected platform and reason in plain language
- Offer the relevant action: reconnect, edit, replace media, retry, reschedule, or complete manually
- Never retry successful destinations when one destination fails

---

## 6. Social platform integrations

Shared requirements:

- Use official platform authentication. Never collect the user’s platform password
- Store and refresh platform tokens securely
- Maintain a capability map for supported formats and analytics per platform and account type
- Only show composer options supported by the selected platform
- Show connection state, last successful sync, and reconnect action
- Revalidate affected scheduled posts after an account is reconnected

**Launch rule:** a format is not considered supported until authentication, validation, publishing, error handling, and analytics have been tested successfully through the official integration.

---

## 7. Analytics

### 7.1 MVP views

- Workspace overview
- Individual social account overview
- Individual post and destination performance
- Date range selection and comparison with the previous period
- Top performing content
- Basic format comparison
- Publishing consistency
- Visible data freshness and missing-data explanations

### 7.2 Metrics

Do not display an unavailable metric as zero. Store the platform source, internal metric definition, and last synchronisation time.

- Posts published
- Audience size and audience growth where available
- Reach or impressions where available
- Engagement and engagement rate
- Video views and watch metrics where available
- Top posts and performance compared with the account’s recent baseline

### 7.3 Plain-language insights

- Explain meaningful period changes
- Identify the strongest content format or platform
- Identify major consistency changes
- Reference the actual data used
- Use cautious language when the cause is uncertain

---

## 8. AI features

| Feature | Required behaviour |
|---|---|
| Caption generation | Generate editable caption options from a topic or instruction |
| Rewrite | Improve clarity, shorten, expand, or change tone. Show the result before replacement |
| Platform adaptation | Create platform-appropriate versions while respecting known limits |
| Hashtag suggestions | Provide relevant suggestions without claiming guaranteed growth |
| Alternative text | Suggest concise image descriptions for accessibility |
| Content ideas | Generate simple ideas that can be saved as drafts |
| Analytics summary | Turn validated analytics data into a clear summary |

Safeguards:

- AI is optional and manual editing must always remain available
- AI output must never replace existing content without user action
- AI generated content must never publish without explicit user confirmation
- An AI failure must not affect the saved draft
- Analytics summaries must use validated internal data and must not invent causes

---

## 9. Notifications

### 9.1 Channels

- In-application notifications
- Mobile push notifications
- Transactional email

### 9.2 MVP events

| Category | Events |
|---|---|
| Publishing | Published, failed, partially published, retry planned, manual action required |
| Accounts | Reconnection required, permission problem, account disconnected |
| Approvals | Approval requested, approved, changes requested, and comment mention |
| Workspace | Invitation, role changed, and access removed |
| Billing | Trial ending, payment success, payment failure, and subscription change |
| Security | Password change, new login, and session revocation |

### 9.3 Rules

- Actionable notifications deep link to the correct workspace and object
- Critical failures remain visible until acknowledged or resolved
- Duplicate platform events must not generate duplicate notifications
- Users can disable optional success and insight notifications, but essential security notifications remain enabled

---

## 10. Subscription and billing

### 10.1 MVP billing

- Time-limited trial
- Monthly and annual billing
- Creator, Pro, and Agency plan structure
- Secure card payment through a compliant billing provider
- Billing owner and organisation subscription
- Plan upgrade, downgrade, and cancellation
- Payment failure, retry, and grace period
- Invoices and receipts
- Central plan entitlement checks

### 10.2 Entitlement areas

- Number of active workspaces
- Number of connected social accounts
- Number of team members
- AI allowance
- Media storage
- Analytics and report access

**Billing rule:** the interface and backend must use the same entitlement source. A successful upgrade must unlock features immediately. A downgrade must not silently delete user data.

---

## 11. Settings, roles, and user management

### 11.1 Personal settings

- Profile, email, and password
- Timezone, language, and date format
- Light, dark, or system appearance
- Notification preferences
- Active sessions and sign out from other devices

### 11.2 Workspace settings

- Workspace name, logo, and timezone
- Connected social accounts
- Publishing defaults
- Queue schedule
- Team members and roles
- Approval requirement and default approver where enabled
- Archive and protected deletion

### 11.3 MVP roles

| Role | Core permissions |
|---|---|
| Workspace Owner | Full workspace control, team, accounts, settings, and deletion |
| Administrator | Manage accounts, members, workflows, and analytics |
| Content Manager | Create, edit, schedule, publish, retry, and view analytics |
| Contributor | Create drafts, upload media, and submit for approval |
| Approver | Review, approve, request changes, and comment |
| Viewer | Read-only access to permitted content and analytics |

**Permission rule:** permissions must be enforced on the server. Hiding a button is not sufficient. Workspace data must remain isolated.

---

## 12. Primary user flows

### 12.1 Onboarding

1. Create account and verify email
2. Create first workspace and choose timezone
3. Connect at least one social account
4. Create or import the first post
5. Schedule the post
6. Land on Home with a clear next action

### 12.2 Create and schedule a post

1. Open Create
2. Select accounts
3. Enter caption and add media
4. Adjust platform variations
5. Review validation and previews
6. Select date, time, or queue slot
7. Confirm scheduling
8. Create independent destination jobs and update the calendar

### 12.3 Failed post recovery

1. Publishing fails and the destination is marked Failed
2. Create an in-application notification and an enabled critical alert
3. Open the destination failure details
4. Explain the cause and available action
5. User reconnects, edits, replaces media, retries, or reschedules
6. Retry only the failed destination
7. Update the final result and history

### 12.4 Approval flow

1. Contributor submits a post to one approver
2. Approver receives a notification and opens the platform previews
3. Approver selects Approve or Request Changes and can add a comment
4. Creator edits and resubmits if required
5. Any visible edit after approval invalidates the previous approval

---

## 13. Non-functional requirements

### 13.1 Security and privacy

- Encrypted transport and secure password storage
- Secure storage of social platform tokens and payment references
- Server-side authorisation for every protected action
- Rate limiting on authentication and sensitive endpoints
- Audit logging for account, permission, publishing, and billing changes
- Protected account, workspace, and organisation deletion flows
- User data export and account deletion process
- Clear AI data processing disclosure

### 13.2 Performance and reliability

- Composer typing remains responsive during autosave
- Dashboard and calendar do not wait for unrelated analytics requests
- Media uploads show progress and failures can be retried
- Publishing jobs run independently of client sessions
- Mobile login persists between normal application sessions
- Monitoring exists for publishing success, platform errors, token failures, job delays, and billing failures
- Backups and recovery procedures are tested before general availability

### 13.3 Accessibility

- Keyboard-accessible primary web workflows
- Visible focus states and labelled controls
- Sufficient contrast and non-colour status indicators
- Scalable text and screen reader support
- Large mobile touch targets
- Reduced motion support

---

## 14. MVP acceptance criteria

A screen is not complete because it looks correct. It must work through the full user flow, preserve data, enforce permissions, include loading and error states, work on supported devices, and produce the correct backend result.

### 14.1 Release-blocking criteria

- A user can register, create a workspace, and connect a supported social account
- A user can create, autosave, reopen, and edit a draft on web and mobile
- A valid post can be published immediately, scheduled, and added to a queue
- Scheduled publishing works when the user closes the application
- Multi-platform posts create independent destination results
- A repeated job cannot create a duplicate platform post
- Failed destinations preserve content and can be retried independently
- Workspace permissions are enforced on the server and data remains isolated
- Timezone execution is correct across normal and daylight saving changes
- Analytics show data freshness and never convert unavailable data into zero
- AI failure does not damage the current draft or block manual publishing
- Billing processes one charge, activates the correct plan, and records the invoice
- Critical notifications are delivered and deep link correctly
- No unresolved critical security issue, routine draft loss, or incorrect account publishing remains

### 14.2 Final MVP journey

1. Create an account
2. Create a workspace
3. Connect social accounts
4. Create a post and add media
5. Create platform-specific variations
6. Save the draft
7. Schedule or queue the post
8. Close the application
9. Have the post publish correctly
10. Receive the result
11. Recover a failed destination if required
12. Review basic performance
13. Manage the subscription without contacting support

---

## 15. Explicitly out of scope for MVP

- Unified social inbox and direct message management
- Social listening and competitor tracking
- Paid advertising management
- Influencer discovery
- Advanced campaigns and complex recurring automation
- Advanced custom reports and white-label client portals
- Custom roles, enterprise single sign-on, and directory synchronisation
- Multi-stage approval workflows
- Professional video or image editing
- A Canva replacement
- Predictive post performance scoring
- Autonomous AI publishing
- Unlimited social platform integrations

---

## 16. Post-MVP order

| Priority | Expansion area |
|---|---|
| 1 | Stabilise publishing, token refresh, error mapping, mobile performance, and draft synchronisation |
| 2 | Recurring posts, advanced queues, bulk scheduling, templates, media folders, and campaigns |
| 3 | X and other validated platform integrations |
| 4 | Advanced analytics, reports, and stronger performance recommendations |
| 5 | Brand Voice, transcription, repurposing, and AI calendar planning |
| 6 | Agency workflows, client reviewers, white-label reports, and advanced permissions |
| 7 | Unified social inbox only after publishing operations are stable |

**Roadmap rule:** do not begin a major new module while publishing reliability, permission behaviour, or mobile stability remains below the agreed release target.

---

## 17. Developer handover checklist

- Implement the approved web sidebar exactly: no Studio; Support contains only Share Feedback, Referral, and Docs
- Confirm the MVP platform integration order and official API access
- Define the shared data model for organisation, workspace, post, destination, job, media, and analytics
- Define post and destination state transitions
- Define plan entitlements and permission checks before building screens
- Build the publishing engine and monitoring before polishing secondary features
- Use a shared design system across web and mobile, but design mobile workflows independently
- Create test accounts for every supported platform and content format
- Set up internal diagnostics for publishing jobs, platform responses, token failures, and billing events
- Complete the final MVP journey on web, iOS, and Android before general availability

---

# Current build status (codebase audit, August 2026)

This section maps the PRD against the current Poscally codebase (a Postiz/Gitroom fork with Poscally branding and a new web shell). Status keys:

- **Done** — implemented and aligned enough to use
- **Partial** — exists, but missing required behaviour, real data, or PRD fidelity
- **Gap** — required for MVP and not yet built to spec
- **Leftover** — inherited from the fork; hide, gate, or remove from MVP surfaces

---

## What is already in place

### Web shell and branding — Partial

The new app shell is the strongest completed slice of the MVP UI.

- Persistent 240 px left sidebar with Poscally logo, blue primary (`#2563EB`), and light canvas (`#f7f8fa`)
- Full-width Create Post button
- No Studio item
- Support limited to Share Feedback, Referral, and Docs
- Workspace Home route at `/overview`
- Create Post entry modal with Text / Image / Video / Story cards
- Bulk Tools page at `/media`
- Calendar at `/launches` with month/week and list filters
- Connections page limited to the seven MVP platforms
- Teams, Settings, API Keys, Billing, Docs, Referral, and Feedback screens exist
- Public landing pages exist for Instagram, Facebook, LinkedIn, TikTok, YouTube, Threads, Pinterest, plus extra inherited platforms

Gaps against §3.2:

- Sidebar has a separate **Overview** nav item. PRD says Workspace Home opens from the workspace row, not a dedicated Home item
- Missing **All** posts item
- Missing **API Keys** in Configuration
- Workspace row navigates to `/overview` but does **not** open a dropdown to switch or create workspaces
- Footer click logs the user out instead of opening a profile / workspace / sign-out menu
- Some inherited green/emerald focus styles remain (for example Connections search)

### Publishing engine — Partial (strong foundation)

This is the most important inherited backend and should stay the reliability spine.

- Temporal post workflows publish in the background after the client closes
- Each selected social account creates its own `Post` row (`group` + `integrationId`), so destinations can succeed or fail independently
- Latest workflow (`post.workflow.v1.0.7`) already treats irreversible publish mutations carefully to avoid duplicate posts
- States today: `DRAFT`, `QUEUE`, `PUBLISHED`, `ERROR`
- Queue slots, schedule, publish now, and draft save exist in the composer
- Token refresh workflow exists
- Email notifications for success/failure exist (`sendSuccessEmails`, `sendFailureEmails`)

Missing against §2.2 / §5:

- No first-class destination job identity beyond the `Post` row
- Missing states: Awaiting approval, Changes requested, Approved, Preparing, Publishing, Partially published, Cancelled
- No destination-level retry UI that only retries failed destinations
- No plain-language failure recovery panel with reconnect / edit / replace media / retry / complete manually
- Composer autosave is not implemented as a first-class “never lose work” behaviour

### Social integrations — Partial

Official OAuth providers already exist for all seven MVP platforms, plus many extras.

Present and usable as a starting point:

- Instagram (including standalone)
- Facebook
- LinkedIn profile and Company Page
- TikTok
- YouTube
- Threads
- Pinterest

Leftovers that must stay off the MVP Connections page: X, Bluesky, Mastodon, Reddit, Discord, Slack, Telegram, GMB, and others. They can remain in the backend, but they must not appear as supported MVP destinations.

Launch rule still applies: do not mark a format supported until auth, validation, publish, error handling, and analytics are tested on official APIs.

### Auth, billing, media, analytics, teams — Partial

| Area | What exists | What is missing |
|---|---|---|
| Auth | Register, login, email activate, forgot password, OAuth | Onboarding does not land on Workspace Home with a clear next action |
| Workspaces | `Organization` is the current workspace analogue | No Organisation → Workspace hierarchy. One org ≈ one workspace |
| Roles | `SUPERADMIN`, `ADMIN`, `USER` | Missing Owner, Content Manager, Contributor, Approver, Viewer |
| Billing | Stripe, monthly/yearly, checkout, portal, invoices | Plan names still map STANDARD/PRO/ULTIMATE rather than Creator/Pro/Agency; entitlements are channel/AI/API based, not the full PRD set |
| Media | Upload, library, processing | Bulk Tools currently uploads files into the library; it does not create one draft per file and schedule each item |
| Analytics | Overview/Posts tabs and a plan-gated empty state | Mock or incomplete metrics; no data-freshness rule; unavailable metrics can still appear as zero |
| Teams | Invite by email/link, Admin/User roles | Plan-gated upgrade banner and six-role model not implemented |
| API Keys | Create, one-time reveal, revoke, webhooks | Not linked from the sidebar; MCP/agent setup still exists elsewhere and should stay post-MVP |
| Docs / Feedback / Referral | Screens exist | Docs are category cards without articles; Feedback is client-only (no persistence); Referral commission copy is placeholder |
| Notifications | In-app list + transactional email | No mobile push, incomplete event coverage, limited deep linking |
| AI | CopilotKit chat and inherited generator tools | PRD caption/rewrite/hashtag/alt-text/idea/summary tools are not a controlled, non-publishing assistant set |
| Chrome extension | Exists | Does not replace iOS/Android |

### Native mobile — Gap

There is **no iOS or Android application**. The web app is responsive, and a Chrome extension exists, but none of §4 is implemented:

- Bottom tab navigation
- Native share-in
- Offline drafts
- Push notifications with deep links
- Background uploads
- Mobile approval screen

Treat mobile as a second product after the web publishing lifecycle is reliable, unless a React Native / Expo track is started in parallel against the same API.

---

## Gap analysis by PRD section

| PRD section | Status | Notes |
|---|---|---|
| 0. Web app shell | Partial | Sidebar and branding landed; nav items and workspace switcher still off-spec |
| 0. iOS / Android | Gap | Not started |
| 0. Shared backend | Partial | Strong publishing/auth/billing core; data model still org-centric, not org + workspace |
| 2.1 Data hierarchy | Partial | User, org, integration, post, media, subscription exist. Missing Workspace as a child of Organisation. Post group ≈ destination set |
| 2.2 Post states | Partial | Only 4 of 11 states |
| 2.3 Cross-device | Gap | No native clients; no conflict-safe simultaneous edit handling |
| 3.3 Workspace Home | Partial | UI exists with **hardcoded mock metrics and calendar** |
| 3.4 Composer | Partial | Entry cards + inherited composer. Type selection does not yet constrain platforms. No autosave. Story support not gated by capability map |
| 3.5 Bulk Tools | Partial | Upload + library only. Missing one-draft-per-file and per-item scheduling |
| 3.6 Calendar | Partial | Month/week/list exist. Confirm empty-cell noise, drag-to-reschedule confirmation, and Poscally blue current-day treatment |
| 3.7 Post lists | Partial | Scheduled / Posted / Drafts via `?state=`. Missing dedicated All nav and failed-destination retry actions |
| 3.8 Analytics | Partial | Tabs and gating exist; insights, freshness, and “never show zero for missing data” are not done |
| 3.9 Connections | Partial | MVP platform list is correct. Connect/reconnect/last-sync behaviour still needs official OAuth wiring and health state |
| 3.10 Teams | Partial | Invite works with 2 roles |
| 3.11 Settings / API / Billing | Partial | Pages exist; settings tabs, queue, weekly goal, and plan naming need alignment |
| 3.12 Support | Partial | Screens exist; content and persistence are thin |
| 4. Mobile | Gap | Not started |
| 5. Publishing engine | Partial | Best existing backend. Needs destination job model, extra states, recovery UX, and monitored retries |
| 6. Integrations | Partial | Providers exist; capability map and “tested = supported” gate are missing |
| 7. Analytics | Partial | Collection exists per provider in places; product views are incomplete |
| 8. AI | Partial | Inherited tools; must be constrained so AI never publishes |
| 9. Notifications | Partial | In-app + email; missing push and several event types |
| 10. Billing | Partial | Stripe works; plan/entitlement model needs a Poscally source of truth |
| 11. Roles | Gap | Server still uses Admin/User |
| 12. Approval flow | Gap | Current “submit for order” marketplace flow is not the PRD approver flow |
| 13. NFRs | Partial | HTTPS, password hashing, Stripe, Temporal isolation exist. Audit log, export/delete, monitoring dashboards, and a11y pass are incomplete |
| 14. Final journey | Partial | Possible on web for a happy-path schedule, but Home is mock, recovery is weak, analytics are incomplete, and mobile is absent |

---

## Feasible build plan

Do not start iOS/Android, extra platforms, or AI expansion until the web publishing lifecycle is honest and reliable. The steps below are ordered by the PRD core instruction.

### Phase 0 — Stop shipping mock or off-scope UI (1–3 days)

Goal: make the current shell truthful.

1. Wire Workspace Home to live counts: Drafts, Scheduled, Posted, Failed, next post, disconnected accounts. Remove hardcoded `128` / `36` / `4.73%` style metrics.
2. Align sidebar to §3.2:
   - Remove Overview as a primary nav item
   - Keep workspace row → `/overview`
   - Add All posts (`/launches?state=all`)
   - Add API Keys under Configuration
   - Replace footer logout-on-click with a menu (profile, workspaces, sign out)
3. Hide leftover MVP-out-of-scope surfaces from the product shell: Agents, Plugs marketplace, X/Bluesky/GMB on Connections, Studio-like generators.
4. Replace remaining green accents with Poscally blue.
5. Persist Share Feedback to the backend (or a support mailbox). Stop fake `setTimeout` success.

**Done when:** a new user sees real zeros/empty states, not demo dashboards.

### Phase 1 — Complete the web publishing lifecycle (1–2 weeks)

Goal: the final MVP journey works on web with the application closed.

1. **Composer**
   - Honour the selected content type (text/image/video/story) when filtering accounts
   - Add Connect Accounts empty callout when no integrations exist
   - Add autosave of drafts (debounce while typing; never block the keyboard)
   - Keep Save Draft, Publish Now, Schedule, and Add to Queue
2. **Bulk Tools**
   - Bulk image/video upload creates one draft (or grouped carousel) per selection
   - Allow account assignment and schedule/queue per item
   - Keep Bulk Video Creation as Coming Soon, not a dead button
3. **Calendar and lists**
   - Empty dates open the composer with that date
   - Drag-reschedule asks for confirmation
   - All / Scheduled / Posted / Drafts share one list component with empty, loading, and error states
   - Failed and partially published items are visible with retry
4. **Publishing reliability**
   - Keep independent destination jobs
   - Add Preparing / Publishing / Partially published / Failed / Cancelled at least at the group level, even if the Prisma enum is extended carefully with a migration
   - Destination failure panel: platform, reason, reconnect / edit / replace media / retry / complete manually
   - Retry only the failed destination
   - Confirm timezone + DST with a test matrix
5. **Connections**
   - Use the existing official OAuth providers, not a generic `/auth/oauth/:PLATFORM` guess
   - Show avatar, name, connected/needs-reconnect, last sync, reconnect, disconnect
   - After reconnect, revalidate scheduled posts for that account

**Done when:** a tester can connect one MVP account, schedule a post, close the browser, see it publish, and retry a forced failure without duplicating the successful destination.

### Phase 2 — Make Home, analytics, billing, and permissions real (1–2 weeks)

Goal: the rest of the web MVP is operational, not decorative.

1. **Workspace Home**
   - Attention Required from failed posts, `refreshNeeded` integrations, unpaid invoices, and pending approvals
   - Quick actions: Create Post, Connect Account, View Calendar
2. **Analytics**
   - Overview totals from stored provider metrics only
   - Posts table with destination-level metrics
   - Last synced timestamp
   - Missing metrics render as “Not available”, never `0`
   - One plan-gated state for ineligible plans
3. **Billing and entitlements**
   - Single source of truth for Creator / Pro / Agency (map existing Stripe products; do not hardcode screenshot prices)
   - Immediate unlock after upgrade
   - Downgrade never deletes posts, media, or connected accounts
4. **Teams and permissions**
   - Introduce the six MVP roles behind server checks
   - Contributors cannot publish
   - Approvers get a simple one-approver flow (not multi-stage)
   - Invitation accept must work without requiring the invitee to upgrade
5. **Settings**
   - Finish Profile, Email/Password/Security, notifications, timezone, queue times, weekly goal, connected apps
6. **Docs**
   - Fill Getting Started, Connections, Scheduling, Media Limits, Billing, Troubleshooting, API, FAQ with real Poscally copy

**Done when:** billing, permissions, and analytics do not contradict the backend, and Home is a useful operational screen.

### Phase 3 — Notifications, AI assist, and hardening (about 1 week)

1. Cover publishing, account, approval, workspace, billing, and security events in-app and by email
2. Deep link notifications to the workspace + post/destination
3. Keep critical failures visible until acknowledged
4. Add the seven AI tools as **optional composer actions** that insert only after confirm
5. Guarantee AI failure cannot overwrite the draft or trigger publish
6. Add monitoring for publish success rate, platform errors, token refresh failures, job delay, and billing failures
7. Accessibility pass on primary web flows

**Done when:** a failed publish emails and notifies with a working deep link, and AI cannot publish.

### Phase 4 — Native mobile (after web lifecycle is stable)

Do not start this while Phase 1 still has draft loss or duplicate publishing.

Suggested approach: one React Native / Expo app sharing the existing API, not two divergent codebases.

Order:

1. Auth with persistent session
2. Home / Calendar / Create / Posts / Analytics tabs
3. Composer flow from §4.2
4. Offline draft queue + sync
5. Push notifications + deep links
6. Native share-in
7. Approval and failed-post recovery

**Done when:** the final MVP journey in §14.2 works on web, iOS, and Android.

---

## Recommended near-term sequence (this sprint)

If only a few days are available, do this and nothing else:

1. Replace Workspace Home mock data with live SWR hooks (`useFetch` + one hook per resource)
2. Fix sidebar IA (All, API Keys, workspace dropdown, footer menu, no Overview item)
3. Fix Connections to use existing social OAuth, not a placeholder connect path
4. Add destination-level failure recovery on calendar/list items
5. Add composer autosave to `DRAFT`
6. Hide Agents and non-MVP platforms from the product UI

That sequence produces a product that can actually complete the publishing lifecycle, which is the only release-blocking promise in this PRD.

---

## Mapping inherited models to PRD language

Use these names in product copy even if the database still uses fork names. Change the schema only with a migration and without breaking existing users.

| PRD term | Current code |
|---|---|
| Organisation | Not separate. Billing lives on `Organization` |
| Workspace | `Organization` |
| Social account | `Integration` |
| Post (shared) | `Post.group` |
| Publishing destination | Individual `Post` row (`integrationId` + `group`) |
| Media asset | `Media` |
| Scheduled | `State.QUEUE` |
| Posted / Published | `State.PUBLISHED` |
| Failed | `State.ERROR` |
| Draft | `State.DRAFT` |
| Owner / Admin / etc. | `Role.SUPERADMIN` / `ADMIN` / `USER` |

When adding PRD states and roles, extend enums with a Prisma migration. Do not reuse marketplace fields (`submittedForOrder`) for the new approval flow.

---

## Explicit do-not-build list for the current codebase

Leave these alone until the publishing lifecycle is release-ready:

- Agents / MCP as a product surface
- Autopost / plugs marketplace
- Additional social networks on Connections
- Bulk Video Creation as a working feature
- Native mobile, until Phase 1 is done
- Custom roles beyond the six MVP roles
- Social inbox
- Recurring campaigns and advanced automation
- Changing existing Temporal workflow signatures; add a new workflow version instead
