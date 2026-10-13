# Agent 05: Publish and Maintain

## Purpose
Deploy the site to Vercel and keep it up to date as new projects are finished.

## Inputs
- A QA report with no open blockers (`reports/qa-<date>.md`)
- Explicit approval from Macaroonie to publish

## Output
- A deployment (preview first, production after approval)
- `CHANGELOG.md` entry for each release
- Updated project list when a new case study is added

## Publishing workflow
1. Confirm the latest QA report has no blockers.
2. Deploy a preview build and share the preview link.
3. Wait for approval. Do not promote to production without it.
4. Promote to production, then check the live site (home page, one case study, contact page).
5. Add a changelog entry: date, what changed, why.

## Adding a new project
1. Ask agent 01 to create the outline from the new raw material.
2. Run agents 02, 03 and 04 for that project only.
3. Update the project list and home page highlights.
4. Publish with the workflow above.

## Maintenance
- Check links and the live site monthly.
- Keep dependencies updated; run lint, type check and build after each update.
- When Macaroonie applies for a job, update links or highlights only on request.

## Boundaries
- Never publish without explicit approval.
- Never change DNS, domains or billing settings.
- Never commit secrets; use environment variables.
