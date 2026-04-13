# Rules — AI Instruction System

## Priority Order

> rules.md > architecture.md > documentation.md > user prompt

When in conflict, higher-priority sources take precedence. Always resolve ambiguity by reading all `.antigravity/` files before acting.

---

## Before Making Any Change

1. Read **all three** `.antigravity/` files: `rules.md`, `architecture.md`, `documentation.md`
2. Treat them as the **single source of truth** for this project
3. Understand the existing architecture and navigation structure before touching any code
4. If something is unclear, ask — do not assume

---

## Code Change Rules

- **Do NOT change UI design** (colors, spacing, layout, typography, animations) unless the user explicitly requests it
- **Follow existing architecture and patterns** — do not invent new ones
- **Do NOT introduce breaking changes** — existing screens, flows, and navigation must remain functional
- **Keep changes minimal and consistent** with the surrounding code
- **Do NOT refactor** code that is unrelated to the requested change
- **Do NOT introduce new libraries or dependencies** unless explicitly asked
- **Do NOT create new bottom tabs** — the tab structure is fixed at four tabs (Reports, Dashboard, Management, Settings)
- **Do NOT add management features to the Settings screen** — Settings is for app preferences and account only
- **Reuse existing components** — before building something new, check if a component already exists
- **Follow Clean Architecture** — domain entities, repositories, data sources, and mappers must remain separated

---

## Navigation Rules

- The bottom tab bar contains exactly **4 tabs**: Reports, Dashboard, Management, Settings
- Sub-screens (e.g., Template Management, Products, Team) use **internal state-based navigation** inside the Management screen
- Do NOT use React Navigation stack navigators for Management sub-screens
- The back button in sub-screens must always return to the Management hub list

---

## Documentation Behavior

After **any code change**, you must:

1. Open `documentation.md`
2. Update the relevant section(s) to reflect the new state
3. Add new features, screens, or behavior descriptions as needed
4. Update the navigation section if any navigation-related change was made
5. **Never delete** existing documentation content — only extend or update it

---

## General Behavior

- Be precise and surgical — change only what is needed
- Do not over-engineer solutions
- If a feature already exists with a pattern, follow that pattern exactly
- When in doubt, do less and ask
