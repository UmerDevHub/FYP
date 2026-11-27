---
name: srds-check
description: List the requirements of a slice and say which are covered by code and by tests. Never marks a requirement covered without naming a file. Use as /srds-check S4.
disable-model-invocation: true
---
Check this slice: $ARGUMENTS

1. Read the slice file and docs/srds-35.md. List the requirement numbers of the slice.
2. For each requirement, search the code and the tests. Give the screen file, the route file and the test name that cover it.
3. Mark each requirement as Covered (code and test), Code only, Not done or Not clear.
4. Never mark a requirement as Covered if you cannot name the file.
5. List anything in the code that is not in the slice file or in the SRDS as Extra.
6. If docs/traceability.md exists, show the rows that should change. Do not write the file unless I ask.
