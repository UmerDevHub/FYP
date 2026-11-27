---
name: slice
description: Start a slice. Reads the slice file, the progress notes and the requirements, checks the scope, writes the done-when list and a plan, then waits for approval. Use as /slice S3.
disable-model-invocation: true
---
Start the slice: $ARGUMENTS

1. Read the file for this slice in docs/slices, then docs/progress.md and docs/srds-35.md. List the requirement numbers of the slice.
2. Read one finished module in apps/api/src/modules and one finished feature in apps/web/src/features to learn our pattern. If none exists yet, say so.
3. Check that the slice file and the requirements agree. List every conflict or gap. Do not choose silently.
4. Write the "done when" list as sentences that a person can check in the running app.
5. Write the plan with these parts: Goal, Files, Steps, Tests, Risks, Not doing. Each step must be small enough to test alone. Put the server steps and the screen steps in two lists so that two people can work in parallel.
6. Mark every guess as Assumption and every idea of yours as Proposal. List open questions.
7. Stop. Do not write any code until I approve the plan.
