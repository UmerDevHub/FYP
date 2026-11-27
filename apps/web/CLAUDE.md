# Screen rules (apps/web)

These rules are read only when you work in this folder. They add to the root CLAUDE.md.

## Structure
- A feature folder (features/<area>/) holds the pages, hooks and forms of that area only.
- A page calls a hook. A hook uses TanStack Query and lib/api.js. A page never calls fetch directly.
- Server data stays in TanStack Query. Do not copy it into useState.
- Forms use React Hook Form with the Zod schema from packages/shared.
- Money, dates and mileage are shown through lib/format.js.

## Look
- Read docs/design.md before you build a screen. The skills human-ui and plain-copy apply.
- Styling uses Tailwind classes that read the design tokens. No raw colour codes and no raw font names.
- Use the UI kit (components/ui.jsx) before you write a new element. A new component needs three uses.
- The price tag and the number-plate badge are the only memorable elements. Keep everything else quiet.

## Quality
- Every page has a loading state, an error state and an empty state, and works at 360 px width.
- Every input has a visible label. Every control can be reached with the Tab key and shows a visible focus ring.
- Status and results are shown by a word, not by colour alone.
- Buttons say what they do ("Send sell request"). No filler words.

## Login
- The access token lives in memory only, never in localStorage. The refresh cookie is httpOnly.
- On a 401, lib/api.js starts one shared refresh request. Never start a second one.
