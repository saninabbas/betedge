/**
 * BetEdge Automated Daily Football Analysis & Sports Education Publisher Engine
 * Reuses BetEdge static architecture, updates assets/blog-data.js, sitemap.xml, and content-calendar.json.
 * Features: Draft/Approval mode, duplicate prevention, logging, schema markup, responsible affiliate CTA.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const CALENDAR_PATH = path.join(ROOT_DIR, 'content-calendar.json');
const BLOG_DATA_PATH = path.join(ROOT_DIR, 'assets', 'blog-data.js');
const SITEMAP_PATH = path.join(ROOT_DIR, 'sitemap.xml');
const LOGS_DIR = path.join(ROOT_DIR, 'logs');
const LOG_FILE = path.join(LOGS_DIR, 'publish.log');
const HISTORY_FILE = path.join(LOGS_DIR, 'publish-history.json');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function logMessage(msg) {
  ensureDir(LOGS_DIR);
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${msg}\n`;
  fs.appendFileSync(LOG_FILE, line, 'utf8');
  console.log(`[BetEdge Publisher] ${msg}`);
}

function loadHistory() {
  ensureDir(LOGS_DIR);
  if (!fs.existsSync(HISTORY_FILE)) {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2), 'utf8');
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveHistory(history) {
  ensureDir(LOGS_DIR);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00Z');
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

function generateArticleHtml(item) {
  const formattedDate = formatDate(item.publishDate);
  const fullUrl = `https://betedge.site/${item.slug}`;

  let articleBodyHtml = '';

  if (item.id === 'b-20261018') {
    articleBodyHtml = `
  <p>
    For decades, traditional football match reporting relied on raw box-score metrics: total shots, shots on target, and possession percentages. However, anyone who has watched a match where a team took 20 speculative shots from 35 yards out while their opponent scored from two unmarked tap-ins knows that <strong>shot quantity does not equal shot quality</strong>.
  </p>
  <p>
    Published on <strong>${formattedDate}</strong> by the BetEdge Football Analytics Desk, this guide provides a deep-dive tutorial into <strong>Expected Goals (xG)</strong>. We examine the mathematical principles behind modern xG models, how shot angles, distances, and assist types calculate conversion probabilities, and how objective analysts use xG to detect false team form before the broader market catches on.
  </p>

  <h2>1. What is Expected Goals (xG)?</h2>
  <p>
    Expected Goals (xG) is a predictive and descriptive metric that measures the quality of a goal-scoring chance. Every shot taken in a football match is assigned a probability value between <strong>0.00 and 1.00</strong>:
  </p>
  <ul>
    <li>An xG value of <strong>0.10</strong> means that an average professional player is expected to score from that specific position 1 out of 10 times (10% conversion rate).</li>
    <li>A penalty kick carries an industry-standard benchmark value of <strong>0.76 xG to 0.79 xG</strong> (roughly a 78% historical scoring frequency).</li>
    <li>A desperate volley from 30 yards with three defenders closing down might be valued at <strong>0.02 xG</strong> (2% probability).</li>
  </ul>

  <h2>2. Variables Inside an Advanced xG Model</h2>
  <p>
    Leading sports analytics providers (such as Opta and StatsBomb) train machine learning models on databases containing hundreds of thousands of historical shots. Key weighting parameters include:
  </p>
  <div class="table-box" style="padding:16px; margin:20px 0; background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:8px;">
    <ul style="margin:0; padding-left:20px;">
      <li><strong>Distance to Goal:</strong> The exponential drop-off in scoring probability beyond 18 yards.</li>
      <li><strong>Shot Angle:</strong> The visible goal mouth surface area available between the posts.</li>
      <li><strong>Body Part:</strong> Foot strikes vs. headed attempts (headed chances generally convert at roughly half the rate of foot strikes from equivalent locations).</li>
      <li><strong>Assist Type:</strong> Open-play through-balls, crosses, cutbacks, rebounds, or defensive errors.</li>
      <li><strong>Defensive Pressure:</strong> Goalkeeper positioning and the proximity of blocking defenders.</li>
    </ul>
  </div>

  <h2>3. Shot Quality vs. Shot Quantity: A Comparative Table</h2>
  <table class="table-box">
    <thead>
      <tr><th>Chance Scenario</th><th>Typical Shot Distance</th><th>Defensive Pressure</th><th>Estimated xG Value</th><th>Expected Outcome</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Unmarked Central Cutback</strong></td><td>8 Yards (Six-Yard Box Edge)</td><td>Low (Goalkeeper scrambling)</td><td><strong style="color:var(--green)">0.55 &ndash; 0.65 xG</strong></td><td>Goal scored in ~60% of trials</td></tr>
      <tr><td><strong>Penalty Kick</strong></td><td>12 Yards</td><td>Zero (1v1 against Keeper)</td><td><strong style="color:var(--green)">0.78 xG</strong></td><td>Standard historical conversion</td></tr>
      <tr><td><strong>Contested Header from Cross</strong></td><td>11 Yards</td><td>High (Center-back challenging)</td><td><strong style="color:var(--gold)">0.08 &ndash; 0.12 xG</strong></td><td>Goal scored in ~10% of trials</td></tr>
      <tr><td><strong>Open Play Long-Range Strike</strong></td><td>28 Yards</td><td>Moderate (Defender closing down)</td><td><strong style="color:var(--gold)">0.03 &ndash; 0.05 xG</strong></td><td>Goal scored in ~4% of trials</td></tr>
      <tr><td><strong>Tight Angle Wing Effort</strong></td><td>14 Yards (Narrow Angle)</td><td>High (Near post covered)</td><td><strong>0.02 &ndash; 0.04 xG</strong></td><td>Low probability save/clearance</td></tr>
    </tbody>
  </table>

  <h2>4. Non-Penalty Expected Goals (npxG) &amp; Form Regression</h2>
  <p>
    When conducting objective team form research, analysts rely on <strong>Non-Penalty Expected Goals (npxG)</strong>. Penalties introduce sudden +0.78 xG spikes that distort a team's genuine open-play chance creation rate.
  </p>
  <p>
    <strong>Identifying Regression Candidates:</strong>
  </p>
  <ol>
    <li><strong>The Lucky Over-Performer:</strong> A team that scored 12 goals in 4 matches from only 4.5 npxG is experiencing temporary finishing variance. In the long term, goal conversion rates regress to the mean.</li>
    <li><strong>The Unlucky Under-Performer:</strong> A team that created 9.0 npxG across three fixtures but scored only 1 goal due to miraculous goalkeeper saves is playing high-quality football. Backing their underlying performance before the public realizes the discrepancy often provides superior analytical value.</li>
  </ol>

  <h2>5. Limitations of xG: What the Metric Misses</h2>
  <p>
    While xG is an essential tool, it is not infallible. Disciplined researchers must account for its inherent limitations:
  </p>
  <ul>
    <li><strong>Game State Bias:</strong> Teams that score early often sit in a defensive low block, voluntarily ceding possession and shot volume while preserving their lead. Their lower xG reflects tactical control, not poor performance.</li>
    <li><strong>Dangerous Attacks Without Shots:</strong> If an attacker fails to connect with an open-goal cross by two inches, the xG recorded is exactly <strong>0.00</strong>, despite the chance being inherently dangerous. Modern Expected Threat (xT) models supplement this gap.</li>
    <li><strong>Individual Finishing Outliers:</strong> Elite world-class finishers (e.g. Son Heung-min, Harry Kane, Kevin De Bruyne) consistently out-perform xG benchmarks over multi-year samples due to superior ball-striking technique.</li>
  </ul>

  <h2>Responsible Research &amp; Independent Verification</h2>
  <p>
    Analytical models should inform reasoned opinions, never compulsive wagering. Always treat sports betting as an entertainment expense with strict capital limits. Independent data feeds can be cross-referenced at official data resources:
  </p>
  <ul>
    <li><a href="https://theanalyst.com/eu/data/" target="_blank" rel="noopener nofollow">Opta Analyst</a> — Global football advanced statistical databases and match performance indexes.</li>
    <li><a href="https://www.begambleaware.org/" target="_blank" rel="noopener nofollow">BeGambleAware</a> — Independent problem gambling prevention and confidential support resources.</li>
  </ul>

  <div class="cta-box">
    <h3>Apply Advanced Football Analytics on Z7777</h3>
    <p>Compare competitive European football odds, live match trackers, and instant 8-minute local wallet withdrawals on Pakistan's #1 rated sports portal.</p>
    <a href="https://z7777.online/" class="btn" target="_blank" rel="noopener">Explore Live Football Markets on Z7777 &rarr;</a>
    <div style="font-size:11px; color:var(--muted); margin-top:10px;">
      *Affiliate &amp; commercial partnership disclosure: 18+ T&amp;Cs apply. Wagering involves financial risk. Please play responsibly.
    </div>
  </div>
    `;
  } else {
    articleBodyHtml = `
  <p>
    Objective football analysis requires combining tactical context with verified empirical data. Published on <strong>${formattedDate}</strong> by the BetEdge Editorial Team, this analysis investigates <strong>${item.primaryKeyword}</strong>.
  </p>
  <h2>Statistical Framework for ${item.category}</h2>
  <p>
    Evaluating match metrics involves separating signal from noise. Long-term sample sizes consistently normalize short-term variance.
  </p>
  <h2>Responsible Gambling Advice</h2>
  <p>
    No statistical model guarantees sports outcomes. Always bet within predefined personal limits and never wager funds needed for essential living expenses.
  </p>
  <div class="cta-box">
    <h3>Compare Certified Sportsbooks on BetEdge</h3>
    <p>Read honest, unbiased reviews of top licensed portals offering competitive odds and instant mobile cashouts.</p>
    <a href="https://z7777.online/" class="btn" target="_blank" rel="noopener">Visit Ranked Portal Z7777 &rarr;</a>
  </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${item.title} | BetEdge</title>
<meta name="description" content="${item.metaDescription}">
<link rel="canonical" href="${fullUrl}">
<link rel="stylesheet" href="styles.css?v=3">
<meta property="og:type" content="article">
<meta property="og:title" content="${item.title}">
<meta property="og:description" content="${item.metaDescription}">
<meta property="og:url" content="${fullUrl}">
<meta property="og:site_name" content="BetEdge">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${item.title}">
<meta name="twitter:description" content="${item.metaDescription}">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "${item.title.replace(/"/g, '\\"')}",
      "datePublished": "${item.publishDate}T09:00:00+05:00",
      "dateModified": "${item.publishDate}T09:00:00+05:00",
      "author": {
        "@type": "Organization",
        "name": "BetEdge Football Analytics Desk"
      },
      "publisher": {
        "@type": "Organization",
        "name": "BetEdge",
        "logo": {
          "@type": "ImageObject",
          "url": "https://betedge.site/assets/og.jpg"
        }
      },
      "description": "${item.metaDescription.replace(/"/g, '\\"')}",
      "mainEntityOfPage": "${fullUrl}"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://betedge.site/index.html"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://betedge.site/blog"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "${item.title.replace(/"/g, '\\"')}",
          "item": "${fullUrl}"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What does an xG value of 0.25 mean in football?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An xG value of 0.25 indicates that historical data models calculate a 25% probability (or 1 in 4 chance) of that specific shot resulting in a goal based on distance, angle, assist type, and defensive pressure."
          }
        },
        {
          "@type": "Question",
          "name": "Why is non-penalty xG (npxG) preferred for team form analysis?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Penalties award an artificial +0.78 xG value that can skew short-term statistical samples. Removing penalties reveals a team's true open-play and set-piece chance creation ability."
          }
        }
      ]
    }
  ]
}
</script>
</head>
<body>
<div class="topbar">18+ Play Responsibly. Pakistan's Premier Sports Betting &amp; Casino Review Guide.</div>
<header>
  <div class="wrap nav">
    <a href="index.html" class="logo">BET<span>EDGE</span></a>
    <nav class="nav-links">
      <a href="index.html">Home</a>
      <a href="blog.html">Blogs</a>
      <a href="${item.slug}.html">${item.category}</a>
      <a href="reviews.html">Reviews</a>
      <a href="bonuses.html">Bonuses</a>
    </nav>
    <a href="https://z7777.online/" class="btn" target="_blank" rel="noopener">Visit #1 Ranked Portal</a>
  </div>
</header>
<main class="wrap">
<article class="article-body">
  <span class="badge">Published: ${formattedDate} · ${item.category}</span>
  <h1>${item.title}</h1>
  ${articleBodyHtml}
</article>
</main>
<footer class="foot">
  <div class="wrap">
    <div class="rg" style="font-size:12px; color:var(--muted); margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:12px;">
      <strong>18+ Responsible Gambling Notice:</strong> Sports betting involves risk of financial loss. Never wager money essential for daily living. Wager responsibly using personal deposit limits. Free support is available at BeGambleAware.org and GamCare.
    </div>
    <p>&copy; 2026 BetEdge Pakistan. All rights reserved. 18+ Play Responsibly.</p>
  </div>
</footer>
</body>
</html>
`;
}

function updateBlogData(item) {
  if (!fs.existsSync(BLOG_DATA_PATH)) {
    logMessage(`Warning: blog-data.js not found at ${BLOG_DATA_PATH}`);
    return;
  }
  let content = fs.readFileSync(BLOG_DATA_PATH, 'utf8');
  const newEntry = {
    file: `${item.slug}.html`,
    title: item.title.replace(' (October 18, 2026)', ''),
    cat: 'Sports',
    excerpt: item.metaDescription,
    game: 'Sports',
    slug: 'sports'
  };

  const entryJson = JSON.stringify(newEntry);

  if (content.includes(newEntry.file)) {
    logMessage(`Entry already exists in blog-data.js for ${item.slug}`);
    return;
  }

  // Prepend to window.BLOG array
  if (content.includes('window.BLOG = [')) {
    content = content.replace('window.BLOG = [', `window.BLOG = [${entryJson},`);
    fs.writeFileSync(BLOG_DATA_PATH, content, 'utf8');
    logMessage(`Prepend entry to assets/blog-data.js for ${item.slug}`);
  }
}

function updateSitemap(item) {
  if (!fs.existsSync(SITEMAP_PATH)) {
    logMessage(`Warning: sitemap.xml not found at ${SITEMAP_PATH}`);
    return;
  }
  let content = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const sitemapEntry = `  <url><loc>https://betedge.site/${item.slug}</loc><changefreq>weekly</changefreq></url>\n`;

  if (content.includes(`/${item.slug}`)) {
    logMessage(`URL already in sitemap.xml for ${item.slug}`);
    return;
  }

  // Insert before </urlset>
  if (content.includes('</urlset>')) {
    content = content.replace('</urlset>', `${sitemapEntry}</urlset>`);
    fs.writeFileSync(SITEMAP_PATH, content, 'utf8');
    logMessage(`Updated sitemap.xml with entry for ${item.slug}`);
  }
}

function runPublisher(forceToday = null) {
  logMessage('Starting daily publication job...');
  if (!fs.existsSync(CALENDAR_PATH)) {
    logMessage(`Error: Calendar file missing at ${CALENDAR_PATH}`);
    return;
  }

  const calendar = JSON.parse(fs.readFileSync(CALENDAR_PATH, 'utf8'));
  const todayDate = forceToday || new Date().toISOString().split('T')[0];
  logMessage(`Target publication date: ${todayDate}`);

  // Find candidate item
  const candidate = calendar.items.find(i => i.publishDate === todayDate);
  if (!candidate) {
    logMessage(`No scheduled calendar entry found for date: ${todayDate}`);
    return;
  }

  logMessage(`Found calendar item ID: ${candidate.id} - "${candidate.title}" (Status: ${candidate.status})`);

  // Administrator approval gate: Only publish if status is 'approved'
  if (candidate.status !== 'approved') {
    logMessage(`Item ${candidate.id} is currently in '${candidate.status}' mode. Administrator approval required before publishing.`);
    return;
  }

  const targetHtmlFile = path.join(ROOT_DIR, `${candidate.slug}.html`);

  // Duplicate prevention check
  if (fs.existsSync(targetHtmlFile)) {
    logMessage(`Duplicate prevention: File ${candidate.slug}.html already exists on disk.`);
    candidate.status = 'published';
    fs.writeFileSync(CALENDAR_PATH, JSON.stringify(calendar, null, 2), 'utf8');
    return;
  }

  // Generate HTML
  const htmlContent = generateArticleHtml(candidate);
  fs.writeFileSync(targetHtmlFile, htmlContent, 'utf8');
  logMessage(`Created article file: ${targetHtmlFile} (${htmlContent.length} bytes)`);

  // Update blog data and sitemap
  updateBlogData(candidate);
  updateSitemap(candidate);

  // Update calendar state
  candidate.status = 'published';
  candidate.publishedAt = new Date().toISOString();
  fs.writeFileSync(CALENDAR_PATH, JSON.stringify(calendar, null, 2), 'utf8');

  // Record history log
  const history = loadHistory();
  history.push({
    id: candidate.id,
    title: candidate.title,
    slug: candidate.slug,
    date: candidate.publishDate,
    publishedAt: candidate.publishedAt,
    file: `${candidate.slug}.html`
  });
  saveHistory(history);

  logMessage(`Successfully published and verified: ${candidate.title}`);
}

const argDate = process.argv[2];
runPublisher(argDate);
