# Reportify — Design System

> **Dark mode only · Fintech-inspired · Mobile-first · Offline-ready**
> React Native daily reporting app for doner shop employees, admins, and super admins.

---

## 1. Design Goals

- Minimalist and clean — no visual clutter
- Dark mode ONLY — deep dark backgrounds, not pure black
- Fast and intuitive — built for non-technical daily users
- One-hand optimized — key actions reachable by thumb
- Modern fintech-style UI — inspired by Linear, Notion Mobile, and clean admin dashboards
- Clear hierarchy and readability at small sizes

---

## 2. Color System

### Primary Palette

| Token | Hex | Usage |
|---|---|---|
| `color-primary` | `#7C6FFF` | Buttons, active states, FAB, highlights |
| `color-accent` | `#5B8DEF` | Gradient pair, links, info states |
| `color-primary-ghost` | `rgba(124,111,255,0.15)` | Ghost buttons, active nav icons |
| `color-primary-border` | `rgba(124,111,255,0.30)` | Secondary button borders |

### Background & Surfaces

| Token | Hex | Usage |
|---|---|---|
| `color-bg` | `#0E0D18` | App background (deep dark, not pure black) |
| `color-surface` | `#12111A` | Bottom nav, top bars, modal backgrounds |
| `color-card` | `#1A192A` | Cards, bottom sheets, elevated surfaces |
| `color-overlay` | `rgba(255,255,255,0.04)` | Report cards, stat tiles |
| `color-border` | `rgba(255,255,255,0.08)` | Dividers, card borders |
| `color-border-subtle` | `rgba(255,255,255,0.06)` | List item separators |

### Semantic Colors

| Token | Hex | Usage |
|---|---|---|
| `color-success` | `#44DC96` | Synced badge, success toast, delta positive |
| `color-warning` | `#FFB044` | Pending badge, offline chip, warning states |
| `color-error` | `#FF5A6E` | Error inputs, delete actions, error toast |
| `color-muted` | `#6B6880` | Placeholders, captions, secondary labels |

### Text Colors

| Token | Value | Usage |
|---|---|---|
| `text-primary` | `rgba(255,255,255,0.90)` | Headings, primary content |
| `text-secondary` | `rgba(255,255,255,0.65)` | Body text, descriptions |
| `text-tertiary` | `rgba(255,255,255,0.40)` | Placeholders, hints |
| `text-muted` | `#6B6880` | Labels, captions, metadata |

### Role Badge Colors

| Role | Background | Text |
|---|---|---|
| Employee | `rgba(124,111,255,0.13)` | `#9D94FF` |
| Admin | `rgba(124,111,255,0.13)` | `#9D94FF` |
| Super Admin | `rgba(91,141,239,0.15)` | `#7EB0FF` |
| Offline | `rgba(255,90,110,0.13)` | `#FF7A8A` |

### Gradient

```
Primary gradient: linear-gradient(135deg, #7C6FFF 0%, #5B8DEF 100%)
Used on: FAB, primary buttons, logo mark, avatar backgrounds
```

---

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| Title | 28px | 500 | 34px | Screen titles, report headings |
| Subtitle | 18px | 500 | 24px | Section headers, greetings |
| Body | 14px | 400 | 22px | Report content, descriptions |
| Small | 13px | 400 | 20px | Card previews, list content |
| Caption | 12px | 400 | 18px | Dates, metadata |
| Label | 11px | 500 | 14px | Uppercase section labels (+ `letter-spacing: 0.07em`) |
| Micro | 10px | 400 | 14px | Timestamps, char counts, nav labels |

### Font Family

```
Primary: System default sans-serif
  iOS     → SF Pro Display / SF Pro Text
  Android → Roboto / Google Sans
Mono    → SF Mono / Roboto Mono (used for hex values, codes)
```

### Usage Rules

- Headings: weight 500 only — never 600 or 700
- Body: weight 400
- Uppercase labels: always `font-size: 11px`, `letter-spacing: 0.06–0.08em`, `text-transform: uppercase`, `color: #6B6880`
- Line-height minimum 1.5 for body copy, 1.0 allowed for single-line UI labels

---

## 4. Spacing — 8pt Grid

All spacing uses multiples of 8pt.

| Token | Value | Common Use |
|---|---|---|
| `space-1` | 4px | Micro gaps (badge inner padding) |
| `space-2` | 8px | Tight component gaps |
| `space-3` | 12px | Card inner padding (compact) |
| `space-4` | 16px | Standard section padding |
| `space-5` | 20px | Screen horizontal padding |
| `space-6` | 24px | Section spacing |
| `space-8` | 32px | Large section breaks |
| `space-10` | 40px | Screen top padding |
| `space-12` | 48px | Bottom nav height buffer |

