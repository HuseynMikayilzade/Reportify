# Architecture — Reportify

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Framework | React Native (Expo bare workflow) |
| Navigation | React Navigation v7 (Bottom Tabs) |
| State Management | Zustand |
| Local Database | SQLite via `expo-sqlite` |
| Notifications | `expo-notifications` |
| Architecture | Clean Architecture |

---

## Clean Architecture Layers

```
src/
├── domain/
│   ├── entities/          # Pure TypeScript interfaces (Product, Template, Expense, Report, User)
│   └── repositories/      # Repository interfaces (IProductRepository, ITemplateRepository, etc.)
│
├── data/
│   ├── datasources/       # SQLite data sources (ProductLocalDataSource, ExpenseLocalDataSource, etc.)
│   ├── dto/               # Data Transfer Objects for SQLite rows
│   ├── mappers/           # Domain ↔ DTO converters (ProductMapper, ExpenseMapper, etc.)
│   ├── repositories/      # Concrete repository implementations
│   └── database/          # DatabaseManager, schemas, seed data
│
├── infrastructure/
│   └── notifications/     # NotificationService (local reminders, sync alerts)
│
├── store/                 # Zustand stores (authStore, syncStore, settingsStore)
│
├── core/
│   └── navigation/        # Navigator components and type definitions
│
└── presentation/
    ├── components/        # Shared UI components (Button, Toast, etc.)
    ├── screens/           # All screen implementations organized by feature
    └── theme/             # Colors, Spacing, BorderRadius design tokens
```

---

## Navigation Structure

### Bottom Tab Navigator

The app uses a single bottom tab bar with **exactly 4 tabs**. This is fixed and must not be changed.

```
MainTabNavigator
├── Reports       → ReportsListScreen
├── Dashboard     → DashboardScreen
├── Management    → ManagementScreen
└── Settings      → SettingsScreen
```

**Defined in:** `src/core/navigation/MainTabNavigator.tsx`  
**Types defined in:** `src/core/navigation/types.ts`

---

### Management Tab — Internal Navigation

The Management tab uses **internal state-based navigation** (`useState`) inside a single screen component. It does NOT use React Navigation stack navigators.

```
ManagementScreen (state: 'list')
├── Template Management → state: 'template' → TemplateManagementScreen
├── Products            → state: 'products' → ProductManagementScreen
├── Expenses            → state: 'expenses' → ExpenseManagementScreen
└── Team                → state: 'team'     → (Placeholder screen)
```

**Rules:**
- Sub-views are rendered inline inside `ManagementScreen.tsx`
- A back button (`‹`) in the sub-header sets the state back to `'list'`
- Do NOT convert these sub-views into separate tab screens

---

### Settings Tab

The Settings screen is for **user account and app configuration only**. It must NOT contain management features.

```
SettingsScreen
├── App Settings
│   ├── Preferences (theme, language)
│   └── Sync (manual sync, last sync time)
└── Account
    ├── Full Name
    ├── Email
    └── Role (Employee, Admin, Super Admin)
```

**Defined in:** `src/presentation/screens/profile/SettingsScreen.tsx`

---

## Domain Entities

| Entity | Fields |
|---|---|
| `Product` | id, name, productType, category, price, isActive |
| `Expense` | id, name, descriptionRequired, isActive |
| `Template` | id, branch, name, products[], expenses[] |
| `TemplateExpense` | id, name, requireDescription |
| `User` | id, email, passwordHash, fullName, role, branch |
| `Report` | id, userId, branch, shift, notes, syncStatus, createdAt, updatedAt |

---

## Database Tables (SQLite)

| Table | Purpose |
|---|---|
| `users` | User accounts and roles |
| `products` | Master product catalog |
| `expenses` | Master expense catalog |
| `templates` | Report templates per branch |
| `template_products` | Products linked to a template |
| `template_expenses` | Expenses linked to a template |
| `reports` | Submitted daily reports |
| `report_stock` | Stock entry rows per report |
| `report_sales` | Sales entry rows per report |
| `report_expenses` | Expense entry rows per report |
| `sync_queue` | Offline sync job queue |

---

## General Principles

- **Avoid duplication** — one source of truth for each entity, repository, and screen
- **Reuse components** — screens use shared components from `src/presentation/components/`
- **Keep components small and focused** — if a component grows large, break it down
- **SQLite booleans are stored as integers** — `1 = true`, `0 = false`; mappers handle conversion
- **Repositories are injected** — screens and stores instantiate repositories directly (DI via constructor)
- **Offline-first** — all data is written locally first; sync is run separately via `SyncRepository`
