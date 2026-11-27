---
name: demo-prep
description: Prepare the demo and the viva: check the demo data, write a timed demo script from the real screens, build the traceability table and run practice questions. Use as /demo-prep or /demo-prep viva.
disable-model-invocation: true
---
Prepare: $ARGUMENTS (if empty, the whole demo)

1. Read docs/progress.md, docs/srds-35.md and the slice files. List which slices are done.
2. Demo data: check that npm run demo:reset gives three cars in different states, one full report, one car in Reconditioning with two repair costs, one rejected request, one returned inspection and one accepted request past its expiry time. List what is missing. Do not use real car photos.
3. Demo script: write a 15-minute script as numbered steps: who is logged in, what they click, what the audience should see, and the SRDS rule it shows. Use only features that exist.
4. Traceability: build a table of requirement, use case, screen, route and test. Search the code. Write "not found" where you cannot find it. List the gaps at the bottom.
5. Viva practice: ask me one question at a time about the architecture, the data, security and my own module. After my answer say what was missing, then ask the next. Do not give the answer before I try.
6. Never say a feature works unless you found it in the code and in a test or a screen.
