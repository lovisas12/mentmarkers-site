(() => {
  const drawer = document.querySelector('#membership-drawer');
  const openers = [...document.querySelectorAll('[data-membership-open]')];

  if (!drawer || !openers.length) return;

  const panel = drawer.querySelector('.membership-drawer__panel');
  const closers = [...drawer.querySelectorAll('[data-membership-close]')];
  let lastFocused = null;
  let closeTimer = null;

  const focusableSelector = 'button:not([disabled]), input:not([disabled]), a[href], select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const openDrawer = (opener) => {
    window.clearTimeout(closeTimer);
    lastFocused = opener;
    drawer.hidden = false;
    document.body.classList.add('drawer-open');
    opener.setAttribute('aria-expanded', 'true');

    requestAnimationFrame(() => {
      drawer.classList.add('is-open');
      drawer.querySelector('.membership-drawer__close')?.focus();
    });
  };

  const closeDrawer = () => {
    if (drawer.hidden) return;
    drawer.classList.remove('is-open');
    document.body.classList.remove('drawer-open');
    openers.forEach((opener) => opener.setAttribute('aria-expanded', 'false'));

    closeTimer = window.setTimeout(() => {
      drawer.hidden = true;
      lastFocused?.focus();
    }, 470);
  };

  openers.forEach((opener) => opener.addEventListener('click', () => openDrawer(opener)));
  closers.forEach((closer) => closer.addEventListener('click', closeDrawer));

  if (new URLSearchParams(window.location.search).get('waitlist') === 'open') {
    requestAnimationFrame(() => openDrawer(openers[0]));
  }

  document.addEventListener('keydown', (event) => {
    if (drawer.hidden) return;

    if (event.key === 'Escape') {
      closeDrawer();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = [...panel.querySelectorAll(focusableSelector)];
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
