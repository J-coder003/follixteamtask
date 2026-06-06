# TeamTasks

A small task-tracking app. This is a take-home starter. Read `TAKE_HOME.md` for the actual task.

## Stack

- **server/** — Node + TypeScript + Express + SQLite (better-sqlite3)
- **web/** — React + Vite + TypeScript

SQLite is used so the app runs with zero database setup. (At a real company you'd swap this for the team's actual DB.)

## Requirements

- Node 18+ and npm

## Setup

From the repo root:

```bash
npm run install:all   # installs root, server, and web deps
npm run seed          # creates and seeds the SQLite database
npm run dev           # runs API (:3001) and web (:5173) together
```

Then open http://localhost:5173

To reset the data at any time, run `npm run seed` again.

## What's here

- List tasks, create a task, mark a task done, search by title
- A `users` table seeded with a few people (not yet connected to tasks)
- `GET /api/users`, `GET/POST/PATCH /api/tasks`

## Submitting

- Commit as you go.
- Fill in `DECISIONS.md`.
- Push and share the link. We'll set up a short walkthrough call.
