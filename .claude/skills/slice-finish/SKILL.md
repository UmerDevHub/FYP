---
name: slice-finish
description: Finish a slice. Runs the tests, checks the done-when list and the requirements, updates docs/progress.md and suggests commit messages. Use as /slice-finish S3.
disable-model-invocation: true
---
Finish the slice: $ARGUMENTS

1. Run npm test, npm run lint and npm run format. Show me the result. If anything fails, stop and tell me.
2. Open the slice file. Go through "Done when" and "Tests that must exist" one line at a time. Mark each as Done (and how I can see it), Partly, or Not done. Never mark Done without naming the file, the test or the screen.
3. Read docs/srds-35.md and list the requirements of this slice with the file and the test that cover each one. Mark Not clear where you cannot tell.
4. Update docs/progress.md: the slice status, the Done lines, the decisions with their source (SRDS, Proposal or Assumption), the open questions and any exception to a pattern. Keep lines short.
5. If I corrected you twice for the same thing in this slice, propose one rule and the CLAUDE.md file it belongs in. Do not add it until I say yes.
6. Suggest commit messages: one line each, small steps. Do not commit.
7. End with: what works now, what does not, and the first step of the next slice.
