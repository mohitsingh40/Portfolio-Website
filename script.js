(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.primary-nav');
  const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const filterButtons = [...document.querySelectorAll('.filter-button')];
  const projectCards = [...document.querySelectorAll('.project-card')];
  const emptyFilter = document.getElementById('empty-filter');
  const yearElement = document.getElementById('current-year');

  if (yearElement) yearElement.textContent = new Date().getFullYear();

  // Add a subtle shadow after the visitor scrolls past the top of the page.
  const updateHeader = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Mobile navigation: close after choosing a destination or pressing Escape.
  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
    navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
      navigation.classList.toggle('is-open', !isOpen);
      document.body.classList.toggle('menu-open', !isOpen);
    });
    navLinks.forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  // Highlight the navigation link for the section currently in view.
  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', isCurrent);
        });
      });
    }, { rootMargin: '-32% 0px -58% 0px', threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Reveal sections as they enter the viewport, with a no-observer fallback.
  const revealItems = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Filter project cards by the categories represented in their data-category attribute.
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter || 'all';
      let visibleCount = 0;

      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });

      projectCards.forEach((card) => {
        const categories = (card.dataset.category || '').split(/\s+/);
        const shouldShow = filter === 'all' || categories.includes(filter);
        card.classList.toggle('is-hidden', !shouldShow);
        if (shouldShow) visibleCount += 1;
      });

      if (emptyFilter) emptyFilter.hidden = visibleCount > 0;
    });
  });
})();
