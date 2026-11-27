---
name: human-ui
description: Use when building or changing any Vehicle 360 screen or component. Gives the project's human-made design rules: tokens, type, spacing, states, words, and the template-look signs to avoid.
---
# Human-type UI for Vehicle 360

Build every screen as if a designer who knows used-car dealerships made it. Never as a generic template.

## Before you build
1. Read docs/design.md (tokens, type, space, components, words). Use only what it defines.
2. Say in one sentence what the one job of this screen is and who uses it.
3. Read one finished screen and the UI kit (apps/web/src/components/ui.jsx). Reuse before you add.

## The subject
A multi-branch used-car dealership in Pakistan. Buyers fear hidden faults. Sellers want a fair, easy process. Staff must work fast and make no mistakes. The idea is trust through proof: the inspection report leads on every car page.

## Spend boldness in one place
- Memorable elements: the price tag (a yellow card on the photo, bottom left, square corners) and the number-plate badge (a registration number drawn like a plate). Nothing else gets decoration.
- Everything around them is quiet: paper background, ink text, petrol for the brand, plate yellow only on the price tag and one small mark of attention.

## Rules
- Colour, font and spacing come from tokens. Never write a raw colour, a raw font name or a spacing value that is not on the scale 4, 8, 12, 16, 24, 32, 48.
- Cards only for objects (a car). Use plain rows, lines and whitespace for everything else. Borders separate; shadows do not.
- Status and results use a word plus an icon. Colour only supports the word.
- One icon set. An icon only when it carries meaning. No emoji.
- Specs are one sentence ("74,000 km, petrol, automatic"), not a row of icons.
- Motion answers an action (a dialog opens, a save is confirmed). No animation on scroll. Respect reduced motion.
- Every screen has loading, error and empty states, a visible label on every input, a visible focus ring, and works at 360 px width.
- Staff buttons are at least 44 px high. Public pages are mobile first. Staff pages are desktop first and usable on a tablet.

## Never (the template look)
A cream page with a serif headline and a clay accent. A near-black page with one neon accent. Purple or blue gradients, glowing blobs, glass panels. Identical rounded cards with the same soft shadow. A small all-caps label above every heading. One coloured word in a headline. Facts joined with middle dots. Arrows on every link. An icon on every list item. A "why choose us" row of three icon cards. Numbers 01, 02, 03 on content that is not a sequence. Fade-and-slide on every section. Lorem ipsum or invented testimonials.

## After you build
1. Answer the five questions: What does the eye see first? Could this belong to any other business? Can I do the main job without instructions? What happens when data is missing, slow or wrong? What can I remove?
2. Remove one decoration.
3. Use the plain-copy skill for every word on the screen.
4. Tell me which states you checked and which you could not.
