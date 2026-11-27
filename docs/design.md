# Design rules (Proposal: the SRDS has no visual requirements)

## The brief
- Subject: a multi-branch used-car dealership. Cars come from private sellers and are inspected before they are sold.
- Public site: help a buyer trust a car enough to visit the showroom. Staff area: finish an inspection fast and without mistakes.
- The idea is trust through proof. The inspection report is the hero of every car page.
- Two memorable elements only: the price tag (a yellow card like the one on a showroom windscreen) and the number-plate badge (a registration number drawn like a plate, in the staff screens). Everything else stays quiet.
- Tone of words: plain, direct, a little warm. Sentences, not slogans.

## Colour tokens (names only in code; never write a raw colour)
- petrol #0E3A4A: header, main buttons, headings
- plate #F3C13A: price tag and small marks of attention (active menu line). Nothing else.
- ink #17262E: body text. muted #4A5B64: secondary text
- paper #F4F5F3: page. line #D3D9DB: borders. petrol-tint #E4EEF2: table headers. plate-tint #FCF3D6: highlights
- pass #1F7A4D good result. warn #8F5400 fair result and notes. fail #B3261E poor result and errors. info #1B5F8A accepted and submitted
- Contrast: normal text at least 4.5 to 1, large text and icons at least 3 to 1. Re-check after any colour change.

## Type
- Headings, prices, plates: Barlow Semi Condensed 500, 600, 700. Body, forms, tables: Source Sans 3 400, 600.
- Both come from npm (@fontsource packages), served from our own server.
- Page title 36 px. Section 26. Card title 20. Body 17 with line height 1.55 and lines under about 75 characters. Small 14. Price tag 24 in lists and 36 on the detail page.

## Space and shape
- Spacing on a 4 px base: 4, 8, 12, 16, 24, 32, 48. Use only these.
- Page width at most 1152 px, centred, 16 px side padding.
- Corners 4 px on inputs and buttons, 3 px on plates, 0 on the price tag.
- 1 px borders separate things. No shadows, except one soft shadow on a dialog. Photos are 4 to 3, cropped to fill.

## Components (build each once, in components/ui.jsx)
- Button (primary, accent, secondary, danger; default type button; spinner when busy), Field, Select, Textarea, Badge, Card, Dialog, EmptyState, Spinner, Toast, PriceTag, PlateBadge, Async wrapper, Reason dialog, Table, ResultMark (word plus icon: Good, Fair, Poor).
- Every interactive thing has default, hover, focus (2 px petrol outline, never removed), disabled (60 percent, reason nearby), busy and error states.
- Motion only answers an action (a dialog opening, a message after Save). No scroll animation. Respect reduced motion.
- One icon set (lucide). An icon only when it carries meaning.

## Screens
- Public pages: mobile first, one column, large tap targets. Staff pages: desktop first, but the inspection form must work on a tablet (buttons at least 44 px high).
- Every screen has loading, error and empty states, and works at 360 px width.
- The report is part of the car page. Result is a word with an icon; colour only supports it. The report can be printed (no header, no filters).
- Photos: 4 to 3, lazy loading, a short alt text, under 5 MB. Demo pictures are drawn, never real car photos from the internet.

## Words
- Name things the way the user does: "Sell your car", not "Vehicle disposal request".
- A button says what will happen: "Send sell request", "Save draft", "Approve and list". Keep one name for one action everywhere.
- Sentence case. Active voice. No filler ("Please note that", "seamless", "powerful").
- An error says what went wrong and how to fix it, without apology: "Enter the year." An empty state gives the next step.
- Slop to avoid: "Oops! Something went wrong", "Invalid input", "Submit", "Success!", "No data found".

## The slop list (three or more on one screen means redesign)
- Warm cream page with a serif headline and a terracotta accent. Near-black page with one neon accent.
- Purple or blue gradients, glowing blobs, glass panels.
- Every block a rounded card with the same soft shadow.
- A small all-caps label above every heading. One word of a headline in another colour.
- Meta text joined with middle dots, arrows on every link, an icon or emoji on every list item.
- A "why choose us" row of three icon cards. Numbered markers on content that is not a sequence.
- Fade-and-slide animation on every section. Lorem ipsum or invented testimonials.

## The five-question critique
1. What does the eye see first, and is it the right thing?
2. Could this screen belong to any other business? What is generic?
3. Can I do the main job without reading any instruction?
4. What happens when the data is missing, slow or wrong?
5. What can I remove?
