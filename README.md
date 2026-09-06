# Tan Ying Xiu — Portfolio

My personal portfolio site — rebuilt from scratch in plain HTML/CSS/JS (no
frameworks, no build step) to replace my old [Wix site](https://yingxiutan2003.wixsite.com/my-site-1).

## Structure

```
index.html          # all page content
css/style.css        # all styling
js/main.js           # nav, scroll-reveal, active-link highlighting
assets/img/          # images
```

## Running locally

No build step needed — just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying (GitHub Pages)

A workflow at `.github/workflows/deploy-pages.yml` deploys the site
automatically on every push to `main`. To turn it on:

1. Go to **Settings → Pages** in this repo.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Merge/push to `main` — the site will publish at
   `https://<username>.github.io/<repo-name>/`.

## Updating content

Everything is in `index.html` — sections are labelled with HTML comments
(`<!-- ============ HERO ============ -->` etc.) so they're easy to find and edit.
