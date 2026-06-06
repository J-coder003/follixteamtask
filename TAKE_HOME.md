# Fullstack Take-Home: TeamTasks

Thanks for taking the time. This is designed to take **2-3 hours**, not a weekend. If you find yourself going much longer, stop and write down what you would have done instead. We respect your time and we read the notes.

## Ground rules

- **AI tools are allowed.** Use whatever you'd use on the job (Copilot, Claude, ChatGPT, etc). We're not trying to catch you out. We care that you understand and can defend every line you submit, because there's a short walkthrough call afterward where you'll screen-share and explain your work.
- Use the stack already in the repo. Don't rewrite it in your favorite framework.
- Commit as you go. We like seeing the progression, not one giant final commit.

## The starting point

You're given a small, working task-tracking app called **TeamTasks**:

- **Backend:** Node + TypeScript + Express, SQLite via a thin query layer
- **Frontend:** React (Vite), plain fetch calls, minimal styling
- Existing features: list tasks, create a task, mark a task done, basic text search by title

It works. It is not perfect. It looks like real code written by a real team under time pressure, because that's the point.

## Your job

### 1. Add a feature: assign tasks to people, and filter by assignee

Tasks currently have no owner. Add the ability to:

- Assign a task to a user (there's already a `users` table with a few seeded rows)
- Filter the task list by assignee in the UI

This touches the database, the API, and the frontend. How you wire it together is up to you.

> Note: we've left some of this under-specified on purpose. There are product decisions buried in here. Make a reasonable call, and write down what you decided and why in `DECISIONS.md`. We're at least as interested in your judgment as in the code.

### 2. Find and fix the bug

There is at least one real bug in the existing app. We're not going to tell you where. Find it, fix it, and explain in `DECISIONS.md` what it was, how you found it, and why your fix is correct. (Hint: try using the app the way an impatient user would.)

### 3. Fill in DECISIONS.md

Use the provided `DECISIONS.md` template. This is not busywork. It's where we see how you think. Bullet points are fine. We'd rather have honest, specific notes than polished prose.

## What we're looking for

- Code that fits the existing patterns of the repo, not the cleverest possible code
- Sensible handling of the ambiguous parts, clearly documented
- That you actually understood the bug rather than pattern-matching a fix
- Clear reasoning about tradeoffs and what you'd do with more time

## What we're not looking for

- Pixel-perfect UI. Plain and functional is completely fine.
- Gold-plating. Don't add auth, Docker, a design system, or 100% test coverage. Scope discipline is a signal.
- A finished product. An honest "I ran out of time, here's what I'd do next" beats a rushed, broken everything.

## Bonus (optional, not required)

If you have time and want to go further, deploying the app somewhere we can click on it is a nice plus. cPanel, Render, Railway, Fly, a VPS, wherever you like. We won't penalize anyone who skips this, and we'd much rather you nail the core task than rush a deploy. If you do deploy, drop the live URL and a line in `DECISIONS.md` about how you hosted it and anything you'd harden before real production.

## Submitting

Push to the repo and reply with the link. We'll set up a 20-30 minute call where you walk us through it. Come ready to answer "why did you do it this way" and "what happens if I change X."
