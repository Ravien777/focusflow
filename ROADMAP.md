# FocusFlow Roadmap

## Overview

From a local-only habit tracker skeleton to a full, monetizable productivity platform. All estimates assume a single developer working full-time.

---

## Phase 0: Foundation & Polish (1-2 weeks)

Minimal investment to turn the skeleton into a ship-worthy product with basic UX expectations met.

| # | Feature | Effort | Why |
|---|---|---|---|
| 0.1 | **Real notifications** — replace `expo-notifications` mocks with real scheduled notifications using a native dev build | 2 days | Notifications are table stakes for retention |
| 0.2 | **Habit editing** — edit name, icon, color after creation (long-press or tap to edit) | 1 day | Current app has no edit flow; major UX gap |
| 0.3 | **Habit scheduling** — select which days of week a habit runs; streak only counts on scheduled days | 2 days | Streaks are unfair without this; core logic change |
| 0.4 | **Habit archive** — soft-delete habits (hide from main view, restore from archive) | 1 day | Prevents accidental data loss |
| 0.5 | **Dark mode** — theme state already exists in types; wire it to `useColorScheme` and style all screens | 2 days | High perceived value, low effort |
| 0.6 | **Onboarding flow** — 3-4 screen first-launch walkthrough explaining value prop and setting up first habit | 2 days | Reduces churn; sets expectation of value |

**Phase 0 total: ~10 days**

---

## Phase 1: Engagement & Stickiness (3-4 weeks)

Features that make users open the app daily and build the habit of using the app itself.

| # | Feature | Effort | Why |
|---|---|---|---|
| 1.1 | **Statistics dashboard** — completion heatmap (GitHub-style), weekly trends, best streaks, completion rate % | 5 days | Gives users a reason to open the app daily to see progress |
| 1.2 | **Gamification** — XP per check-in, levels, badges for milestones (7-day streak, 30-day streak, 100 check-ins, etc.) | 5 days | Dopamine loops; drives retention and shareability |
| 1.3 | **Habit templates** — curated sets: "Morning Routine", "Weight Loss", "Read More", "Mental Health", "Fitness" | 3 days | Lowers onboarding friction; upsell opportunity |
| 1.4 | **Link timer to habit** — when starting focus session, pick which habit you're working on; logs focused time per habit | 2 days | Unifies existing features into a cohesive experience |
| 1.5 | **Customizable timer intervals** — user-defined focus/break durations (not just 25/5) | 1 day | Simple quality-of-life improvement; premium-gateable |
| 1.6 | **Habit notes / journal** — attach a short text note to each check-in ("Felt great today", "Skipped lunch") | 2 days | Adds depth for power users |
| 1.7 | **Widget support** — iOS home screen widget + Android widget showing today's habits and quick check-in | 5 days | Passive engagement without opening app |

**Phase 1 total: ~23 days**

---

## Phase 2: Monetization Infrastructure (3-4 weeks)

The revenue engine. Nothing else matters if the app can't make money.

| # | Feature | Effort | Why |
|---|---|---|---|
| 2.1 | **Authentication** — Firebase Auth with email/password + Google and Apple sign-in | 5 days | Prerequisite for sync and revenue |
| 2.2 | **Cloud sync** — Firestore sync for habits, check-ins, settings, and timer logs; conflict resolution (last-write-wins initially) | 7 days | Users pay for data they can't afford to lose — this is your primary sell |
| 2.3 | **Freemium paywall** — RevenueCat or native in-app purchases; subscription products (monthly + yearly) | 5 days | Subscription infrastructure |
| 2.4 | **Free tier limits** — cap at 5 active habits, basic stats only, no sync, basic timer only | 2 days | Enforce the free/premium boundary cleanly |
| 2.5 | **Premium: streak freeze** — 1 free streak preservation per week when user misses a day | 2 days | High perceived value, low implementation cost |
| 2.6 | **Premium: advanced analytics** — predictive streaks (ML-based), trend lines, monthly reports, export CSV | 4 days | Visual value that justifies premium tier |
| 2.7 | **Premium: custom themes** — accent color picker, alternate icon sets, font options | 3 days | Cosmetic premium features convert well with low dev cost |

**Phase 2 total: ~28 days**

---

## Phase 3: Defensive Moats & Expansion (4-6 weeks)

Features that make FocusFlow hard to leave and hard to copy. These are competitive advantages, not just feature checkboxes.

| # | Feature | Effort | Why |
|---|---|---|---|
| 3.1 | **AI habit coach** — analyzes check-in patterns via on-device or server-side model; suggests optimal reminder times, detects slumps, offers encouragement | 10 days | Major differentiator; extremely hard for competitors to replicate well |
| 3.2 | **Accountability circles** — share progress with friends, send nudges, gentle competition (who has the best streak this week) | 10 days | Social lock-in; users can't leave without losing their circle |
| 3.3 | **Weekly/monthly review reports** — auto-generated PDF with charts, best streak, completion rate, coach notes; shareable to social media | 5 days | Viral potential + perceived value |
| 3.4 | **Apple Health / Google Fit integration** — auto-track steps, sleep, workouts as "health habits" with zero manual check-ins | 5 days | Passive data collection; reduces friction for health habits |
| 3.5 | **Calendar sync** — overlay habits on device calendar so users see them alongside appointments | 4 days | Integration lock-in; habit becomes part of daily planning |
| 3.6 | **Data export** — one-click export of all data to CSV, JSON, or PDF | 3 days | Trust signal + enterprise/power user request |
| 3.7 | **Habit challenges** — time-limited community challenges (e.g., "30-day meditation challenge") with leaderboards and completion certificates | 8 days | Engagement spikes via competition and FOMO |

**Phase 3 total: ~45 days**

---

## Effort Summary

| Phase | Duration | Key Outcome |
|---|---|---|
| **Phase 0: Foundation** | ~10 days | Ship-worthy product with basic UX |
| **Phase 1: Engagement** | ~23 days | Daily-use product with retention loops |
| **Phase 2: Monetization** | ~28 days | Revenue-generating business |
| **Phase 3: Moats** | ~45 days | Defensible product with competitive advantages |

**Total: ~106 days** from skeleton to full, monetized platform.

---

## Shortest Path to Revenue (MVP Launch)

If you want paying users ASAP, skip gamification and social features. Ship this minimal set:

1. **Phase 0** (Foundation) — 10 days
2. **Phase 1.1** (Statistics dashboard) — 5 days
3. **Phase 1.3** (Habit templates) — 3 days
4. **Phase 1.5** (Custom timer intervals) — 1 day
5. **Phase 2** (Monetization infrastructure) — 28 days

**Total: ~47 days** to a shippable freemium app. Everything else (widgets, AI coach, social, gamification) increases conversion and reduces churn, but this core path gets you to revenue first.