### Layout Rules

- Screen horizontal padding: `20px`
- Card inner padding: `14px 16px`
- Bottom nav height: `64px` (including safe area)
- FAB bottom offset: `24px` above bottom nav
- Section label margin-bottom: `8px`

---

## 5. Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | `6px` | Badges, pills, small chips |
| `radius-md` | `8–10px` | Inputs, toggles, small buttons |
| `radius-lg` | `12px` | Cards, report cards, filter chips |
| `radius-xl` | `14–16px` | Primary modals, large cards |
| `radius-2xl` | `18px` | Bottom sheets |
| `radius-full` | `999px` | Tab pills, avatar circles |
| `radius-phone` | `36px` | Phone frame corners |

---

## 6. Component Library

### 6.1 Buttons

#### Primary Button
```
Background: linear-gradient(135deg, #7C6FFF, #5B8DEF)
Text: #FFFFFF, 14px, weight 500
Border radius: 12px
Padding: 10px 20px
Min height: 44px (touch target)
Press state: scale(0.97), opacity 0.9
```

#### Secondary Button
```
Background: rgba(124,111,255,0.12)
Text: #9D94FF, 14px, weight 500
Border: 0.5px solid rgba(124,111,255,0.30)
Border radius: 12px
Padding: 10px 20px
Press state: background opacity +0.05
```

#### Disabled Button
```
Background: rgba(255,255,255,0.05)
Text: rgba(255,255,255,0.20)
Border radius: 12px
No press state
```

#### Destructive Button
```
Background: rgba(255,90,110,0.10)
Text: #FF7A8A, 14px, weight 500
Border: 0.5px solid rgba(255,90,110,0.20)
Border radius: 12px
```

---

### 6.2 Inputs

#### Default Input
```
Background: rgba(255,255,255,0.05)
Border: 0.5px solid rgba(255,255,255,0.10)
Border radius: 12px
Padding: 12px 14px
Font size: 14px
Text color: rgba(255,255,255,0.85)
Placeholder color: rgba(255,255,255,0.30)
Min height: 44px
```

#### Focused Input
```
Border: 0.5px solid #7C6FFF
Background: rgba(124,111,255,0.08)
Text color: rgba(255,255,255,0.90)
```

#### Error Input
```
Border: 0.5px solid #FF5A6E
Background: rgba(255,90,110,0.08)
Error message: font-size 11px, color #FF5A6E, margin-top 4px
```

#### Multiline Textarea
```
Same styles as default input
Min height: 120px
Line height: 1.5
resize: none
```

#### Input Label
```
Font size: 12px
Color: #6B6880
Margin bottom: 4px
```

---

### 6.3 Cards — Report Card

```
Background: rgba(255,255,255,0.04)
Border: 0.5px solid rgba(255,255,255,0.07)
Border radius: 14px
Padding: 14px 16px
Margin bottom: 8px

Structure:
  Row 1: [Report title (14px/500)] + [Status badge]
          [Date/time (12px, #6B6880)]
  Row 2: Preview text (13px, rgba(255,255,255,0.50), 2 lines max)

Press state: background rgba(255,255,255,0.07), scale(0.99)
```

---

### 6.4 Stat Cards (Dashboard tiles)

```
Background: rgba(255,255,255,0.04)
Border: 0.5px solid rgba(255,255,255,0.06)
Border radius: 12px
Padding: 12px

Value: 22px, weight 500, color #FFFFFF
Label: 11px, color #6B6880, margin-top 2px
Delta: 11px, color #44DC96 (positive) / #FFB044 (neutral), margin-top 4px

Grid: 2-column, gap 8px (employee/admin)
Grid: 4-column, gap 6px (super admin, smaller values)
```

---

### 6.5 Status Badges

#### Synced
```
Background: rgba(68,220,150,0.12)
Text: #44DC96
Dot: 5×5px circle, background #44DC96
Border radius: 6px, Padding: 3px 8px, Font: 11px/500
```

#### Pending
```
Background: rgba(255,176,68,0.13)
Text: #FFB044
Dot: 5×5px circle, background #FFB044
Border radius: 6px, Padding: 3px 8px, Font: 11px/500
```

#### Role badges: see Section 2 → Role Badge Colors

---

