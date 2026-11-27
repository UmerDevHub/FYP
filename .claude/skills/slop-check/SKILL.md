---
name: slop-check
description: Check a screen and its words for the template look and for filler. Reports at most five changes and prefers removing to adding. Does not edit files. Use as /slop-check Car list.
disable-model-invocation: true
---
Check this screen: $ARGUMENTS

Read the page code and its texts. Use the human-ui and plain-copy skills as the standard. Do not change any file. Report each problem with file and line.

Look and layout:
1. Colours, fonts or sizes that are not tokens. Gradients, glowing blobs, glass panels.
2. Every block in a rounded card with the same shadow. Cards are for objects, such as a car.
3. A small all-caps label above headings, one coloured word in a headline, middle dots between facts, arrows on every link.
4. Icons or emoji on every list item. Numbered markers on content that is not a sequence.
5. A "why choose us" row of three icon cards, or animation on every section.
6. A missing loading, error or empty state. A missing label or focus ring. A layout that breaks at 360 px.

Words:
7. Filler words: seamless, robust, powerful, cutting-edge, unlock, elevate, effortless.
8. Buttons named Submit or Click here. Messages such as "Something went wrong" or "No data found".
9. A different name for the same thing on different screens.

Finish with at most five concrete changes. Prefer removing a decoration to adding one.
