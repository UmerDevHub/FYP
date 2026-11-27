---
name: test-first
description: Write tests for a rule before the code: normal path, every refusal, role and branch checks, a fake clock and all-or-nothing. Never weakens a test. Use as /test-first accept sell request.
disable-model-invocation: true
---
Write the tests for: $ARGUMENTS

1. Find the requirement sentence in docs/srds-35.md and quote it. Name each test as a sentence from it.
2. Use the helpers in apps/api/tests for users, vehicles and logins. Do not repeat set-up code.
3. Write one test for the normal path. For a write, check the status code, the shape of the answer and the change in the database.
4. Write a test for every refusal: wrong role, another branch, wrong status, bad input, missing item, duplicate. For a refusal, check that nothing changed.
5. If the code uses time, pass a fixed "now". Never wait.
6. If several tables change, add a test that forces the last step to fail and checks that the earlier steps left no trace.
7. Run the tests and show me that they fail for the right reason. Do not write the implementation unless I ask.
8. Never change an existing test to make it pass. If a test seems wrong, explain why and wait for my decision.