### 6.6 Bottom Navigation

```
Container:
  Background: #12111A
  Border top: 0.5px solid rgba(255,255,255,0.07)
  Height: 64px (includes safe area padding)
  Padding top: 10px, Padding bottom: 10px + safe area

Tab item (4 tabs: Dashboard, Reports, Stats, Profile):
  Icon container: 22×22px, border-radius 6px
  Icon: 16×16px SVG, stroke color #6B6880
  Label: 10px, color #6B6880
  Gap between icon + label: 3px

Active tab:
  Icon container: background rgba(124,111,255,0.15)
  Icon stroke: #7C6FFF
  Label color: #7C6FFF

Tabs: Dashboard · Reports · Stats · Profile
```

---

### 6.7 Floating Action Button (FAB)

```
Size: 52×52px (full) / 40×40px (compact)
Border radius: 16px (full) / 13px (compact)
Background: linear-gradient(135deg, #7C6FFF, #5B8DEF)
Shadow: 0 8px 24px rgba(124,111,255,0.40)
Icon: 22px plus (+) SVG, stroke #FFFFFF, stroke-width 2
Position: bottom-right, 24px above bottom nav, 20px from right edge
Press state: scale(0.93), shadow reduces
```

---

### 6.8 Toast Notifications

```
Container:
  Background: #1E1D29
  Border: 0.5px solid rgba(255,255,255,0.10)
  Border radius: 12px
  Padding: 10px 14px
  Display: flex, gap 10px

Success toast:
  Left border: 2.5px solid #44DC96
  Icon bg: rgba(68,220,150,0.15), icon stroke #44DC96

Error toast:
  Left border: 2.5px solid #FF5A6E
  Icon bg: rgba(255,90,110,0.15), icon stroke #FF5A6E

Title: 13px, rgba(255,255,255,0.80)
Subtitle: 11px, #6B6880, margin-top 1px

Animation: slide up from bottom, duration 280ms, ease-out
Auto dismiss: 3000ms
```

---

### 6.9 Bottom Sheet

```
Container:
  Background: #1A192A
  Border radius: 18px 18px 0 0
  Border: 0.5px solid rgba(255,255,255,0.10)
  Padding: 16px 20px 20px + safe area

Handle:
  Width: 36px, height: 4px
  Background: rgba(255,255,255,0.15)
  Border radius: 2px
  Margin: 0 auto 16px

Title: 15px, weight 500, rgba(255,255,255,0.90)

Option row:
  Padding: 11px 0
  Border bottom: 0.5px solid rgba(255,255,255,0.06) (except last)
  Icon container: 34×34px, radius 10px, background rgba(124,111,255,0.12)
  Label: 14px, rgba(255,255,255,0.80)
  Sub-label: 11px, #6B6880

Backdrop: rgba(0,0,0,0.60), tap to dismiss
Animation: slide up, duration 320ms, spring easing
```

---

### 6.10 Segmented Control (Shift / Period Toggle)

```
Container:
  Background: rgba(255,255,255,0.05)
  Border: 0.5px solid rgba(255,255,255,0.07)
  Border radius: 9px
  Padding: 3px

Active segment:
  Background: rgba(124,111,255,0.20)
  Text: #9D94FF, 11px, weight 500
  Border radius: 7px

Inactive segment:
  Text: #6B6880, 11px
  No background
```

---

### 6.11 Progress Bar

```
Track: height 4px, background rgba(255,255,255,0.08), border-radius 2px
Fill: linear-gradient(90deg, #7C6FFF, #5B8DEF)
Animation: width transition 600ms ease-out
```

---

### 6.12 Toggle Switch

```
Track: 28×16px, border-radius 8px
  Off: background rgba(255,255,255,0.10)
  On: background rgba(124,111,255,0.50)
Thumb: 12×12px, border-radius 50%, background #9D94FF (on) / rgba(255,255,255,0.40) (off)
Thumb position: 2px from edge
Transition: 200ms ease
```

---

### 6.13 Search Bar

```
Background: rgba(255,255,255,0.05)
Border: 0.5px solid rgba(255,255,255,0.09)
Border radius: 10px
Padding: 7px 10px
Icon: 12px search SVG, color rgba(255,255,255,0.30)
Placeholder: 11px, rgba(255,255,255,0.30)
Gap icon–text: 7px
```

---

## 7. Screen Specifications

### 7.1 Login Screen

**Purpose:** Fast, secure entry point. Clean, branded, minimal.

