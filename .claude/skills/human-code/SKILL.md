---
name: human-code
description: Use when writing or changing Vehicle 360 code. Keeps code plain, small, named from the SRDS, alike across modules, with nothing typed twice, and free of common AI-generated habits.
---
# Human-type code for Vehicle 360

Two students must be able to explain every line in a viva. Write the most boring code that works.

## Before you write
1. Read one finished module (or feature) and copy its pattern. If none exists, say so and propose the pattern.
2. Check where the code belongs: docs/architecture.md, section "Where does this code go?".
3. Check packages/shared for an existing constant, limit or schema before you create one.

## Shape
- Routes call services. Services call repositories. Only repositories write SQL. Services hold the rules and the transactions. A handler is 3 to 5 lines.
- A function does one thing and fits on one screen (about 30 lines). A file stays under about 200 lines. If a file does two jobs, split it.
- Early returns instead of deep nesting. Throw ApiError for expected problems. Do not catch an error unless you can handle it.
- No abstraction until the same thing is needed a third time. No class or wrapper for something used once.

## Names
- Names come from the SRDS and the business: acceptSellRequest, inspection, readyForSale. A function starts with a verb. A true-or-false name starts with is, has or can.
- Never use data, temp, res, obj, handleData, doStuff, or a utils file with unrelated helpers.

## Nothing typed twice
- Roles, statuses and decision numbers: packages/shared. Validation: the shared Zod schemas. Status changes: changeStatus. Notifications: notify. Audit rows: logActivity. Branch rule: assertBranchAccess. Files: the files helper.
- On screens: the UI kit, api.js, format.js and the tokens.
- If you are about to copy a block, stop and move it to its one home.

## Comments and leftovers
- A comment explains why, never what. If a comment is needed to explain what, rename or split the code.
- Leave no console.log, commented-out code, unused imports or unused files. Git remembers.
- No new library without asking and giving the reason.

## AI habits to avoid
Defensive try/catch that hides errors. Optional chaining on values that cannot be missing. Options and config objects nobody asked for. Helper files used once. Long header comments. Renaming or reformatting code that is not part of the task. Fixing a failing test by changing the test. Inventing the API of a library: read the library documents first.

## After you write
1. Run npm test and npm run format and show me the result.
2. Say in one line each: what changed, what is not covered, and any guess you made (label it Assumption).
3. If a piece of code is hard to explain in simple words, simplify it before you hand it over.
