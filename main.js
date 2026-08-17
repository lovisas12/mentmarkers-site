/* ===================================================================
   Ment Markers — shared page behaviour (index.html + om-oss.html)

   Every module below no-ops when its markup is absent, so both pages
   load the same file.
   =================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =================================================================
     1. Language

     Swedish lives in the HTML — it is the default, and what crawlers and
     no-JS visitors get. This dictionary holds the English side only,
     keyed by data-i18n; switching back to Swedish restores the text
     captured on load.

     The founder bios on om-oss.html are deliberately absent here: they
     are verbatim author copy and stay Swedish in both languages.
     ================================================================= */

  var EN = {
    'skip': 'Skip to content',
    'nav.label': 'Main menu',
    'nav.platform': 'The platform',
    'nav.measure': 'What we measure',
    'nav.how': 'How it works',
    'nav.about': 'About',
    'lang.label': 'Language',

    /* — index.html — */
    'hero.eyebrow': 'Longevity intelligence for women',
    'hero.title': "Your labs are normal. You're still exhausted.",
    'hero.body': 'Fatigue, PMS and brain fog have an explanation. We gather blood work, wearables, hormones, cycle and lifestyle in one place and read them together.',
    'hero.cta': 'Join the waitlist',
    'hero.note': 'Founding members get access first.',

    'badge.tired': 'Tired even though you sleep?',
    'badge.bloated': 'Bloated for no reason?',
    'badge.cycle': 'A cycle that has changed?',
    'badge.ferritin': 'Ferritin 18 µg/L',
    'badge.hrv': 'HRV 41 ms',
    'badge.vitd': 'Vitamin D 43 nmol/L',
    'badge.sleep': 'Sleep 6 h 12 min',

    'mapped.title': 'Your body, mapped.',
    'mapped.body': "A digital health twin that turns your body's signals into the next best step, and follows them over time.",

    'measure.eyebrow': 'WHAT WE MEASURE',
    'measure.tablist': 'Measurement categories',

    'steps.eyebrow': 'HOW IT WORKS',
    'steps.title': 'From data to decision',
    'step1.title': 'Gather',
    'step1.body': 'Book a time at a clinic and do your tests there. Then connect your ring, watch, Apple or Google Health, or upload results you already have.',
    'step2.title': 'Understand',
    'step2.body': 'Every signal is read together with the others, never in isolation, and interpreted specifically for female physiology: cycle, hormones and the reference values that actually apply to you. Built into your health twin.',
    'step3.title': 'Act',
    'step3.body': 'The Ment Mentor gives you the next best step, one at a time, based on your own data.',

    'founding.eyebrow': 'FOUNDING MEMBERS',
    'founding.title': 'Pre-book your first test.',
    'founding.body': 'We are opening 30 places for women who feel that something is wrong but cannot quite put their finger on what.',
    'offer.qualifier': 'one-time, pre-booking of your first test',
    'offer.item1': 'Blood panel at a clinic',
    'offer.item2': 'Hormone and cycle panel',
    'offer.item3': 'First in line at launch',
    'offer.cta': 'Pre-book for 1 495 kr',
    'offer.fineprint': 'No payment is taken now. Join the waitlist and we will be in touch about a time and payment when we open.',

    'waitlist.title': 'Your body has been saying it for a long time.',
    'waitlist.body': 'We launch soon. Join the waitlist and we will reach out to you first.',
    'waitlist.label': 'Email address',
    'waitlist.placeholder': 'Your email address',
    'waitlist.submit': 'Join →',

    'footer.disclaimer': 'Does not diagnose, does not replace medical care.',

    /* — om-oss.html — */
    'about.eyebrow': 'ABOUT MENT MARKERS',
    'about.title': 'We are building a new way to understand health.',
    'about.body1': "Ment Markers is a preventive health concept that combines AI with health data. The goal is to make the body's signals comprehensible and help people make better decisions for their long-term health.",
    'about.body2': 'Wherever you start, Ment Markers gives you the intelligence to understand your longevity and the confidence to own it. Founded by women. Built in Sweden.',
    'founders.label': 'OUR FOUNDERS',
    'founders.sara.role': 'CO-FOUNDER, SCIENCE',
    'founders.lovisa.role': 'CO-FOUNDER, PRODUCT',
    'values.title': 'What we hold to',
    'value1.title': 'Clarity over complexity',
    'value1.body': 'We turn clinical data such as genetics, blood work and biometrics into insights you can actually understand, not raw numbers that need a medical degree.',
    'value2.title': 'Own your data, own your health',
    'value2.body': 'You own your health information and decide how deep to go, from a quick overview to your complete genetic picture.',
    'value3.title': 'Evidence, not guesswork',
    'value3.body': 'Every insight is built on clinically grounded data and real science, not trends or wellness fads.',
    'value4.title': 'Progress you can measure',
    'value4.body': 'We focus on long term, trackable change: biological age, risk markers and real trends over time.',
    'aboutWaitlist.title': 'Stop guessing about your own body.'
  };

  /* Categories are rendered from data, so they carry both languages. */
  var CATEGORIES = [
    {
      sv: {
        name: 'Hormonell hälsa',
        source: 'Blodprov — de hormoner som styr energi, humör och cykel.',
        markers: ['AMH', 'Östradiol', 'Progesteron', 'LH / FSH', 'Prolaktin', 'SHBG', 'DHEA-S', 'Testosteron, totalt & fritt', 'Kortisol']
      },
      en: {
        name: 'Hormonal health',
        source: 'Blood work — the hormones that govern energy, mood and cycle.',
        markers: ['AMH', 'Estradiol', 'Progesterone', 'LH / FSH', 'Prolactin', 'SHBG', 'DHEA-S', 'Testosterone, total & free', 'Cortisol']
      }
    },
    {
      sv: {
        name: 'Sköldkörtel',
        source: 'Blodprov — hela panelen, inte bara TSH.',
        markers: ['Fullständig sköldkörtelpanel', 'TPO-antikroppar']
      },
      en: {
        name: 'Thyroid',
        source: 'Blood work — the full panel, not just TSH.',
        markers: ['Full thyroid panel', 'TPO antibodies']
      }
    },
    {
      sv: {
        name: 'Inflammation',
        source: 'Blodprov — låggradig inflammation över tid.',
        markers: ['hs-CRP']
      },
      en: {
        name: 'Inflammation',
        source: 'Blood work — low-grade inflammation over time.',
        markers: ['hs-CRP']
      }
    },
    {
      sv: {
        name: 'Prestation & återhämtning',
        source: 'Blodprov och wearables, lästa tillsammans.',
        markers: ['IGF-1', 'Kreatinkinas', 'LDH', 'VO₂max', 'HRV', 'Sömn', 'Återhämtning']
      },
      en: {
        name: 'Performance & recovery',
        source: 'Blood work and wearables, read together.',
        markers: ['IGF-1', 'Creatine kinase', 'LDH', 'VO₂max', 'HRV', 'Sleep', 'Recovery']
      }
    },
    {
      sv: {
        name: 'Näringsstatus',
        source: 'Blodprov — brister som märks långt innan de syns.',
        markers: ['Järn & ferritin', 'D-vitamin', 'Biotin', 'Zink', 'Magnesium', 'Elektrolyter']
      },
      en: {
        name: 'Nutrient status',
        source: 'Blood work — deficiencies you feel long before they show.',
        markers: ['Iron & ferritin', 'Vitamin D', 'Biotin', 'Zinc', 'Magnesium', 'Electrolytes']
      }
    }
  ];

  var lang = 'sv';

  /* The translatable text of a node is its leading text node — anything
     after it (e.g. the CTA's arrow badge) is decoration and stays put. */
  function textNodeOf(el) {
    return el.firstChild && el.firstChild.nodeType === Node.TEXT_NODE ? el.firstChild : null;
  }

  /* Snapshot the Swedish source so switching back is lossless. */
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var node = textNodeOf(el);
    el.dataset.svSnapshot = (node ? node.nodeValue : el.textContent).trim();
  });

  var placeholderSnapshot = new Map();
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
    placeholderSnapshot.set(el, el.getAttribute('placeholder') || '');
  });
  var ariaSnapshot = new Map();
  document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
    ariaSnapshot.set(el, el.getAttribute('aria-label') || '');
  });

  function applyLang(next) {
    lang = next;
    document.documentElement.lang = next;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var value = next === 'en' ? EN[el.dataset.i18n] : el.dataset.svSnapshot;
      if (value == null) return;
      var node = textNodeOf(el);
      if (node) node.nodeValue = value;
      else el.textContent = value;
    });

    placeholderSnapshot.forEach(function (sv, el) {
      var key = el.dataset.i18nPlaceholder;
      el.setAttribute('placeholder', next === 'en' && EN[key] ? EN[key] : sv);
    });
    ariaSnapshot.forEach(function (sv, el) {
      var key = el.dataset.i18nAriaLabel;
      el.setAttribute('aria-label', next === 'en' && EN[key] ? EN[key] : sv);
    });

    renderCategories();

    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === next));
    });

    try { localStorage.setItem('mm-lang', next); } catch (e) { /* private mode */ }
  }

  document.querySelectorAll('.lang-switch button').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.dataset.lang); });
  });

  /* =================================================================
     2. What we measure — category tabs (index.html only)
     ================================================================= */

  var activeCat = 0;
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.measure__tabs [role="tab"]'));
  var sourceEl = document.getElementById('measure-source');
  var markersEl = document.getElementById('measure-markers');
  var panelEl = document.getElementById('panel-measure');

  function renderCategories() {
    if (!tabs.length || !sourceEl || !markersEl) return;

    tabs.forEach(function (tab, i) {
      tab.textContent = CATEGORIES[i][lang].name;
      var selected = i === activeCat;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    var data = CATEGORIES[activeCat][lang];
    sourceEl.textContent = data.source;
    markersEl.textContent = '';
    data.markers.forEach(function (m) {
      var li = document.createElement('li');
      li.className = 'chip';
      li.textContent = m;
      markersEl.appendChild(li);
    });
    if (panelEl) panelEl.setAttribute('aria-labelledby', tabs[activeCat].id);
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      activeCat = i;
      renderCategories();
    });
    tab.addEventListener('keydown', function (e) {
      var dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1
              : e.key === 'ArrowUp'   || e.key === 'ArrowLeft'  ? -1 : 0;
      if (!dir && e.key !== 'Home' && e.key !== 'End') return;
      e.preventDefault();
      activeCat = e.key === 'Home' ? 0
                : e.key === 'End'  ? tabs.length - 1
                : (i + dir + tabs.length) % tabs.length;
      renderCategories();
      tabs[activeCat].focus();
    });
  });

  /* =================================================================
     3. Header — hide on scroll down, show on scroll up
     ================================================================= */

  var header = document.getElementById('site-header');
  if (header) {
    var lastY = window.scrollY;
    var ticking = false;

    var onScroll = function () {
      var y = window.scrollY;
      if (y < 60) {
        header.classList.remove('is-stuck', 'is-hidden');
      } else {
        header.classList.add('is-stuck');
        header.classList.toggle('is-hidden', y > lastY);
      }
      lastY = y;
      ticking = false;
    };

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }, { passive: true });
  }

  /* =================================================================
     4. Floating badges — staggered entrance, once each (index.html only)
     ================================================================= */

  var badges = Array.prototype.slice.call(document.querySelectorAll('.badge'));

  if (badges.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      badges.forEach(function (b) { b.classList.add('is-in'); });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var i = badges.indexOf(entry.target);
          setTimeout(function () { entry.target.classList.add('is-in'); }, Math.max(0, i) * 110);
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
      badges.forEach(function (b) { observer.observe(b); });
    }
  }

  /* =================================================================
     5. Boot

     Note: the waitlist form posts natively to FormSubmit — no JS is
     involved, so it keeps working if this script fails to load.
     ================================================================= */

  var stored = null;
  try { stored = localStorage.getItem('mm-lang'); } catch (e) { /* private mode */ }
  var initial = stored || ((navigator.language || 'sv').toLowerCase().indexOf('sv') === 0 ? 'sv' : 'en');
  applyLang(initial);
})();
