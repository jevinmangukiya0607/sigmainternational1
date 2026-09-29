# SIGMA Blog: how it works

Plain HTML, CSS and JavaScript. No build step, no packages, nothing to install.
Every article is its own page with a clean address:

```
https://sigmainternational1.vercel.app/blogs                                  ← all articles
https://sigmainternational1.vercel.app/blogs/what-is-asteria                  ← one article
https://sigmainternational1.vercel.app/blogs/day-school-or-residential-school
```

The files are ordinary `.html` files (`blogs/what-is-asteria.html`). The small
`vercel.json` file tells Vercel to drop the `.html` from addresses. It does this for
the whole site, so `/about-sigma.html` becomes `/about-sigma` too; old links with
`.html` keep working because Vercel redirects them automatically.


## Where each file goes

Put these in your site's root folder, the one that already has `index.html`,
`styles.css` and `script.js`:

```
your-site/
├── index.html, styles.css, script.js, SIGMA.SVG ... (already there)
├── blogs.html                        ← replaces the "Coming Soon" page
├── vercel.json                       ← new (if you already have one, add "cleanUrls": true to it)
├── sitemap.xml                       ← new (merge if you already have one)
├── robots.txt                        ← new (merge if you already have one)
├── README-blogs.md                   ← this guide (optional)
├── blog-assets/
│   ├── blog.css                      ← blog styles
│   ├── blog.js                       ← blog features
│   └── blog-posts.js                 ← THE LIST OF ARTICLES (edit this)
└── blogs/
    ├── _template.html                ← copy this for new articles
    ├── day-school-or-residential-school.html
    ├── what-is-asteria.html
    ├── preparing-your-child-for-boarding.html
    ├── cbse-school-admission-checklist.html
    ├── questions-to-ask-on-a-school-visit.html
    └── why-life-skills-matter.html
```

The file name is the address: `blogs/what-is-asteria.html` becomes `/blogs/what-is-asteria`.


## Features

**blogs.html**
- Featured article card at the top (the newest, or the one marked `featured`)
- Category filter buttons with article counts, made from your categories
- Search as you type (title, summary, category, tags)
- Tag links (`/blogs?tag=CBSE`) and shareable filters (`/blogs?category=Admissions`)
- "Load More" after 9 articles, "no results" message
- Browse by Topic cards

**Every article page**
- The full article is in the HTML itself, which is what Google reads
- Its own title, description, canonical address and link previews for WhatsApp, Facebook, LinkedIn and X
- Google structured data: Article, Breadcrumb and FAQ (can show as rich results)
- Breadcrumb, category, date and reading time
- "In this article" contents list made from the headings, highlights where you are (collapses on phones)
- Share buttons: WhatsApp, Facebook, LinkedIn, X, email, copy link, and the phone's own share menu
- Frequently asked questions (open/close)
- Tags, author box, previous / next article, three related articles
- Campus visit band and the same enquiry form as the rest of the site
- Prints cleanly (menus and forms are hidden)


## Add a new article (4 steps)

**1. Copy the template.**
Copy `blogs/_template.html` and rename the copy to the article's address, e.g.
`blogs/cbse-boarding-school-vadodara.html`. Use lowercase words joined by hyphens, with
words parents actually search for. Don't rename it after publishing.

**2. Edit the new file.** Everything to change is marked `EDIT`:
- In `<head>`: the title, description, the address in `canonical` and `og:url`, the
  image, the dates and tags, and the Google data (`ld+json`) blocks, which repeat
  the same details.
- Change `<meta name="robots" content="noindex, follow">` to
  `content="index, follow, max-image-preview:large"`. **Important:** the template is
  hidden from Google on purpose, your article should not be.
- In the page: hero image, category, date, title, intro, article text, questions, tags, author.
- `data-slug="..."` on `<article>` must be the file name without `.html`.

Building blocks you can use inside `<div class="post-body">`:

```html
<p>Paragraph with <strong>bold</strong> and <a href="../contact.html">a link</a>.</p>
<h2>Section heading (appears in "In this article")</h2>
<h3>Smaller heading</h3>
<ul><li>Bullet point</li></ul>
<ul class="post-checklist"><li>Item with a ✓ tick</li></ul>
<ol class="post-steps"><li><strong>Step.</strong> Numbered 01, 02, 03</li></ol>
<blockquote><p>A highlighted quote.</p><cite>Name</cite></blockquote>
<aside class="post-callout"><strong>Good to know</strong><p>A tip or call to action.</p></aside>
<figure><img src="../images/blog/photo.jpg" alt="What the photo shows" loading="lazy"><figcaption>Caption</figcaption></figure>
<div class="post-table-wrap"><table>...</table></div>
```

Links to other pages start with `../` because articles sit inside the `blogs`
folder (`../contact.html`, `../blogs/what-is-asteria.html`).

**3. Add it to `blog-assets/blog-posts.js`** so it appears on blogs.html and in
related articles. Paste a new block at the top of the list:

```js
    {
        "slug": "cbse-boarding-school-vadodara",
        "title": "Same title as the page",
        "excerpt": "One or two sentences for the card.",
        "category": "Admissions",
        "date": "2026-10-05",
        "author": "SIGMA Admissions Team",
        "image": "https://.../photo.jpg",
        "tags": ["Admissions", "Boarding"],
        "readTime": "4 min read"
    },
```

Keep the comma after `}` when another block follows. Optional: `"featured": true`
(big card at the top), `"draft": true` (hidden). A future `date` stays hidden until that day.

**4. Add the address to `sitemap.xml`** under "Blog articles":

```xml
  <url><loc>https://sigmainternational1.vercel.app/blogs/cbse-boarding-school-vadodara</loc><lastmod>2026-10-05</lastmod></url>
```

Then upload / push as usual. After it's live, you can ask Google to index it
faster in Google Search Console (URL Inspection → Request indexing).


## Good to know

- **Opening files from your computer works.** Double-click `blogs.html` or any
  article file and everything shows, including the article list.
- If blogs.html shows "Articles could not be loaded", `blog-posts.js` has a typing
  mistake, usually a missing comma or quote.
- The site menu, footer and enquiry form in the blog pages are copies of those in
  `index.html`, as on every other page. If you change the menu, change it here too.
  In the blog pages, the old broken links (about.html, academics.html, apply-online.html
  and so on) already point at the live pages.
- When the school's own domain goes live, search and replace
  `https://sigmainternational1.vercel.app` in all blog files and sitemap.xml.
- The six articles are written from the site's own content and general parent
  guidance. Please have the school check them (especially the admission documents
  list) before publishing.
- Submit `https://sigmainternational1.vercel.app/sitemap.xml` once in Google Search
  Console so Google finds every article.
