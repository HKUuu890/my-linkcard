# LinkCard - AI Coding Agent Instructions

## Project Overview
**LinkCard** is a static personal link aggregation page with Instagram-inspired design. It's a zero-framework project built on vanilla JavaScript, Simple.css, and GitHub Pages deployment.

**Key Purpose**: Enable users to fork this template, customize it with their profile/links, and keep it in sync with upstream template improvements without losing customizations.

**Tech Stack**:
- Vanilla JavaScript (no frameworks) - fast and lightweight
- CSS with CSS variables for theming
- Iconify for scalable icon library
- GitHub Pages for free hosting
- npm scripts for build automation

## Architecture & Data Flow

### Configuration-Driven Rendering
All content comes from **`src/config.js`** - a single export with three main sections:

```javascript
export default {
  profile: { name, title, bio, avatar },      // Displayed as hero section
  links: [{...}, ...],                          // Rendered as link cards
  about: { title, paragraphs: [...] }          // About section with "━━━" separator support
}
```

**Why this pattern?**: Enables separation of content (config) from presentation (JavaScript), allowing users to customize without editing code logic.

### Core Rendering Classes
- **`LinkPageApp`** (`src/js/main.js`): Main orchestrator
  - `renderProfile()` - outputs profile section with gradient border
  - `renderLinks()` - dynamically generates link cards with inline icon colors
  - `renderAbout()` - converts "━━━" strings to `<hr>` elements
  - `loadIconify()` - lazy-loads Iconify library only if needed

- **`ShareManager`** (`src/js/share.js`): Handles Web Share API with fallbacks
  - Tries native `navigator.share` (mobile) → clipboard copy
  - Fallback chain: modern Clipboard API → legacy `execCommand`
  - Shows toast notifications with auto-dismiss

### Link Card Types
Two rendering modes triggered by `link.type` property:
1. **Regular links** (default): Animated left border on hover, background color applied to icon
2. **Download links** (`type: "download"`): Fixed red left border, special styling via `.link-card-download` class

## Protected Files & Merge Strategy

This project uses **`merge=ours`** strategy in `.gitattributes` to protect customizations during template syncs:

**Protected** (user customizations - never overwritten):
- `src/config.js` - profile/links data
- `src/custom.css` - brand colors/styles  
- `src/assets/**` - user images/files
- `docs/**`, `dist/**` - generated builds

**Synced** (receive template improvements):
- `src/js/**`, `src/index.html` - core features
- `.github/workflows/**` - CI/CD updates
- `.github/hooks/post-merge` - auto-rebuild on sync

**Never edit template files** (`src/js/`, `src/index.html`) unless fixing bugs - users expect these to stay in sync.

## Development Workflow

### Common Commands
```bash
npm run dev        # Start live-server on port 8080 with file watching
npm run build      # Clean docs/ and rebuild all assets
npm run deploy     # Build + push to gh-pages branch
```

### Build Pipeline (in `build:all`)
1. **HTML**: Minifies with comments/whitespace removed, CSS/JS inline minified
2. **CSS**: Copied as-is (contains CSS variables users modify)
3. **JS**: Minified with terser (config.js also minified)
4. **Assets**: Copied to docs/ with error suppression

**Output**: `docs/` folder → served via GitHub Pages

### Icon Integration
- Icons from **Iconify CDN** (`mdi:` prefix for Material Design Icons)
- User specifies icon ID in `links[].icon`
- Dynamically rendered with `<span class="iconify" data-icon="...">`
- Iconify.js detects and loads SVGs on demand

## CSS Theming Pattern

`src/custom.css` uses **CSS variables** for all theming:

```css
--ig-pink: #FF0069;           /* Instagram brand colors */
--gradient-2: linear-gradient(135deg, var(--ig-pink), var(--ig-orange));
--gradient-bg: /* Complex mesh pattern gradient */
```

**Background**: Dual-layer overlay system using `body::before` and `body::after` with multiple `linear-gradient` patterns for polygon mesh effect.

**Why variables**: Users customize by editing values at the top of the file - no need to understand CSS selectors.

## Customization Patterns

### For Users
1. **Profile**: Edit `profile` object in `src/config.js` - avatar path, name, title, bio (string or array)
2. **Links**: Add objects to `links` array with `name`, `url`, `icon`, `color`, optional `description` and `type: "download"`
3. **About**: Edit `about.paragraphs` array - use `"━━━"` for visual separator
4. **Styles**: Modify CSS variables at top of `src/custom.css` (colors, gradients, spacing)

### For Developers Fixing Bugs
- **Adding features**: Modify `src/js/main.js` → update `LinkPageApp` methods
- **Styling**: Update `src/custom.css` CSS variables/selectors (users will sync this)
- **Never**: Hardcode user data into templates - keep it in `config.js`

## GitHub Actions & Deployment

**File**: `.github/workflows/deploy.yml`

**Trigger**: Push to `main` branch → automatic build and deploy to GitHub Pages

**Steps**:
1. Checkout code
2. Setup Node.js 18 + npm cache
3. Run `npm ci` (clean install)
4. Build with `npm run build` → outputs to `docs/`
5. Upload artifact → deploy to GitHub Pages

**Custom domain setup**: Users configure in repo Settings → Pages after push.

## Testing & Validation

**No automated tests** - validation is manual:
- `npm run dev` → verify rendering in browser at localhost:8080
- Check responsive design on mobile
- Verify share button copies URL correctly

**Build verification**: After code changes, run `npm run build` and test from `docs/` folder using `npm run serve:docs`.

## Common Pitfalls to Avoid

1. **Don't hardcode user data** - all content must come from `config.js`
2. **Don't remove `merge=ours`** in `.gitattributes` - breaks template sync protection
3. **Don't modify HTML structure drastically** - users depend on element IDs (`#profile`, `#links`, `#about`)
4. **Icon rendering**: Always test with Iconify CDN loaded - icons won't appear without it
5. **CSS custom properties**: Never use hardcoded colors - add to `:root` variables for user customization

## File Organization at a Glance

```
src/config.js           → User data (protected from sync)
src/js/main.js          → Rendering logic (synced from template)
src/js/share.js         → Share functionality (synced)
src/custom.css          → Theming (protected from sync)
src/index.html          → HTML template (synced)
.github/copilot-instructions.md  → This file
.gitattributes          → Merge strategy for template sync
sync-template.sh        → Helper script for users to sync updates
```
