# DECISIONS.md

> Keep this short. Bullets are fine. Be specific and honest. We read every word.

## The feature: assignees + filtering

**What I built**
- Added an `assignee_id` column (nullable FK to `users`) to the `tasks` table, surfaced via a LEFT JOIN in all task queries so `assignee_name` comes back alongside the task.
- UI: assignee dropdown on the "Add task" form, inline assignee selector per task row, and an assignee filter dropdown in the filter bar (alongside the existing status + search filters).

**Decisions I made on the ambiguous parts**
- How I handled tasks with no assignee: nullable — "Unassigned" is a valid state. Tasks created without an assignee default to `null`, and the filter bar includes an explicit "Unassigned" option so teams can pull up the triage queue.
- Single-select vs multi-select filter, and why: single-select. Multi-select adds complexity (comma-separated params or repeated keys, more complex SQL `IN` clause, trickier UI) with marginal value at this team size. Single-select covers the primary use case: "show me everything on Ada's plate." I noted this as an easy extension if needed.
- How the assignee filter interacts with the existing status/search filter: all three filters are AND-ed together server-side. They compose naturally — "Ada's open tasks matching 'CI'" is a valid and useful query.
- Where the filter state lives: local React state (useState). URL params would be better for shareability/bookmarking, but local state fits the existing pattern in the repo (status and search already lived in useState). Keeping it consistent matters more here than being clever.

**Anything I assumed instead of asking**
- Assumed a task has at most one assignee. If the product needs multi-owner tasks, the schema would need a join table.
- Assumed reassigning is fine inline (not audit-logged). A real product might want a history of who owned what.

## The bug

- **What the bug was:** `db.prepare(sql).all(...params)` in the GET /api/tasks handler. `better-sqlite3`'s `.all()` method takes a *single* binding argument — either an array or an object — not spread positional arguments. Spreading the params array causes `.all()` to receive multiple individual arguments, which the library silently ignores beyond the first, returning wrong (over-broad) results whenever more than one filter is active.
- **How I found it:** Tried filtering by both `status=open` and a search term simultaneously in the UI. Results came back unfiltered — "done" tasks still appeared even with status=open set. Traced it to the `.all(...params)` call and checked the better-sqlite3 docs, which confirm the single-argument contract.
- **Why my fix is correct (and not just "it stopped happening"):** The fix is `.all(params)` — passing the array directly. better-sqlite3 iterates the array positions and binds them in order to the `?` placeholders. This is the documented interface; the original spread was simply wrong usage of the API.
- **Anything similar I noticed but didn't fix:** The PATCH handler also runs separate UPDATE statements for status vs assignee_id in sequence. Under concurrent requests there's a race window between the two UPDATEs. Not a correctness bug today (SQLite serializes writes), but worth noting.

## Tradeoffs

- **What I deliberately did NOT do:**
  - No optimistic UI updates — kept the existing reload-after-action pattern. Consistent with the repo; correctness over snappiness.
  - No debounce on the search input — the original didn't have it. Adding it would be right, but out of scope for a bug + feature task.
  - No migration tooling — used a `try/catch ALTER TABLE` for schema evolution since the repo has no migration setup. For production I'd add a proper migration runner.
  - No test coverage — the brief explicitly said not to aim for 100%. I'd add at minimum integration tests for the filter combinations.
- **Where I leaned on AI, and what I changed or rejected from what it gave me:**
  - Used Claude to scaffold the updated route and component code quickly. Reviewed every line — caught that the initial suggestion still used the spread syntax for `.all()` in a different spot and corrected it. Also simplified the PATCH handler it proposed (it suggested three separate DB round-trips; I kept two, one per field).

## If I had more time

- **Next thing I'd do:** Debounce the search input (300ms) to avoid hammering the API on every keystroke, and add keyboard navigation / accessibility attributes to the filter controls.
- **Where this design breaks at 10x or 100x the data:** The full-table scan + `LIKE '%…%'` search doesn't use any index. At ~10k tasks it'll start feeling slow. Fix: add an FTS5 virtual table for title search, and index `(status, assignee_id)` for the common combined filter.
- **One thing about the existing codebase I'd want to refactor:** The query-building pattern in the GET handler (string concatenation + parallel params array) is fragile — easy to get the `?` count out of sync with the params. I'd replace it with a small query-builder helper or use a lightweight library like `kysely` to get type-safe, composable query construction.

## Time spent

- Roughly: 2 hours

## Deployment (optional)

- Live URL: *(add Vercel URL here after deploy)*
- How I hosted it: Node/Express API on Render (Web Service, free tier); React/Vite frontend on Vercel. The API URL is injected into the frontend at build time via `VITE_API_BASE`. CORS on the server is locked to the Vercel origin via the `CORS_ORIGIN` env var — no wildcard in production.
- What I'd harden before real production: swap SQLite for Postgres (Render managed), add rate limiting on POST /api/tasks, add server-side input length validation, set up a proper migration runner instead of the ALTER TABLE try/catch, and add a CI step that runs `tsc --noEmit` on every push.
