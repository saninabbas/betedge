/* ============================================================
   BetEdge static site generator.
   Reads assets/data.js (single source of truth) and writes a
   fully-static, SEO-friendly review page per bookmaker plus
   sitemap.xml. Run:  node build.js
   No dependencies. Re-run whenever you edit assets/data.js.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const SITE = 'https://betedge.site'; // live domain

// ---- load single source of truth (assets/data.js) ----
global.window = {};
eval(fs.readFileSync(path.join(ROOT, 'assets', 'data.js'), 'utf8'));
const BOOKIES = window.BOOKIES;

const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const monogram = b => b.name.replace(/[^A-Za-z0-9]/g,'').slice(0,2).toUpperCase();

const DROP_MENU = BOOKIES.map(b=>`<a href="review-${b.slug}.html"><span class="dm-logo">${b.logo?`<img src="${b.logo}" alt="${esc(b.name)} logo" width="26" height="26">`:monogram(b)}</span> ${esc(b.name)}</a>`).join('');

const HEAD_NAV = `
<div class="topbar"><strong>18+</strong> Play responsibly. Advertisement &amp; affiliate content. T&amp;C apply.</div>
<header>
  <div class="wrap nav">
    <a href="index.html" class="logo" aria-label="BetEdge home">Bet<span>Edge</span></a>
    <nav class="nav-links" aria-label="Primary">
      <a href="index.html">Home</a>
      <div class="nav-drop">
        <a href="games.html" class="nav-drop-toggle">All Games <span class="caret">&#9662;</span></a>
        <div class="drop-menu">${DROP_MENU}</div>
      </div>
      <a href="reviews.html">Reviews</a>
      <a href="bonuses.html">Bonuses</a>
      <a href="guides.html">Guides</a>
      <a href="blog.html">Blog</a>
    </nav>
    <div class="nav-cta"><a href="reviews.html" class="btn btn-sm">Compare Sites</a></div>
    <button class="burger" aria-label="Open menu"><span></span><span></span><span></span></button>
  </div>
</header>`;

const X_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
const FOOTER = `
<footer>
  <div class="wrap">
    <div class="rg"><strong>18+ Responsible Gambling.</strong> Betting is entertainment, not income. Set deposit limits, never chase losses, and take a break if it stops being fun.</div>
    <div class="foot-grid">
      <div class="foot-about">
        <a href="index.html" class="logo">Bet<span>Edge</span></a>
        <p>Independent betting-site comparison. Expert reviews, exclusive bonuses and honest rankings for players worldwide.</p>
        <div class="socials"><a href="https://x.com/Z7777onlinn5" target="_blank" rel="noopener" aria-label="Follow BetEdge on X">${X_ICON}</a></div>
      </div>
      <div><h4>Site</h4><a href="index.html">Home</a><a href="games.html">All Games</a><a href="reviews.html">Reviews</a><a href="bonuses.html">Bonuses</a><a href="guides.html">Guides</a><a href="blog.html">Blog</a></div>
      <div><h4>Top Sites</h4><a href="review-bcgame.html">BC.Game</a><a href="review-1xbet.html">1xBet</a><a href="review-1win.html">1win</a><a href="review-melbet.html">Melbet</a><a href="review-t7777.html">T7777</a></div>
      <div><h4>Legal</h4><a href="about.html">About</a><a href="contact.html">Contact</a><a href="responsible-gambling.html">Responsible Gambling</a><a href="privacy.html">Privacy</a></div>
    </div>
    <div class="foot-bottom"><span>&copy; <span id="yr"></span> BetEdge. All rights reserved.</span><span>18+ | Please gamble responsibly.</span></div>
  </div>
</footer>`;

function reviewPage(b){
  const title = `${b.name} Review 2026 — Bonus, Rating & Sign Up | BetEdge`;
  const desc = `${b.name} review: ${b.bonus} welcome bonus, rated ${b.score}/10. ${b.summary}`.slice(0,155);
  const url = `${SITE}/review-${b.slug}.html`;
  const logoHtml = b.logo ? `<img src="${b.logo}" alt="${esc(b.name)} logo" width="80" height="80">` : `<span style="color:${b.color}">${monogram(b)}</span>`;
  const others = BOOKIES.filter(x => x.slug !== b.slug).slice(0, 3);

  const jsonld = {
    "@context":"https://schema.org",
    "@type":"Review",
    "itemReviewed":{"@type":"Organization","name":b.name,"url":url},
    "reviewRating":{"@type":"Rating","ratingValue":b.score,"bestRating":"10","worstRating":"1"},
    "author":{"@type":"Organization","name":"BetEdge"},
    "publisher":{"@type":"Organization","name":"BetEdge"},
    "reviewBody":b.summary
  };
  const breadcrumbLd = {
    "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item":SITE+"/index.html"},
      {"@type":"ListItem","position":2,"name":"Reviews","item":SITE+"/reviews.html"},
      {"@type":"ListItem","position":3,"name":b.name+" Review","item":url}
    ]
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="BetEdge">
<meta property="og:image" content="${SITE}/assets/og.jpg">
<meta property="og:image:secure_url" content="${SITE}/assets/og.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="BetEdge — Compare the Best Betting Apps &amp; Bonuses">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${SITE}/assets/og.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap"></noscript>
<link rel="stylesheet" href="styles.css?v=3">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>
</head>
<body>
${HEAD_NAV}
<main>
<section class="page-hero" style="padding-bottom:20px">
  <div class="wrap" style="text-align:left">
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="reviews.html">Reviews</a> / ${esc(b.name)}</nav>
    <div class="rev-head">
      <div class="rev-logo">${logoHtml}</div>
      <div>
        <p class="rev-tag">${esc(b.tag)}</p>
        <h1>${esc(b.name)} Review</h1>
        <a href="${b.link}" class="btn btn-sm" rel="nofollow sponsored" style="margin-top:12px">Visit ${esc(b.name)}</a>
      </div>
      <div class="rev-score"><div class="n">${b.score}</div><div class="s">★★★★★</div><div class="lbl" style="font-size:11px;color:var(--text);letter-spacing:.1em;margin-top:4px">OUT OF 10</div></div>
    </div>
  </div>
</section>

<section style="padding-top:8px">
  <div class="wrap">
    <div class="rev-bonus-band">
      <div><div class="lbl">Welcome bonus</div><div class="val">${esc(b.bonus)}</div>${b.promo?`<div class="lbl" style="margin-top:6px">Promo code: <strong style="color:var(--gold)">${esc(b.promo)}</strong></div>`:''}</div>
      <a href="${b.link}" class="btn" rel="nofollow sponsored">Claim Bonus</a>
    </div>

    <p style="font-size:18px;color:var(--text-strong)">${esc(b.summary)}</p>

    <div class="rev-grid">
      <div class="rev-box pros"><h3>Pros</h3><ul>${b.pros.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></div>
      <div class="rev-box cons"><h3>Cons</h3><ul>${b.cons.map(c=>`<li>${esc(c)}</li>`).join('')}</ul></div>
    </div>

    <div class="rev-body">
      <h2>${esc(b.name)} Bonus &amp; Promotions</h2>
      <p>${esc(b.bonusInfo)}</p>

      <h2>Key Facts</h2>
      <table class="spec-table">
        <tbody>
          <tr><td>Rating</td><td>${b.score} / 10</td></tr>
          <tr><td>Welcome bonus</td><td>${esc(b.bonus)}</td></tr>
          <tr><td>Founded</td><td>${esc(b.founded)}</td></tr>
          <tr><td>License</td><td>${esc(b.license)}</td></tr>
          <tr><td>Live betting</td><td>${b.live?'Yes':'No'}</td></tr>
          <tr><td>Cash out</td><td>${b.cashout?'Yes':'No'}</td></tr>
          <tr><td>Mobile app</td><td>${b.mobile?'Yes':'No'}</td></tr>
          <tr><td>Payments</td><td>${b.payments.map(esc).join(', ')}</td></tr>
        </tbody>
      </table>

      <h2>Payments &amp; Payouts</h2>
      <p>${esc(b.name)} supports ${b.payments.map(esc).join(', ')}. Deposits are instant and withdrawals are processed quickly, especially with crypto options where available.</p>

      <h2>Is ${esc(b.name)} Safe?</h2>
      <p>${esc(b.name)} operates under a ${esc(b.license)} license. As with any betting site, always verify the current license status, read the bonus terms, and gamble responsibly.</p>
    </div>

    <div class="cta-band" style="margin-top:40px">
      <h2>Ready to join ${esc(b.name)}?</h2>
      <p>Claim the ${esc(b.bonus)} welcome bonus and start playing today.</p>
      <a href="${b.link}" class="btn" rel="nofollow sponsored">Sign Up Now</a>
    </div>
  </div>
</section>

<section style="background:var(--card-2)">
  <div class="wrap">
    <div class="section-head"><p class="eyebrow">Compare</p><h2>Other top betting sites</h2></div>
    <div class="games-grid">
      ${others.map(o=>`<article class="game-card">
        <div class="gc-top">
          <div class="gc-logo">${o.logo?`<img src="${o.logo}" alt="${esc(o.name)} logo">`:`<span style="color:${o.color}">${monogram(o)}</span>`}</div>
          <div><div class="gc-name">${esc(o.name)}</div><div class="gc-rate">★ ${o.score} / 10</div></div>
        </div>
        <div class="gc-bonus">${esc(o.bonus)}</div>
        <div class="gc-actions"><a href="review-${o.slug}.html" class="btn btn-ghost">Review</a><a href="${o.link}" class="btn" rel="nofollow sponsored">Sign Up</a></div>
      </article>`).join('')}
    </div>
    <div class="cta-inline"><a href="games.html" class="btn btn-ghost">See all games</a></div>
  </div>
</section>
</main>
${FOOTER}
<script src="script.js?v=2"></script>
</body>
</html>`;
}

// ============================================================
//  BLOG: 10 articles per bookmaker
// ============================================================
const pay = b => b.payments.map(esc).join(', ');
const BLOG_TOPICS = [
  {key:'welcome-bonus', cat:'Bonuses',
    title:b=>`${b.name} Welcome Bonus Guide 2026`,
    excerpt:b=>`How to claim the ${b.bonus} welcome bonus on ${b.name}, plus wagering terms explained.`,
    body:b=>[
      ['What is the '+esc(b.name)+' welcome bonus?', [`New players at ${esc(b.name)} can claim a <strong>${esc(b.bonus)}</strong> welcome bonus on their first deposit. It is one of the reasons ${esc(b.name)} earns our ${b.score}/10 rating.`, b.bonusInfo]],
      ['How to claim it', [`Create an account, make your first deposit using ${pay(b)}, and the bonus is credited automatically${b.promo?` — use promo code <strong>${esc(b.promo)}</strong> where requested`:''}.`]],
      ['Wagering requirements', ['Like most offers, this bonus carries a wagering (rollover) requirement — you must bet the bonus a set number of times before withdrawing. Always read the current terms on site.']],
    ]},
  {key:'how-to-register', cat:'Guides',
    title:b=>`How to Register on ${b.name} (Step by Step)`,
    excerpt:b=>`A simple step-by-step guide to creating your ${b.name} account and getting started.`,
    body:b=>[
      ['Creating your account', [`Registering on ${esc(b.name)} takes about a minute. Open the site, tap Register, and enter your details.`]],
      ['Step by step', ['1) Open the registration form. 2) Enter your email or phone and a strong password. 3) Choose your currency. 4) Confirm and verify. 5) Make your first deposit to unlock the '+esc(b.bonus)+' bonus.']],
      ['Verification (KYC)', [`${esc(b.name)} operates under a ${esc(b.license)} license and may ask for ID verification before your first withdrawal. Have a photo ID ready to avoid delays.`]],
    ]},
  {key:'app-download', cat:'Mobile',
    title:b=>`${b.name} App Download Guide (Android & iOS)`,
    excerpt:b=>`How to download and install the ${b.name} mobile app for fast betting on the go.`,
    body:b=>[
      ['Does '+esc(b.name)+' have an app?', [`Yes — ${esc(b.name)} is fully mobile-friendly${b.mobile?' with a dedicated mobile experience':''}. You can bet from any phone browser or the app where available.`]],
      ['Android install', ['Download the APK from the official site, allow installs from unknown sources in settings, then open the file to install. Only ever download from the official '+esc(b.name)+' site.']],
      ['iOS install', ['On iPhone, use the mobile web app or the App Store listing where available. The mobile site works smoothly on Safari.']],
    ]},
  {key:'deposit-withdrawal', cat:'Payments',
    title:b=>`${b.name} Deposit & Withdrawal Guide`,
    excerpt:b=>`Supported payment methods, deposit steps and withdrawal times at ${b.name}.`,
    body:b=>[
      ['Supported methods', [`${esc(b.name)} supports ${pay(b)}. Deposits are usually instant.`]],
      ['How to deposit', ['Go to the cashier, pick your method, enter the amount and confirm. Your balance updates instantly for most options.']],
      ['Withdrawal times', [`${b.cashout?'Cash out is supported. ':''}Crypto withdrawals are typically the fastest, often within minutes, while cards and wallets may take longer depending on verification.`]],
    ]},
  {key:'is-it-safe', cat:'Safety',
    title:b=>`Is ${b.name} Safe & Legit?`,
    excerpt:b=>`We check the licensing, security and reputation of ${b.name} so you can bet with confidence.`,
    body:b=>[
      ['Licensing', [`${esc(b.name)} operates under a ${esc(b.license)} license and has been active since ${esc(b.founded)}.`]],
      ['Our verdict', [`Based on hands-on testing we rate ${esc(b.name)} <strong>${b.score}/10</strong>. ${esc(b.summary)}`]],
      ['Play responsibly', ['Only bet what you can afford to lose, set deposit limits, and use the site\'s responsible-gambling tools. You must be 18+ to play.']],
    ]},
  {key:'casino-games', cat:'Casino',
    title:b=>`${b.name} Casino Games Guide`,
    excerpt:b=>`Slots, live tables and crash games — what you can play at ${b.name}.`,
    body:b=>[
      ['Games on offer', [`${esc(b.name)} offers a broad casino selection including slots, live dealer tables and popular crash games like Aviator.`]],
      ['Live casino', ['Real-dealer roulette, blackjack and baccarat stream in HD, giving a land-based feel from your phone.']],
      ['Tips', ['Check each game\'s RTP, start with small stakes, and use the '+esc(b.bonus)+' bonus to extend your play.']],
    ]},
  {key:'sports-betting', cat:'Sports',
    title:b=>`${b.name} Sports Betting Guide`,
    excerpt:b=>`Cricket, football and more — how to bet on sports at ${b.name}.`,
    body:b=>[
      ['Sports coverage', [`${esc(b.name)} covers cricket, football, tennis, esports and more, with pre-match and ${b.live?'live in-play':'pre-match'} markets.`]],
      ['Live betting & cash out', [`${b.live?'Live betting is available on major events. ':''}${b.cashout?'Cash out lets you settle a bet early to lock in profit or cut losses.':'Check the site for cash-out availability on specific markets.'}`]],
      ['Getting started', ['Deposit using '+pay(b)+', pick your market, add to betslip and confirm your stake.']],
    ]},
  {key:'vs-others', cat:'Comparison',
    title:b=>`${b.name} vs Other Betting Sites — How It Compares`,
    excerpt:b=>`How ${b.name} stacks up against rival bookmakers on bonus, payments and payout speed.`,
    body:b=>[
      ['Where '+esc(b.name)+' wins', ['Strengths: '+b.pros.map(esc).join('; ')+'.']],
      ['Where it could improve', ['Weaknesses: '+b.cons.map(esc).join('; ')+'.']],
      ['Bottom line', [`With a ${esc(b.bonus)} bonus and a ${b.score}/10 score, ${esc(b.name)} is a strong choice. Compare it side by side on our <a href="reviews.html">reviews page</a>.`]],
    ]},
  {key:'promo-code', cat:'Bonuses',
    title:b=>`${b.name} Promo Code & Bonus Tips`,
    excerpt:b=>`The latest ${b.name} promo details and tips to get the most from your bonus.`,
    body:b=>[
      ['Current offer', [`${esc(b.name)} is running a ${esc(b.bonus)} welcome offer${b.promo?` — use promo code <strong>${esc(b.promo)}</strong>`:''}.`]],
      ['Tips to maximise it', ['Deposit enough to trigger the full match, read the wagering terms, and stick to games that contribute 100% to rollover.']],
      ['Ongoing promos', ['Beyond the welcome offer, watch for reloads, free bets and cashback in the promotions section.']],
    ]},
  {key:'payment-methods', cat:'Payments',
    title:b=>`${b.name} Payment Methods Explained`,
    excerpt:b=>`Every way to deposit and withdraw at ${b.name}, including crypto and local options.`,
    body:b=>[
      ['Accepted methods', [`${esc(b.name)} accepts ${pay(b)}.`]],
      ['Crypto vs cards', ['Crypto (BTC, USDT) is usually fastest for withdrawals; cards and e-wallets are convenient for deposits but may be slower to pay out.']],
      ['Fees & limits', ['Most deposits are fee-free. Check minimum/maximum limits per method in the cashier before you transact.']],
    ]},
];

function blogFilesFor(b){
  return BLOG_TOPICS.map(t => ({ file:`blog-${b.slug}-${t.key}.html`, title:t.title(b), cat:t.cat, excerpt:t.excerpt(b), game:b.name, slug:b.slug }));
}

function blogPost(b, topic){
  const title = topic.title(b);
  const desc = topic.excerpt(b).slice(0,155);
  const file = `blog-${b.slug}-${topic.key}.html`;
  const url = `${SITE}/${file}`;
  const bodyHtml = topic.body(b).map(([h2, ps]) => `<h2>${esc(h2)}</h2>${ps.map(p=>`<p>${p}</p>`).join('')}`).join('\n');
  const more = blogFilesFor(b).filter(x=>x.file!==file).slice(0,5);
  const jsonld = {"@context":"https://schema.org","@type":"Article","headline":title,"description":desc,"author":{"@type":"Organization","name":"BetEdge"},"publisher":{"@type":"Organization","name":"BetEdge"},"mainEntityOfPage":url};
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} | BetEdge</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="BetEdge">
<meta property="og:image" content="${SITE}/assets/og.jpg">
<meta property="og:image:secure_url" content="${SITE}/assets/og.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="BetEdge — Compare the Best Betting Apps &amp; Bonuses">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${SITE}/assets/og.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap"></noscript>
<link rel="stylesheet" href="styles.css?v=3">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
${HEAD_NAV}
<main>
<section class="page-hero" style="padding-bottom:16px">
  <div class="wrap" style="text-align:left;max-width:820px">
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="blog.html">Blog</a> / ${esc(b.name)}</nav>
    <p class="rev-tag">${esc(topic.cat)}</p>
    <h1 style="font-size:clamp(28px,5vw,40px)">${esc(title)}</h1>
  </div>
</section>
<section style="padding-top:8px">
  <div class="wrap" style="max-width:820px">
    <div class="rev-bonus-band">
      <div><div class="lbl">${esc(b.name)} welcome bonus</div><div class="val">${esc(b.bonus)}</div></div>
      <a href="${b.link}" class="btn" rel="nofollow sponsored">Visit ${esc(b.name)}</a>
    </div>
    <div class="rev-body">
      ${bodyHtml}
      <div class="cta-band" style="margin-top:36px">
        <h2>Join ${esc(b.name)} today</h2>
        <p>Claim the ${esc(b.bonus)} welcome bonus and start playing.</p>
        <a href="${b.link}" class="btn" rel="nofollow sponsored">Sign Up Now</a>
      </div>
      <h2 style="margin-top:40px">More ${esc(b.name)} guides</h2>
      <ul style="margin-top:8px">
        ${more.map(m=>`<li style="padding:7px 0"><a href="${m.file}" style="color:var(--green)">${esc(m.title)}</a></li>`).join('')}
      </ul>
      <p style="margin-top:20px"><a href="review-${b.slug}.html" style="color:var(--green)">Read the full ${esc(b.name)} review →</a></p>
    </div>
  </div>
</section>
</main>
${FOOTER}
<script src="script.js?v=2"></script>
</body>
</html>`;
}

// ---- write blog posts + blog index data ----
let blogCount = 0;
const blogIndex = [];
BOOKIES.forEach(b => {
  BLOG_TOPICS.forEach(topic => {
    const file = `blog-${b.slug}-${topic.key}.html`;
    fs.writeFileSync(path.join(ROOT, file), blogPost(b, topic));
    blogIndex.push({ file, title:topic.title(b), cat:topic.cat, excerpt:topic.excerpt(b), game:b.name, slug:b.slug });
    blogCount++;
  });
});
fs.writeFileSync(path.join(ROOT, 'assets', 'blog-data.js'), 'window.BLOG = ' + JSON.stringify(blogIndex) + ';');

// ---- write review pages ----
let count = 0;
BOOKIES.forEach(b => {
  fs.writeFileSync(path.join(ROOT, `review-${b.slug}.html`), reviewPage(b));
  count++;
});

// ---- sitemap.xml ----
const staticPages = ['','games','reviews','bonuses','guides','blog','about','contact','responsible-gambling','privacy'];
const urls = [
  ...staticPages.map(p=> p ? `${SITE}/${p}` : `${SITE}/`),
  ...BOOKIES.map(b=>`${SITE}/review-${b.slug}`),
  ...blogIndex.map(x=>`${SITE}/${x.file.replace(/\.html$/, '')}`)
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u=>`  <url><loc>${u}</loc><changefreq>weekly</changefreq></url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);

// ---- robots.txt ----
const robots = `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Amazonbot
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;
fs.writeFileSync(path.join(ROOT, 'robots.txt'), robots);

// ---- llms.txt ----
const llmsTxt = `# BetEdge — Betting App Comparison & Expert Reviews

> Independent betting-site and online casino comparison platform. BetEdge provides expert reviews, ratings, bonus comparisons, payout speeds, and payment guides for top online betting brands including BC.Game, 1xBet, 1win, Casino777, Melbet, BetWinner, Linebet, and T7777. 18+ only. Please gamble responsibly.

## Core Pages
- [Home](${SITE}/): Overview of top-ranked betting sites, welcome bonuses, and comparison table.
- [Compare Reviews](${SITE}/reviews.html): Side-by-side comparison of all tested betting apps and sportsbooks.
- [All Games & Brands](${SITE}/games.html): Complete directory of betting brands and casino operators.
- [Exclusive Bonuses](${SITE}/bonuses.html): Updated list of welcome bonuses, free bets, and promo codes.
- [Guides](${SITE}/guides.html): Comprehensive betting guides, strategy tutorials, and payment comparisons.
- [Blog & News](${SITE}/blog.html): Betting tips, bonus alerts, and industry news.

## Brand Reviews
${BOOKIES.map(b => `- [${b.name} Review](${SITE}/review-${b.slug}.html): Rating ${b.score}/10, ${b.bonus}, ${b.summary.replace(/\r?\n/g, ' ')}`).join('\n')}

## Popular Guides & Analysis
- [Fastest Withdrawal Betting Apps 2026](${SITE}/blog-fastest-withdrawal-betting-apps-2026.html): Guide to instant crypto and e-wallet payouts.
- [Top Casino Strategies 2026](${SITE}/blog-top-casino-strategies-2026.html): Bankroll management and smart wagering tactics.

## Trust & Compliance
- [About BetEdge](${SITE}/about.html): Our mission, review methodology, and testing process.
- [Contact Us](${SITE}/contact.html): Get in touch with the editorial team.
- [Responsible Gambling](${SITE}/responsible-gambling.html): 18+ policy, limit tools, and gambling addiction support resources.
- [Privacy Policy](${SITE}/privacy.html): How BetEdge handles and protects user privacy.
`;
fs.writeFileSync(path.join(ROOT, 'llms.txt'), llmsTxt);

// ---- llms-full.txt ----
const llmsFullTxt = `# BetEdge — Full Site Directory & Data for AI Agents

> BetEdge (${SITE}/) is an independent betting-site and online casino comparison resource. We provide unbiased rankings, detailed reviews, rollover terms, payout metrics, and verified promotional codes.

## Site Structure & Navigation
- [Home](${SITE}/): Main comparison hub with top-ranked betting sites and welcome packages.
- [Reviews](${SITE}/reviews.html): Full table comparing score, bonus, live betting, cash out, and mobile compatibility.
- [All Games](${SITE}/games.html): Complete directory of reviewed betting apps and casino brands.
- [Bonuses](${SITE}/bonuses.html): Complete bonus tracker with promo codes and rollover information.
- [Guides](${SITE}/guides.html): Comprehensive wagering, bankroll, and withdrawal guides.
- [Blog](${SITE}/blog.html): Betting tips, bonus announcements, and industry updates.
- [About](${SITE}/about.html): Testing methodology, editorial standards, and scoring breakdown.
- [Contact](${SITE}/contact.html): Editorial contacts and partnership inquiries.
- [Responsible Gambling](${SITE}/responsible-gambling.html): 18+ policy, deposit limit guides, self-exclusion tools.
- [Privacy Policy](${SITE}/privacy.html): Data protection and privacy practices.

## Brand Directory & Analysis
${BOOKIES.map((b, i) => `
### ${i + 1}. ${b.name}
- URL: ${SITE}/review-${b.slug}.html
- Rating: ${b.score} / 10 ${b.editorsChoice ? "(Editor's Choice)" : ""}
- Welcome Bonus: ${b.bonus}
${b.promo ? `- Promo Code: ${b.promo}` : ""}
- License: ${b.license} (Founded ${b.founded})
- Payments: ${b.payments.join(', ')}
- Features: Live Betting (${b.live ? "Yes" : "No"}), Cash Out (${b.cashout ? "Yes" : "No"}), Mobile App (${b.mobile ? "Yes" : "No"})
- Summary: ${b.summary}
- Pros: ${b.pros.join('; ')}
- Cons: ${b.cons.join('; ')}
`).join('\n')}
`;
fs.writeFileSync(path.join(ROOT, 'llms-full.txt'), llmsFullTxt);

console.log(`Generated ${count} review pages + ${blogCount} blog posts + sitemap.xml + robots.txt + llms.txt + llms-full.txt`);

