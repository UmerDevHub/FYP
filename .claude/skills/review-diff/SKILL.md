---
name: review-diff
description: Review the current Git changes against the project rules before a commit. Reports problems with file and line. Does not change code. Use as /review-diff.
disable-model-invocation: true
---
Review the changes in the working tree (git diff and new files). Do not change any file.

For each point answer OK, Problem (with file and line) or Not applicable.
1. Scope: only what the slice file allows. Nothing extra was added or tidied.
2. Naming: names come from the SRDS. A function starts with a verb. A true-or-false name starts with is, has or can. No data, temp, res or utils.
3. Size: handlers 3 to 5 lines, functions about 30 lines, files under about 200 lines.
4. Duplication: no role, status, limit or message typed twice. No copied component or function. The shared constants and schemas are used.
5. Layers: routes call services, services call repositories, only repositories write SQL. Status changes go through changeStatus.
6. Security: a role check and a branch check on every protected route. Role and branch are not read from the request body. No private field in a public answer. No secret or password in a log.
7. Tests: a normal test and a refusal test for every new endpoint. They would fail if the code were wrong. No existing test was weakened.
8. Screens: loading, error and empty states. Labels on inputs. Tokens used. Plain words.
9. Leftovers: console.log, commented-out code, unused imports, a new library without a reason.
10. Explainability: point out any code that two students could not explain in a viva, and suggest a simpler version.

End with the three most important fixes, in order.
