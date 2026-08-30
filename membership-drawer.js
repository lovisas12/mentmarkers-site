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
  const turnstileSiteKey = '0x4AAAAAAEiVYPBxlpsupaun';
  let turnstileReady = Boolean(window.turnstile);
  let turnstileWidgetId = null;
  let turnstileResolve = null;
  let turnstileReject = null;
  let turnstileTimeout = null;
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
      renderTurnstile();
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
        error: 'Something went wrong. Please try again in a moment.',
        rateLimited: 'Too many attempts. Please wait 15 minutes and try again.'
      }
    : {
        sending: 'Lägger till dig…',
        success: 'Tack! Din e-postadress står nu på väntelistan.',
        error: 'Något gick fel. Försök igen om en liten stund.',
        rateLimited: 'För många försök. Vänta 15 minuter och försök igen.'
      };

  const finishTurnstileRequest = (method, value) => {
    window.clearTimeout(turnstileTimeout);
    turnstileTimeout = null;
    const handler = method === 'resolve' ? turnstileResolve : turnstileReject;
    turnstileResolve = null;
    turnstileReject = null;
    if (handler) handler(value);
  };

  const renderTurnstile = () => {
    if (!form || drawer.hidden || !turnstileReady || !window.turnstile || turnstileWidgetId !== null) return;
    const container = form.querySelector('#waitlist-turnstile');
    if (!container) return;

    turnstileWidgetId = window.turnstile.render(container, {
      sitekey: turnstileSiteKey,
      execution: 'execute',
      appearance: 'interaction-only',
      theme: 'light',
      callback: (token) => finishTurnstileRequest('resolve', token),
      'error-callback': () => finishTurnstileRequest('reject', new Error('Turnstile verification failed')),
      'expired-callback': () => finishTurnstileRequest('reject', new Error('Turnstile token expired')),
      'timeout-callback': () => finishTurnstileRequest('reject', new Error('Turnstile challenge timed out'))
    });
  };

  window.mentWaitlistTurnstileReady = () => {
    turnstileReady = true;
    renderTurnstile();
  };

  const requestTurnstileToken = () => new Promise((resolve, reject) => {
    renderTurnstile();
    if (!window.turnstile || turnstileWidgetId === null) {
      reject(new Error('Turnstile is not ready'));
      return;
    }

    turnstileResolve = resolve;
    turnstileReject = reject;
    turnstileTimeout = window.setTimeout(
      () => finishTurnstileRequest('reject', new Error('Turnstile verification timed out')),
      20000
    );
    window.turnstile.execute(turnstileWidgetId);
  });

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
        const turnstileToken = await requestTurnstileToken();
        const response = await fetch(`${supabaseUrl}/functions/v1/join-waitlist`, {
          method: 'POST',
          headers: {
            apikey: supabasePublishableKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: emailInput.value.trim().toLowerCase(),
            language: document.documentElement.lang === 'en' ? 'en' : 'sv',
            turnstileToken
          })
        });

        if (response.status === 429) {
          if (status) {
            status.textContent = copy.rateLimited;
            status.className = 'membership-form__status is-error';
            status.hidden = false;
          }
          return;
        }

        if (!response.ok) throw new Error(`Waitlist request failed: ${response.status}`);

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
        if (window.turnstile && turnstileWidgetId !== null) window.turnstile.reset(turnstileWidgetId);
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
