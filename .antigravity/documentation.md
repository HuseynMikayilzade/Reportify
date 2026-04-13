# Documentation — Reportify

> This is a living document. It must be updated after every code change.
> Do NOT delete content — only extend or update existing sections.

---

## Overview

**Reportify** is an offline-first daily reporting mobile application for a doner shop.
It is built with React Native (Expo bare workflow), TypeScript, and Clean Architecture.

**Target Users:**
- **Employees** — submit daily reports (stock, sales, expenses)
- **Admins** — manage templates, products, expenses, and team
- **Super Admins** — full access across branches

The app stores all data locally in SQLite and synchronizes with a backend when connectivity is available.

---

## Navigation

The app uses a bottom tab bar. The number of visible tabs depends on the user's role.

### Tab visibility by role

| Tab | Icon | Employee | Admin | SuperAdmin |
|---|---|---|---|---|
| Reports | `≡` | ✅ | ✅ | ✅ |
| Dashboard | `⊞` | ✅ | ✅ | ✅ |
| Management | `⊟` | ❌ Hidden | ✅ | ✅ |
| Settings | `⚙` | ✅ | ✅ | ✅ |

**Behavior rules:**
- Employee sees exactly **3 tabs** (Reports, Dashboard, Settings). The Management tab does not exist — it is not disabled or hidden, it is simply not rendered.
- Admin and SuperAdmin see all **4 tabs**.
- React Navigation automatically rebalances tab spacing when Management is not rendered.
- Role is read from `useAuthStore().user.role` using the `UserRole` enum (`Employee`, `Admin`, `SuperAdmin`).

### Icon design spec (design system §6.6)
- Icon size: **16px** inside a **22×22px** container with 6px border radius
- Default color: `#6B6880` (muted)
- Active color: `#7C6FFF` (primary)
- Active background: `rgba(124,111,255,0.15)` (primaryGhost)
- Label: 10px Micro scale

### Screen mapping

| Tab | Screen | Description |
|---|---|---|
| Reports | `ReportsListScreen` | Lists all submitted reports for the current user |
| Dashboard | `DashboardScreen` | Summary stats and analytics overview |
| Management | `ManagementScreen` | Admin hub for templates, products, expenses, team |
| Settings | `SettingsScreen` | App preferences, sync controls, account info |

---

## Reports

**Screen:** `src/presentation/screens/reports/ReportsListScreen.tsx`

**Features:**
- Lists reports submitted by the current user
- Shows sync status (pending, synced) per report
- Supports creating new reports

**Current State:** Partially implemented — list view and structure in place. Full report creation flow (filling template fields) is pending.

---

## Dashboard

**Screen:** `src/presentation/screens/dashboard/DashboardScreen.tsx`

**Features:**
- Displays a summary of recent activity
- Shows sales, stock, and expense totals
- Intended for admin and super admin roles

**Current State:** Placeholder — structure in place, data wiring pending.

---

## Management

**Screen:** `src/presentation/screens/admin/ManagementScreen.tsx`

The Management tab acts as an admin hub. It uses **internal state navigation** — sub-screens are rendered inside `ManagementScreen` using a `useState`-controlled view mode. There is no React Navigation stack involved.

**Hub Menu Items:**

| Item | State Value | Screen | Status |
|---|---|---|---|
| Template Management | `'template'` | `TemplateManagementScreen` | ✅ Implemented |
| Products | `'products'` | `ProductManagementScreen` | ✅ Implemented |
| Expenses | `'expenses'` | `ExpenseManagementScreen` | ✅ Implemented |
| Team | `'team'` | Placeholder | 🔲 Pending |

**Navigation Behavior:**
- Tapping a row in the hub list sets the internal view state
- A `‹` back button in the sub-header returns to `'list'` state
- The OS back button is not wired — use the in-screen back button

---

### Template Management

**Screens involved:**
- `ManagementScreen.tsx` — branch selection cards (`view = 'template-branches'`) and editor wrapper (`view = 'template-editor'`)
- `TemplateManagementScreen.tsx` — the editor (receives `branch` prop)

**Flow:**
```
Management Hub
  → "Template Management" row
  → Branch selection screen (card list)
  → Tap a branch card
  → Template Editor for that branch
```

**Branch selection screen:**
- Displays all branches as cards (currently: Central, North, South)
- Each card shows:
  - Branch name
  - Template name if a template exists for that branch
  - "Template yoxdur" warning label (amber) if no template exists
- Template status is loaded live from `TemplateRepository.getTemplateByBranch()`
- Tapping a card opens the editor for that specific branch

**Template Editor (TemplateManagementScreen):**
- Receives `branch` as a required prop — branch is not editable inside the editor
- Loads existing template data on mount (keyed by branch)
- `existingTemplateId` tracks whether the current branch already has a template
- Save behavior:
  - Template exists → calls `updateTemplate()` (overwrite)
  - No template → calls `createTemplate()` (new record), then sets `existingTemplateId`
- One template per branch enforced — no duplicates possible

**Navigation states in ManagementScreen:**
| State | Description |
|---|---|
| `'list'` | Management hub menu |
| `'template-branches'` | Branch cards entry screen |
| `'template-editor'` | Editor for a specific branch |
| `'products'` | Product management |
| `'expenses'` | Expense management |
| `'team'` | Placeholder |

