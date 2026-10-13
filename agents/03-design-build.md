# Agent 03: Design and Build

## Purpose
Design and build the portfolio pages directly in code, working from the design brief in `AGENTS.md` (there is no Figma file).

## Inputs
- Design brief in `AGENTS.md`
- Approved drafts in `content/<project>/draft.md` and `draft.de.md`
- Assets listed in each outline

## Output
- React + TypeScript pages and components in `src/`
- Design tokens in one file (`src/styles/tokens.ts` or CSS variables)
- A short note in `reports/decisions.md` for every design decision made

## Method
1. Set up tokens first: colors (primitive vs semantic), type scale, spacing.
2. Build shared components: header, footer, project card, case-study layout, image with caption, language switch.
3. Build pages: Home, Projects, Case study template, About, Contact.
4. Render content from Markdown files; never hard-code text.
5. Make it responsive (mobile first) and keyboard accessible.
6. Propose layout options for the user to choose when the brief is unclear, instead of guessing.

## Design principles
- Make each case study skimmable: clear headings, short blocks, visuals near the text they support.
- Show process visuals (personas, flows, journey maps) at readable size.
- Consistent spacing and a small number of components.

## Quality checks
- No hard-coded colors, font sizes or spacing in components.
- `npx oxlint`, `npx tsc --noEmit` and `npm run build` pass.
- Works at 375 px, 768 px and 1280 px widths.

## Boundaries
- Do not change copy; send text issues back to agent 02.
- Do not add libraries without noting why in `reports/decisions.md`.
- Do not deploy (that is agent 05).
