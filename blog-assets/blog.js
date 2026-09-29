/* =========================================================
   SIGMA BLOG SCRIPT
   Plain JavaScript, no libraries. Loaded after blog-posts.js.

   blogs.html        builds the article list from the posts in
                     blog-posts.js: featured article, category
                     filters, search, tag links and Load More.

   blogs/<slug>.html each article is a complete HTML page on its
                     own (that is what Google reads). This script
                     only adds extras: reading time, table of
                     contents, share buttons, previous / next and
                     related articles.

   The <script> tag says where the site root is:
   <script src="../blog-assets/blog.js" data-root="../"></script>
========================================================= */

(function () {

    "use strict";

    const script = document.currentScript;
    const ROOT = new URL(script.dataset.root || "./", location.href);
    const PAGE_SIZE = 9;
    const MONTHS = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];


    /* ---------- helpers ---------- */

    function esc(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function formatDate(iso) {
        const [y, m, d] = String(iso).split("-").map(Number);
        return y && m && d ? `${d} ${MONTHS[m - 1]} ${y}` : "";
    }

    function today() {
        const now = new Date();
        return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    }

    // Links use .html so they work everywhere. On Vercel, cleanUrls
    // (vercel.json) turns /blogs/some-post.html into /blogs/some-post.
    function postUrl(post) {
        return new URL(`blogs/${post.slug}.html`, ROOT).href;
    }

    function listUrl(params) {
        const url = new URL("blogs.html", ROOT);
        Object.entries(params || {}).forEach(([key, value]) => url.searchParams.set(key, value));
        return url.href;
    }

    function imageUrl(path) {
        return path ? new URL(path, ROOT).href : "";
    }

    // Published posts only, newest first. Drafts and future dates stay hidden.
    function getPosts() {
        const now = today();
        return (window.SIGMA_BLOG_POSTS || [])
            .filter(post => post && post.slug && post.title && !post.draft && (post.date || "") <= now)
            .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    }

    function metaHtml(post) {
        return `
            <div class="blog-meta">
                <a class="blog-category" href="${esc(listUrl({ category: post.category }))}">${esc(post.category)}</a>
                <time datetime="${esc(post.date)}">${formatDate(post.date)}</time>
                ${post.readTime ? `<i></i><span>${esc(post.readTime)}</span>` : ""}
            </div>`;
    }

    function cardHtml(post) {
        return `
            <article class="blog-card blog-appear">
                <a class="blog-card-image" href="${esc(postUrl(post))}" tabindex="-1" aria-hidden="true">
                    <img src="${esc(imageUrl(post.image))}" alt="" loading="lazy" width="800" height="500">
                </a>
                <div class="blog-card-body">
                    ${metaHtml(post)}
                    <h3><a href="${esc(postUrl(post))}">${esc(post.title)}</a></h3>
                    <p>${esc(post.excerpt)}</p>
                    <span class="text-link">Read Article <span>→</span></span>
                </div>
            </article>`;
    }

    function featuredHtml(post) {
        return `
            <article class="blog-featured blog-appear">
                <a class="blog-featured-image" href="${esc(postUrl(post))}" tabindex="-1" aria-hidden="true">
                    <img src="${esc(imageUrl(post.image))}" alt="" width="1200" height="800">
                    <span class="blog-featured-badge">Featured</span>
                </a>
                <div class="blog-featured-body">
                    ${metaHtml(post)}
                    <h2><a href="${esc(postUrl(post))}">${esc(post.title)}</a></h2>
                    <p>${esc(post.excerpt)}</p>
                    <span class="btn btn-blue">Read Article <span>→</span></span>
                </div>
            </article>`;
    }


    /* =========================================================
       LISTING PAGE (blogs.html)
    ========================================================= */

    function initListing(posts) {
        const featuredEl = document.getElementById("blogFeatured");
        const gridEl = document.getElementById("blogGrid");
        const filtersEl = document.getElementById("blogFilters");
        const searchEl = document.getElementById("blogSearch");
        const statusEl = document.getElementById("blogStatus");
        const moreEl = document.getElementById("blogMore");
        const emptyEl = document.getElementById("blogEmpty");

        const params = new URLSearchParams(location.search);
        const categories = [...new Set(posts.map(post => post.category).filter(Boolean))];
        let category = categories.includes(params.get("category")) ? params.get("category") : "All";
        let tag = params.get("tag") || "";
        let limit = PAGE_SIZE;
        searchEl.value = params.get("q") || "";

        filtersEl.innerHTML = ["All", ...categories].map(name => {
            const count = name === "All" ? posts.length : posts.filter(post => post.category === name).length;
            return `<button type="button" class="blog-filter" data-category="${esc(name)}">${esc(name)} <small>${count}</small></button>`;
        }).join("");

        function saveState() {
            const url = new URL(location.href);
            url.search = "";
            if (category !== "All") url.searchParams.set("category", category);
            if (tag) url.searchParams.set("tag", tag);
            if (searchEl.value.trim()) url.searchParams.set("q", searchEl.value.trim());
            history.replaceState(null, "", url);
        }

        function render() {
            const words = searchEl.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
            const browsing = category === "All" && !tag && !words.length;

            filtersEl.querySelectorAll(".blog-filter").forEach(button => {
                const active = button.dataset.category === category;
                button.classList.toggle("active", active);
                button.setAttribute("aria-pressed", String(active));
            });

            let list = posts.filter(post => {
                if (category !== "All" && post.category !== category) return false;
                if (tag && !(post.tags || []).includes(tag)) return false;
                const text = [post.title, post.excerpt, post.category, post.author, ...(post.tags || [])].join(" ").toLowerCase();
                return words.every(word => text.includes(word));
            });

            const featured = browsing ? (posts.find(post => post.featured) || posts[0]) : null;
            if (featured) list = list.filter(post => post !== featured);

            featuredEl.innerHTML = featured ? featuredHtml(featured) : "";
            gridEl.innerHTML = list.slice(0, limit).map(cardHtml).join("");
            emptyEl.hidden = list.length > 0 || !!featured;
            moreEl.hidden = list.length <= limit;

            if (browsing) {
                statusEl.hidden = true;
            } else {
                const bits = [];
                if (tag) bits.push(`tagged “${esc(tag)}”`);
                if (words.length) bits.push(`matching “${esc(searchEl.value.trim())}”`);
                if (category !== "All") bits.push(`in ${esc(category)}`);
                statusEl.innerHTML = `${list.length} article${list.length === 1 ? "" : "s"} ${bits.join(" ")}
                    <button type="button" data-clear>Clear</button>`;
                statusEl.hidden = false;
            }
        }

        filtersEl.addEventListener("click", event => {
            const button = event.target.closest(".blog-filter");
            if (!button) return;
            category = button.dataset.category;
            tag = "";
            limit = PAGE_SIZE;
            saveState();
            render();
        });

        let typing;
        searchEl.addEventListener("input", () => {
            clearTimeout(typing);
            typing = setTimeout(() => {
                limit = PAGE_SIZE;
                saveState();
                render();
            }, 150);
        });

        statusEl.addEventListener("click", event => {
            if (!event.target.closest("[data-clear]")) return;
            category = "All";
            tag = "";
            searchEl.value = "";
            limit = PAGE_SIZE;
            saveState();
            render();
        });

        moreEl.addEventListener("click", () => {
            limit += PAGE_SIZE;
            render();
        });

        // Topic cards and category links on this page filter in place
        document.addEventListener("click", event => {
            const link = event.target.closest("a[href*='blogs.html?']");
            if (!link || event.metaKey || event.ctrlKey) return;
            const url = new URL(link.href);
            if (url.pathname !== location.pathname) return;
            event.preventDefault();
            category = categories.includes(url.searchParams.get("category")) ? url.searchParams.get("category") : "All";
            tag = url.searchParams.get("tag") || "";
            searchEl.value = url.searchParams.get("q") || "";
            limit = PAGE_SIZE;
            saveState();
            render();
            document.getElementById("articles").scrollIntoView({ behavior: "smooth" });
        });

        // Article counts on the topic cards
        document.querySelectorAll("[data-topic-count]").forEach(el => {
            const n = posts.filter(post => post.category === el.dataset.topicCount).length;
            el.textContent = `${n} article${n === 1 ? "" : "s"}`;
        });

        render();
    }


    /* =========================================================
       ARTICLE PAGES (blogs/<slug>.html)
    ========================================================= */

    function initArticle(article) {
        const body = article.querySelector(".post-body");

        // Reading time from the article text
        const text = [...article.querySelectorAll(".post-body, .post-faq")].map(el => el.textContent).join(" ");
        const words = text.trim().split(/\s+/).length;
        const readTime = Math.max(1, Math.round(words / 200)) + " min read";
        document.querySelectorAll("[data-read-time]").forEach(el => { el.textContent = readTime; });

        buildToc(body);
        initShare();

        // Previous / next and related articles
        const posts = getPosts();
        const index = posts.findIndex(post => post.slug === article.dataset.slug);
        if (index === -1) return;

        const post = posts[index];
        const newer = posts[index - 1];
        const older = posts[index + 1];

        const nav = document.getElementById("postNav");
        if (nav && (newer || older)) {
            nav.innerHTML = `
                ${older ? `<a href="${esc(postUrl(older))}" rel="prev"><small>← Previous article</small>${esc(older.title)}</a>` : ""}
                ${newer ? `<a class="post-nav-next" href="${esc(postUrl(newer))}" rel="next"><small>Next article →</small>${esc(newer.title)}</a>` : ""}`;
            nav.hidden = false;
        }

        // Related: most shared tags first, then same category, then newest
        const tags = new Set(post.tags || []);
        const related = posts
            .filter(p => p !== post)
            .map(p => ({
                post: p,
                score: (p.tags || []).filter(t => tags.has(t)).length * 2 + (p.category === post.category ? 1 : 0)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(item => item.post);

        const relatedSection = document.getElementById("postRelated");
        if (relatedSection && related.length) {
            relatedSection.querySelector(".blog-grid").innerHTML = related.map(cardHtml).join("");
            relatedSection.hidden = false;
        }
    }

    function buildToc(body) {
        const toc = document.getElementById("postToc");
        const headings = [...body.querySelectorAll("h2")];
        if (!toc || headings.length < 2) return;

        headings.forEach(h => {
            if (h.id) return;
            let id = h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
            while (document.getElementById(id)) id += "-2";
            h.id = id;
        });

        toc.querySelector("ol").innerHTML = headings
            .map(h => `<li><a href="#${h.id}">${esc(h.textContent)}</a></li>`)
            .join("");
        toc.hidden = false;

        // Collapsed by default on phones, always open on larger screens
        const phone = window.matchMedia("(max-width: 920px)");
        const sync = () => { toc.open = !phone.matches; };
        sync();
        phone.addEventListener("change", sync);
        toc.addEventListener("click", event => {
            if (event.target.closest("a") && phone.matches) toc.open = false;
        });

        if (!("IntersectionObserver" in window)) return;
        const links = [...toc.querySelectorAll("a")];
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                links.forEach(link => link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id));
            });
        }, { rootMargin: "0px 0px -70% 0px" });
        headings.forEach(h => observer.observe(h));
    }

    function initShare() {
        const canonical = document.querySelector('link[rel="canonical"]');
        const pageUrl = canonical ? canonical.href : location.href;
        const title = (document.querySelector("h1")?.textContent || document.title).trim();
        const status = document.getElementById("shareStatus");
        const say = text => {
            if (!status) return;
            status.textContent = text;
            setTimeout(() => { status.textContent = ""; }, 2200);
        };

        const links = {
            whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + pageUrl)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
            x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(title)}`,
            email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(pageUrl)}`
        };
        document.querySelectorAll("[data-share]").forEach(link => {
            if (links[link.dataset.share]) link.href = links[link.dataset.share];
        });

        document.querySelectorAll(".js-copy-link").forEach(button => {
            button.addEventListener("click", () => {
                const fallback = () => {
                    const input = document.createElement("input");
                    input.value = pageUrl;
                    document.body.appendChild(input);
                    input.select();
                    try { document.execCommand("copy"); say("Link copied ✓"); } catch (e) { say(pageUrl); }
                    input.remove();
                };
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(pageUrl).then(() => say("Link copied ✓"), fallback);
                } else {
                    fallback();
                }
            });
        });

        // Phone share sheet, where the browser has one
        document.querySelectorAll(".js-native-share").forEach(button => {
            if (!navigator.share) return;
            button.hidden = false;
            button.addEventListener("click", () => {
                navigator.share({ title, url: pageUrl }).catch(() => {});
            });
        });
    }


    /* ---------- start ---------- */

    function start() {
        const article = document.querySelector(".post-article[data-slug]");
        if (article) {
            initArticle(article);
            return;
        }

        if (!document.getElementById("blogGrid")) return;

        const posts = getPosts();
        if (!window.SIGMA_BLOG_POSTS) {
            const empty = document.getElementById("blogEmpty");
            empty.innerHTML = `<h3>Articles could not be loaded</h3>
                <p>blog-assets/blog-posts.js is missing or has a typing mistake (often a missing comma).</p>`;
            empty.hidden = false;
            return;
        }
        initListing(posts);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }

})();