**Layout:**
```
[Logo mark — 44×44 gradient square, rounded 14px]
[App name — 19px/500 centered]
[Tagline — 11px/#6B6880 centered]
[24px gap]
[Email input]
[Password input]
[Forgot password — right-aligned, 10px, color-primary]
[Primary CTA: "Sign in"]
[Divider: "or continue with"]
[SSO button]
[Footer: encryption note — 10px/#6B6880]
```

**Logo mark:** Gradient background (`#7C6FFF → #5B8DEF`), white checkmark icon (represents completion/reporting).

---

### 7.2 Dashboard — Employee

**Purpose:** Quick status check. See today's reports, pending syncs, start new report.

**Layout:**
```
[Greeting: "Good evening, [Name] 👋"]
[Sub: day + date]
[Pending sync chip — top right]
[2-col stat grid: Reports today / Not synced]
[Section label: "Recent reports"]
[Report card × 2–3]
[FAB — bottom right, above nav]
[Bottom navigation]
```

**Role-specific:** No team data, no branch overview. Simple and focused.

---

### 7.3 Dashboard — Admin

**Purpose:** Branch-level operations overview.

**Layout:**
```
[Greeting + Admin badge]
[3-col stat grid: Reports / Pending / Staff on]
[Section label: "Team reports today"]
[Team report list — employee name + shift + status badge × 3–4]
[Section label: "Operations overview"]
[Progress bar with % label]
[Bottom navigation]
```

---

### 7.4 Dashboard — Super Admin

**Purpose:** Multi-branch command view. Data-heavy.

**Layout:**
```
[Header: "Overview" + Super Admin badge]
[Sub: All branches + date]
[2-col stat grid: Total reports / Branches active]
[2-col stat grid: Pending sync / Staff logged in]
[Section label: "Branch breakdown"]
[Mini bar chart — 3 branches (North / Central / South)]
[Bottom navigation]
```

---

### 7.5 Create Report Screen

**Purpose:** Speed. Minimal friction. One primary action.

**Layout:**
```
[Back chevron + "New Report" title]
[Shift selector: Morning / Afternoon / Evening — segmented control]
[Report details — multiline textarea, 6 rows]
[Character count — right-aligned, caption]
[Optional: Attach photo — collapsed row with chevron]
[Optional: Temperature log — collapsed row with chevron]
[Primary CTA: "Submit report" — full width]
[Footer note: "Saved locally · will sync when online"]
```

**UX principles:**
- Optional fields collapsed by default — zero friction for basic reports
- Textarea auto-focuses on screen open
- Submit triggers success toast + navigation back to Reports List
- Saved to local store immediately on any input (no draft loss)

---

### 7.6 Reports List

**Purpose:** Browse, search, filter all reports.

**Layout:**
```
[Header: "Reports" + filter icon]
[Search bar]
[Filter chips: All / Pending / Synced / This week]
[Report card list — scrollable]
  Each card: title, date, status badge, 2-line preview
[Bottom navigation]
[FAB — create new report]
```

**Interaction:**
- Tap card → Report detail view (not mocked, but expected)
- Long press → Bottom sheet with: Mark reviewed / Export PDF / Delete
- Filter chips update list in real time
- Empty state: illustration + "No reports yet" message

---

### 7.7 Statistics Screen

**Purpose:** Visual summary of reporting activity.

**Layout:**
```
[Header: "Statistics"]
[Period toggle: Daily / Weekly / Monthly]
[Section label: "Reports submitted"]
[Bar chart — 7-day view, active day highlighted]
[Divider]
[Section label: "Sync rate this week"]
[Line chart — trending upward]
[2-col stat grid: Sync rate % / Total reports]
[Bottom navigation]
```

**Chart specs:**
- Bar chart: bars use `rgba(124,111,255,0.35)` inactive, gradient active
- Line chart: stroke `linear-gradient(90deg, #7C6FFF → #5B8DEF)`, terminal dot `#5B8DEF`
- No axes lines — clean, minimal
- Chart height: ~56–70px (compact, readable at a glance)

---

### 7.8 Profile / Settings

**Purpose:** User identity, preferences, sign out.

**Layout:**
```
[Avatar: initials in gradient circle, 48×48px, radius 16px]
[Name — 14px/500 centered]
[Email — 11px/#6B6880 centered]
[Role + Branch badge — centered]
[Section: Account card]
  Full name / Branch / Role
[Section: Preferences card]
  Offline mode toggle
  Notifications toggle
  Auto-sync on wifi toggle
[Destructive: "Sign out" button]
[Bottom navigation]
```

