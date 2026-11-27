---
name: screen
description: Add one page in the project design: page, hook, form, and loading, error and empty states, using the tokens and the UI kit. Use as /screen Sell your car.
disable-model-invocation: true
---
Build this screen: $ARGUMENTS

1. Read docs/design.md and apps/web/CLAUDE.md. Apply the skills human-ui and plain-copy. Read one finished screen and copy its pattern.
2. List the states the screen needs: loading, error, empty, normal and form errors.
3. Reuse the UI kit. Add a new component only if nothing fits and three places need it. Say why.
4. The page calls a hook. The hook uses TanStack Query and lib/api.js. Forms use React Hook Form with the shared Zod schema.
5. Use tokens only. Texts are plain and specific. A button says what it does.
6. Check the page at 360 px and at 1280 px width. If a browser tool is connected, open the page and look at it. If not, list the checks I must do by hand, including using the Tab key only.
7. Run npm run lint and npm run format. Finish with a short summary and anything you could not check.
