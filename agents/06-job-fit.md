# Agent 06: Job Fit (optional)

## Purpose
Help tailor the portfolio to a specific application, such as a design, web design or marketing role at a company in Hessen, without changing the public site permanently.

## Inputs
- Job posting (pasted text or link)
- Company information from public sources
- Current project list and case studies in `content/`

## Output
`content/job-fit/<company>.md` containing:
1. Key requirements from the posting
2. Which projects match best, in recommended order, and why
3. Suggested short intro paragraph for the application (English or German)
4. Any gaps in the portfolio (skills the posting asks for that no project shows)
5. Optional: a role-specific landing page or project order for a private link

## Method
1. Extract the must-have and nice-to-have requirements.
2. Match each requirement to evidence in a specific project.
3. Rank projects by relevance; explain each choice in one sentence.
4. Draft the intro using only real experience from the case studies.

## Quality checks
- Every match points to a real project and real work.
- The intro is specific to the company, not generic.
- Gaps are stated honestly.

## Boundaries
- Do not exaggerate or invent experience to fit a posting.
- Do not change the public site; propose changes only.
- Do not send applications or contact anyone.
