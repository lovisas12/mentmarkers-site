(() => {
  const drawer = document.querySelector('#membership-drawer');
  const openers = [...document.querySelectorAll('[data-membership-open]')];

  if (!drawer || !openers.length) return;

  const panel = drawer.querySelector('.membership-drawer__panel');
  const closers = [...drawer.querySelectorAll('[data-membership-close]')];
  const form = drawer.querySelector('[data-waitlist-form]');
  const status = drawer.querySelector('[data-waitlist-status]');
  const supabaseUrl = 'https://ajmfkgxffoezbtzsyvcq.supabase.co';
  const supabasePublishableKey = 'sb_publishable_JyD7-tuVTRwrcxXeEty1hQ_kqhkZXIu';
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

  const getWaitlistCopy = () => document.documentElement.lang === 'en'
    ? {
        sending: 'Adding you…',
        success: 'Thank you! Your email has been added to the waitlist.',
        error: 'Something went wrong. Please try again in a moment.'
      }
    : {
        sending: 'Lägger till dig…',
        success: 'Tack! Din e-postadress står nu på väntelistan.',
        error: 'Något gick fel. Försök igen om en liten stund.'
      };

  const showWaitlistSuccess = () => {
    if (form) form.hidden = true;
    if (!status) return;
    status.textContent = getWaitlistCopy().success;
    status.className = 'membership-form__status is-success';
    status.hidden = false;
  };

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const emailInput = form.elements.email;
      const honeypot = form.elements.company;
      const submitButton = form.querySelector('button[type="submit"]');
      const copy = getWaitlistCopy();

      if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
      }

      if (honeypot && honeypot.value) {
        showWaitlistSuccess();
        return;
      }

      submitButton.disabled = true;
      if (status) {
        status.textContent = copy.sending;
        status.className = 'membership-form__status';
        status.hidden = false;
      }

      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/waitlist_signups`, {
          method: 'POST',
          headers: {
            apikey: supabasePublishableKey,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal'
          },
          body: JSON.stringify({
            email: emailInput.value.trim().toLowerCase(),
            source: 'website',
            language: document.documentElement.lang === 'en' ? 'en' : 'sv'
          })
        });

        if (!response.ok && response.status !== 409) throw new Error(`Waitlist request failed: ${response.status}`);

        form.reset();
        showWaitlistSuccess();
      } catch (error) {
        console.error('Waitlist submission failed', error);
        if (status) {
          status.textContent = copy.error;
          status.className = 'membership-form__status is-error';
          status.hidden = false;
        }
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  const waitlistState = new URLSearchParams(window.location.search).get('waitlist');

  if (waitlistState === 'open' || waitlistState === 'thanks') {
    requestAnimationFrame(() => {
      openDrawer(openers[0]);

      if (waitlistState !== 'thanks') return;
      showWaitlistSuccess();
      window.history.replaceState(null, '', window.location.pathname + '#vantelistan');
    });
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
