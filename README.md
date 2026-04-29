# LeetCode Review Tracker

LeetCode Review Tracker is a Next.js app for turning public LeetCode activity into a lightweight review workflow. It syncs a public username, derives a problem list from recent submissions, enriches those problems with metadata, and lets you manage review notes and spaced-repetition style follow-ups locally in the browser.

## Current Features

- Public LeetCode username sync
- `localStorage` persistence
- Derived problem list from recent submissions
- Enriched problem metadata with difficulty and topics
- Local review notes
- Review state
- Review result logging
- Automatic next review scheduling
- Review history

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- `localStorage`
- LeetCode public GraphQL

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Usage Flow

1. Go to `/sync`
2. Enter a LeetCode username
3. Sync public data
4. Review problems in `/problems`
5. Add notes in a problem detail page
6. Use `/review` for daily review

## Data and Privacy

- No LeetCode password
- No cookies
- No Supabase yet
- Data is stored locally in the browser

## Current Limitations

- Only recent public submissions are synced
- Data is local to one browser
- No account login yet

## Roadmap

- Filters and search
- Real stats from notes and topics
- Export/import backup
- Supabase persistence
- Deployment
