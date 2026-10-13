document.addEventListener('DOMContentLoaded', () => {
  // 1. Active Navigation Item Detection
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.site-header nav a');
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href').split('/').pop();
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // 2. Accessible Mobile Navigation Toggle
  const header = document.querySelector('.site-header');
  if (header && !header.querySelector('.nav-toggle')) {
    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-label', 'Menu di navigazione');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    header.appendChild(toggle);

    const nav = header.querySelector('nav');
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('nav-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on navigation click or escape
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('nav-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
        nav.classList.remove('nav-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // 3. Native Lightbox Component
  let lightbox = document.getElementById('lightbox-dialog');
  if (!lightbox) {
    lightbox = document.createElement('dialog');
    lightbox.id = 'lightbox-dialog';
    lightbox.className = 'lightbox-dialog';
    lightbox.innerHTML = `
      <div class="lightbox-box">
        <button class="lightbox-close" aria-label="Chiudi visualizzatore" type="button">×</button>
        <img class="lightbox-img" src="" alt="">
        <p class="lightbox-caption"></p>
      </div>
    `;
    document.body.appendChild(lightbox);

    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', () => lightbox.close());

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.close();
      }
    });
  }

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');

  // Attach lightbox to all photo links
  const photoSelectors = '.gallery-grid a, .story-photo, .moment-photo, .timeline-photo';
  document.querySelectorAll(photoSelectors).forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const img = link.querySelector('img');
      const caption = img ? img.getAttribute('alt') || '' : '';

      lightboxImg.src = href;
      lightboxImg.alt = caption;
      lightboxCaption.textContent = caption;
      lightbox.showModal();
    });
  });
});