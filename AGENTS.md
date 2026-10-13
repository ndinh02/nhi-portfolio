# Portfolio Website: Orchestrator

## Project overview
Personal portfolio website for Nhi Ngoc Uyen Dinh (Macaroonie): UX/UI, web design and AI-assisted no-code development. Main audiences are recruiters and hiring managers (design, web design, marketing roles in Hessen and Rheinland-Pfalz) and clients. The site is built in code and must be quick to skim.

## Stack
- Vite + React + TypeScript
- Linter: Oxlint
- Hosting: Vercel
- Content lives in `content/` (one Markdown file per case study), never hard-coded in components.

## Agents and order of work
Run in this order. Each agent reads the previous agent's output and writes its own file. Do not skip a step.

1. `agents/01-content-curator.md` → `content/<project>/outline.md`
2. `agents/02-copywriter.md` → `content/<project>/draft.md`
3. `agents/03-design-build.md` → code in `src/`
4. `agents/04-qa.md` → `reports/qa-<date>.md`
5. `agents/05-publish-maintain.md` → deployment and changelog
6. `agents/06-job-fit.md` (optional) → `content/job-fit/<company>.md`

## Design brief (fill in, all agents follow it)
- Colors: primary #F1F1F1 / secondary #3480E2 / tertiary #0F1142 / neutral #C6C6C6
- Typography: heading font: Bruno Ace (google font) 36px, body font: Kode Mono (google font) 18px, quote: Bitcount Ink (google font) 24px
- Spacing and layout: max width: full-screen, spacing scale: between section 20px
- Tone of voice: warm, fun, chill, gen-z, freely speaking tone. 
- Languages: English (main), German (secondary)
- Things to avoid: Emojis, emdash, stock-photo look, long paragraphs, jargon, small-headline, weird words that no one uses. 
- Style: Luminating, Depth Mapping Color Mixing on objects and picture, Tracking nodes background.
- Images: Explicit keep screenshots firstly un-retouched. 

## Rules for all agents
- Never invent facts, results, metrics or client names. If a detail is missing, write `TODO: ask Macaroonie` and continue.
- Do not publish anything without explicit approval.
- Keep a short log of decisions in `reports/decisions.md`.
- One task at a time; stop and ask when a decision changes the design brief.
- When not sure with a task or during search hitting walls, ask Macaroonie.

## Security
- No API keys, tokens or personal data in the repository.
- Do not include private client material (screenshots, documents) without permission.
- Detect material that contains human's face and famous brand name: Ask for confirmation
- Contact details on the site only as approved by Macaroonie.

## Build and test commands
- Install: `npm install`
- Dev server: `npm run dev`
- Lint: `npx oxlint`
- Type check: `npx tsc --noEmit`
- Build: `npm run build`

## Code style
- TypeScript strict mode, functional React components, named exports.
- Design tokens in one place (`src/styles/tokens.ts` or CSS variables); no hard-coded colors or sizes in components.
- Semantic HTML first; every interactive element keyboard accessible.
