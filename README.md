# BetEdge — Static Site

Hand-coded HTML/CSS/JS betting comparison site. No build step. Host free on Cloudflare Pages.

## Files
- `index.html` — homepage
- `reviews.html` — bookmaker reviews (top 10)
- `bonuses.html` — exclusive bonuses + promo codes
- `guides.html` — betting guides
- `blog.html` — blog / news
- `styles.css` — all styling (design tokens at top)
- `script.js` — mobile nav + FAQ accordion
- `_headers` — Cloudflare Pages cache + security headers

## Edit content
- Bookmaker list: `APPS` array in `index.html` / `reviews.html`
- Bonuses + codes: `BONUS` array in `bonuses.html`
- Blog posts: `POSTS` array in `blog.html`
- Colors/fonts: `:root` block in `styles.css`

## Deploy — Cloudflare Pages (drag & drop, easiest)
1. Go to https://dash.cloudflare.com → Workers & Pages → Create → Pages → **Upload assets**.
2. Name the project (e.g. `betedge`).
3. Drag this whole folder in. Click **Deploy**.
4. Live at `https://betedge.site`.

## Deploy — via Git (auto-deploy on push)
1. Push this folder to a GitHub repo.
2. Cloudflare Pages → Create → **Connect to Git** → pick repo.
3. Build command: *(leave empty)* · Output directory: `/`
4. Deploy.

## Custom domain (betedge.site)
Pages project → **Custom domains** → add `betedge.site` → follow DNS steps.
