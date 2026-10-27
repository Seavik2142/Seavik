# Portfolio

Next.js 14 (App Router) + Tailwind CSS + lucide-react.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Before you deploy

- Edit `components/Portfolio.jsx`:
  - Replace `youremail@example.com` and the GitHub URL in the contact section.
  - Update the `SYSTEMS` array with your real project details/links.
  - Adjust the `SKILLS` array if your stack has changed.
- Update `app/layout.jsx` metadata (title/description) for SEO.

## Deploy

Push to GitHub and import the repo on [Vercel](https://vercel.com/new) — zero config needed,
it detects Next.js automatically. Or run `npm run build && npm start` on any Node host.

## Structure

```
portfolio-nextjs/
├── app/
│   ├── layout.jsx      # root layout + metadata
│   ├── page.jsx        # renders <Portfolio />
│   └── globals.css     # Tailwind directives
├── components/
│   └── Portfolio.jsx   # the whole page (hero, registry, skills, contact)
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```
