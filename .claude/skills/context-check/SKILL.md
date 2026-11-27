---
name: context-check
description: Audit the context files: CLAUDE.md length, conflicts, stale progress notes, missing sections in slice files and rules in the wrong file. Reports first and changes only after approval.
disable-model-invocation: true
---
Audit the Claude context files of this project. Do not change anything yet.

1. List the context files that exist: the CLAUDE.md files, docs/progress.md, docs/slices, docs/srds-35.md, docs/architecture.md, docs/data-model.md, docs/api-contract.md, docs/design.md, docs/acceptance.md, docs/prompt-log.md, .claude/settings.json and .claude/skills.
2. Count the lines of each CLAUDE.md. The target is under 200 lines. Report any file over 120.
3. Find conflicts: two files that say different things about the same rule, a number or a name that differs between files, an endpoint in the API file that the slice file does not mention.
4. Find stale parts: progress notes that do not match the code or the slice status, and rules about code that no longer exists.
5. Check that each slice file has: Goal, Use cases, Requirements, Rules, Not in this slice, Done when and Tests that must exist.
6. Find rules in the wrong file (a server rule in the root file, a design rule in the server file) and rules that repeat between files.
7. Report as: Problems (most serious first, with file and line), Suggested edits (small and exact), Fine as it is. Wait for my approval before you edit.
