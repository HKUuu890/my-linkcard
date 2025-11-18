import config from '../config.js';
import ShareManager from './share.js';

/**
 * Main application class for the link page
 * Handles rendering of profile, links, and about sections
 */
class LinkPageApp {
  constructor() {
    this.config = config;
  }

  /**
   * Renders user profile section with avatar, name, title, and bio
   */
  renderProfile() {
    const profileEl = document.getElementById('profile');
    if (!profileEl) return;

    const avatarHtml = this.config.profile.avatar 
      ? `<img src="${this.config.profile.avatar}" alt="${this.config.profile.name}">` 
      : '';

    const bioHtml = Array.isArray(this.config.profile.bio)
      ? this.config.profile.bio.map(line => `<p>${line}</p>`).join('')
      : `<p>${this.config.profile.bio}</p>`;

    profileEl.innerHTML = `
      ${avatarHtml}
      <h1>${this.config.profile.name}</h1>
      <p class="title">${this.config.profile.title}</p>
      ${bioHtml}
    `;
  }

  /**
   * Renders social media links with custom icons and brand colors
   */
  renderLinks() {
    const linksEl = document.getElementById('links');
    if (!linksEl) return;

    linksEl.innerHTML = '';
    
    this.config.links.forEach(link => {
      const linkEl = document.createElement('a');
      linkEl.href = link.url;
      linkEl.className = link.type === 'download' ? 'link-card link-card-download' : 'link-card';
      linkEl.target = '_blank';
      linkEl.rel = 'noopener noreferrer';

      // Add download attribute for download type links
      if (link.type === 'download') {
        linkEl.setAttribute('download', '');
      }

      // Apply brand color to icon if specified
      const iconStyle = link.color ? `style="color: ${link.color};"` : '';

      // Determine icon markup: image (local) or iconify symbol
      let iconMarkup = '';
      const isImage = link.icon && /\.(png|jpe?g|svg|gif)$/i.test(link.icon);
      if (isImage) {
        // Use an <img> for local image icons
        iconMarkup = `<img src="${link.icon}" alt="${link.name} icon" style="width:100%;height:100%;object-fit:contain;border-radius:6px;">`;
      } else {
        // Fallback to Iconify icon
        iconMarkup = `<span class="iconify" data-icon="${link.icon}"></span>`;
      }

      linkEl.innerHTML = `
        <div class="icon" ${iconStyle}>
          ${iconMarkup}
        </div>
        <div class="content">
          <div class="title">${link.name}</div>
          ${link.description ? `<div class="description">${link.description}</div>` : ''}
        </div>
      `;

      linksEl.appendChild(linkEl);
    });
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initialize());
    } else {
      this.initialize();
    }
  }

  /**
   * Renders about section with paragraphs and separator support
   */
  renderAbout() {
    const aboutEl = document.getElementById('about');
    if (!aboutEl || !this.config.about) return;
    
    const paragraphsHtml = this.config.about.paragraphs.map(p => {
      // Convert separator to HR element
      if (p === "━━━") {
        return `<hr>`;
      }
      // ##で始まる行は太字タイトルに
      if (/^##/.test(p)) {
        return `<p><strong>${p.replace(/^##+/, '').trim()}</strong></p>`;
      }
      return `<p>${p}</p>`;
    }).join('');
    
    aboutEl.innerHTML = `
      <h2>${this.config.about.title}</h2>
      ${paragraphsHtml}
    `;
  }

  /**
   * Main initialization - renders all sections and loads dependencies
   */
  initialize() {
    this.renderProfile();
    this.renderLinks();
    this.renderAbout();
    this.loadIconify();
    // Delay ShareManager init to ensure DOM is ready
    setTimeout(() => this.initShareManager(), 100);
  }

  initShareManager() {
    const shareManager = new ShareManager(this.config);
    shareManager.init();
  }

  /**
   * Dynamically loads Iconify library for icon rendering
   */
  loadIconify() {
    if (!document.querySelector('script[src*="iconify"]')) {
      const script = document.createElement('script');
      script.src = 'https://code.iconify.design/3/3.1.1/iconify.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }
}

// Initialize app when ready
const app = new LinkPageApp();
app.init();