**What was NOT changed in the editor:**
- Products section (picker, tags, add/remove)
- Expenses section (picker, requireDescription toggle, list)
- Save Template button

**Current state:** ✅ Fully implemented


---

### Product Management

**Screen:** `src/presentation/screens/admin/ProductManagementScreen.tsx`

**Features:**
- Create new products with name, price, category, and type toggles
- List all existing products from the database
- Persistent storage via `ProductRepository` → `ProductLocalDataSource` → SQLite

**Product Entity Fields:** id, name, price, category (chicken/meat/other), productType (stock/sales), isActive

---

### Expense Management

**Screen:** `src/presentation/screens/admin/ExpenseManagementScreen.tsx`

**Features:**
- Create new expenses with name and `descriptionRequired` toggle
- List all existing expenses from the database
- Delete individual expenses from the list
- Persistent storage via `ExpenseRepository` → `ExpenseLocalDataSource` → SQLite

**Expense Entity Fields:** id, name, descriptionRequired, isActive

---

### Team Management

**Current State:** 🔲 Placeholder — shows a "coming soon" message.

**Planned Features:**
- Invite and manage employees
- Assign roles (Employee, Admin)
- Assign employees to branches

---

## Settings

**Screen:** `src/presentation/screens/profile/SettingsScreen.tsx`

**Sections:**

### App Settings
- **Preferences** — theme, language selection (future)
- **Sync** — manual sync trigger, shows last sync timestamp, pending report count

### Account
- Displays the logged-in user's full name, email address, and role
- Logout button — clears auth state via `useAuthStore`

### Navigation Preferences
- Entry row: **"Tab Icons"** → opens icon picker sub-screen (`view = 'icon-config'`)
- Sub-screen: `TabIconConfigScreen` (renders inside SettingsScreen with internal state)
- Uses **Lucide React Native** for modern, stroke-based, uniform scalable icons
- Features a **Search Bar** to instantly filter icons by label or internal name
- Shows all visible tabs with their current icon and an expanded, categorized library of options (10+ per tab)
- Management tab is hidden from icon config if user is Employee (role rule)
- Selecting an icon applies it immediately via `useNavIconStore.setIcon()`
- Changes persist to AsyncStorage and survive app reload
- **Reset to default** button restores the original icon set

**Files:**
- `src/store/navIconStore.ts` — Zustand + AsyncStorage persistence; exports `DEFAULT_ICONS`, `TAB_ICON_OPTIONS` list mapped to Lucide component names
- `src/presentation/screens/profile/TabIconConfigScreen.tsx` — icon picker component with search and Lucide wrapper (`RenderIcon`)
- `src/core/navigation/MainTabNavigator.tsx` — dynamically renders Lucide component per tab based on `useNavIconStore`

**Data Sources:**
- `useAuthStore` — provides current user info and logout
- `useSyncStore` — provides sync status, last sync time, pending count
- `useNavIconStore` — provides/persists selected icons and reset action


---

## Stores (Zustand)

| Store | File | Responsibilities |
|---|---|---|
| `useAuthStore` | `store/authStore.ts` | Current user, login, logout |
| `useSyncStore` | `store/syncStore.ts` | Sync status, trigger sync, pending count |
| `useSettingsStore` | `store/settingsStore.ts` | App preferences and notification settings |

---

## Notifications

**Service:** `src/infrastructure/notifications/NotificationService.ts`

**Features:**
- Request notification permissions (iOS + Android 13+)
- Schedule a daily reminder at a configurable time
- Show an immediate notification when reports sync successfully
- All operations are wrapped in `try-catch` for Expo Go compatibility

---

## Database

**Manager:** `src/data/database/DatabaseManager.ts`

Initializes all SQLite tables on first launch via `runMigrations()`. Tables are created with `CREATE TABLE IF NOT EXISTS` so re-runs are safe.

**Seeding:** `src/data/database/seed.ts` — seeds default admin user on first run.

---

## Change Log

| Date | Change |
|---|---|
| 2026-04-12 | Tab Icons upgraded to Lucide React Native with search functionality |
| 2026-04-12 | Nav Icon Settings added to allow user to customize bottom tab icons |
| 2026-04-12 | Template Management: branch-card entry screen added before editor |
| 2026-04-12 | TemplateManagementScreen: refactored to accept `branch` prop; save uses update vs create |
| 2026-04-12 | ManagementScreen: added `template-branches` and `template-editor` view states |
| 2026-04-12 | Management tab hidden from Employee role — Admin and SuperAdmin only |
| 2026-04-12 | Icon sizes aligned to design system spec: 16px icon / 22×22px container |
| 2026-04-12 | Navigation restructured to 4 tabs: Reports, Dashboard, Management, Settings |
| 2026-04-12 | ProfileScreen renamed to SettingsScreen |
| 2026-04-12 | Template Management fully implemented (product + expense selection, persistence) |
| 2026-04-12 | Product Management fully implemented (CRUD, SQLite persistence) |
| 2026-04-12 | Expense Management fully implemented (CRUD with descriptionRequired, SQLite persistence) |
| 2026-04-12 | Expense domain layer added (entity, interface, DTO, mapper, data source, repository) |
| 2026-04-12 | Android build fixed — NDK version pinned to 27.1.12297006 in root build.gradle |
| 2026-04-12 | NotificationService updated with correct Android permission logic and Expo Go guards |
| 2026-04-12 | `.antigravity/` AI instruction system initialized |