---

## 8. UX Patterns

### Navigation

- **Bottom tab bar** (4 items): Dashboard · Reports · Stats · Profile
- **FAB** always visible on Dashboard and Reports screens
- **Back navigation**: left-chevron in a 28×28px rounded-square ghost button
- **Screen transitions**: slide left/right for depth, slide up for modals/sheets

### Offline-First Behavior

- All report submissions saved to local SQLite/AsyncStorage immediately
- Sync badge shows pending count in top-right of dashboard
- Pending badge on report cards when not yet synced
- Footer note on Create Report: "Saved locally · will sync when online"
- Auto-sync triggers on network reconnection

### Feedback States

| Action | Feedback |
|---|---|
| Submit report | Success toast ("Report submitted") + haptic |
| Sync failure | Error toast ("Sync failed · Check your connection") |
| Form validation error | Inline error message below input + border turns red |
| Button press | scale(0.97) + opacity change |
| Report card press | scale(0.99) + background lightens |
| FAB press | scale(0.93) + shadow reduces |

### Empty States

- No reports: Illustration + "No reports yet" + CTA "Submit your first report"
- No connection: Wifi icon + "You're offline · Reports will sync when connected"
- No data for stats: "Not enough data yet · Keep submitting reports"

---

## 9. Micro Interactions

| Element | Interaction |
|---|---|
| Primary button | Press: scale(0.97), release: spring back 200ms |
| FAB | Press: scale(0.93), shadow collapse; Release: spring 280ms |
| Report card | Press: scale(0.99) + bg lighten; Release: 150ms |
| Success submit | FAB → pulse ring animation → toast slide-up |
| Sync indicator | Spinning circle when actively syncing (2s loop) |
| Pending dot | Subtle pulse animation (opacity 0.6 → 1.0, 1.8s loop) |
| Nav tab | Icon scales 1.0 → 1.1 on tap, color transitions 150ms |
| Toggle switch | Thumb slides 200ms ease, track color transitions |
| Bottom sheet | Drag handle supports pan gesture to dismiss |

---

## 10. Accessibility

- All touch targets minimum **44×44px**
- Text contrast ratios meet **WCAG AA** (4.5:1 for body, 3:1 for large text)
- Bottom nav labels always visible (no icon-only navigation)
- Status badges use both **color + dot indicator** (not color alone)
- Success/error states use both **color + icon** (not color alone)
- Font sizes minimum **11px** (never smaller)
- Support system font scaling up to **1.3×** without layout breaks

---

## 11. Design Rationale

### Why deep dark (not pure black)?
Pure black (`#000000`) creates harsh contrast on OLED screens and makes card elevation impossible to perceive. `#0E0D18` provides enough luminance for layered surfaces while remaining easy on the eyes during night shifts.

### Why purple-blue gradient as primary?
Purple signals modernity and trust (seen in Stripe, Linear, Notion). The gradient adds energy without being aggressive. It reads clearly on dark backgrounds and works well for both interactive elements and data visualization.

### Why card-based layout?
Cards create scannable chunks for employees reviewing multiple shifts. Each card is a self-contained unit — status visible at a glance — reducing the need to tap into each item to understand its state.

### Why segmented control for shift selector?
A dropdown requires 2 taps and reading. A segmented control is 1 tap and visually immediate. For a form submitted daily, the reduction in friction compounds significantly over time.

### Why FAB instead of header button for new report?
The FAB is thumb-reachable on large phones. Header buttons require awkward finger stretches. Since creating a report is the app's most frequent primary action (for employees), it must be frictionless.

### Why collapse optional fields?
Non-technical daily users experience form fatigue. Showing only the essential field (report text) and collapsing optional attachments and logs keeps the create flow fast. Power users can expand what they need.

---

## 12. File & Asset Naming Conventions

```
Icons:        ic_[name]_[size].svg         e.g. ic_dashboard_24.svg
Screens:      screen_[name]_[role].png     e.g. screen_dashboard_employee.png
Components:   cmp_[name].svg               e.g. cmp_report_card.svg
Colors:       Use token names from Section 2
Spacing:      Use token names from Section 4
```

---

## 13. Version

| Field | Value |
|---|---|
| App name | Reportify |
| Version | 1.0.0 |
| Design version | v1.0 |
| Date | April 2026 |
| Target platforms | iOS 16+ · Android 10+ |
| Framework | React Native |
| Mode | Dark only |

---

*End of Reportify Design System — v1.0*
