# AINEX - Resume Intelligence SaaS (Frontend Prototype)

AINEX is a polished single-page SaaS frontend that implements:
- Public home page with **Login/Sign Up** and header links (**Home / Analyze / Dashboard**)
- Post-login resume workflow (upload + job description + analyze)
- Analyze page with speedometer-style resume strength meter, skill gap table, AI suggestions, grammar check
- Dashboard with **Overview / Interview Prep / History** sections

## Step-by-step implementation process

1. **Define product flow and page map**
   - Map primary routes: Home, Analyze, Dashboard.
   - Map dashboard tabs: Overview, Interview Prep, History.
   - Define user state transitions: visitor -> auth -> submit resume/JD -> analyze -> dashboard insights.

2. **Set up the base layout**
   - Created a single-page shell with:
     - top navbar
     - side navigation (dashboard tabs)
     - main content area for route-based views
   - Used semantic structure in `index.html` for easier scaling.

3. **Implement the neumorphic visual design system**
   - Added a sage-green token palette exactly matching the requested theme.
   - Applied global component rules: 25–30px radii, soft shadow depth, rounded pills, no hard borders.
   - Styled cards, forms, tables, chart containers, dialogs, and nav interactions for premium SaaS feel.

4. **Build app state and persistence**
   - Added central `state` object in `app.js`.
   - Persisted user session, latest analysis, and analysis history using `localStorage`.

5. **Create authentication UX**
   - Built modal for Login / Sign Up.
   - On auth success, saves lightweight profile and unlocks analysis workflow.

6. **Add resume + JD intake module**
   - Supports both file upload (text extraction where possible) and direct resume paste.
   - Requires job description text and resume text before analysis.

7. **Implement analysis engine (frontend logic)**
   - Extracts required and present skills via skill bank matching.
   - Computes:
     - resume strength score
     - keyword match score
     - skill alignment score
     - formatting score
   - Generates missing-skill suggestions as actionable resume bullet guidance.
   - Runs a quick grammar correction pass with issue listing + corrected preview.

8. **Design Analyze page outputs**
   - Speedometer-style meter with rotating needle tied to score.
   - 3-column skills table (required / matched / missing).
   - Dedicated AI suggestions and grammar-check panels.

9. **Build dashboard insights**
   - **Overview**: KPI cards + canvas line chart for resume score history.
   - **Interview Prep**: role-aware interview questions + skill match summary.
   - **History**: table with serial no., resume reference, role, and strength score.

10. **Wire interactions and navigation**
    - Added route switching and tab switching behavior.
    - Added defensive empty states if analysis has not been run yet.

11. **Validate the prototype manually**
    - Serve locally and test full flow:
      - login/signup
      - analyze
      - analyze page metrics
      - dashboard tab data and chart
      - history persistence across refresh

## Run locally

No build tools required.

```bash
python3 -m http.server 4173
```

Then open:

- `http://localhost:4173`

## Notes

- This is a production-style frontend prototype with deterministic local logic.
- For enterprise production, connect analysis modules to backend AI/NLP APIs (resume parser, grammar engine, LLM recommendations, question generation, role ontology, analytics DB).
