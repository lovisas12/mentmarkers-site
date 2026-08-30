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
    'nav.market': 'Ment Market',
    'nav.measure': 'Your longevity',
    'nav.how': 'How Ment works',
    'nav.about': 'About',
    'lang.label': 'Language',

    /* — index.html — */
    'hero.eyebrow': 'Longevity intelligence for women',
    'hero.title': 'Ageing is inevitable. How you age is not.',
    'hero.title1': 'Ageing is inevitable.',
    'hero.title2': 'How you age is not.',
    'hero.aboutCta': 'About Ment',
    'hero.caption': 'Access curated testing, products, treatments and longevity interventions through MENT.',
    'hero.body': "Hormones, recovery and your cells' capacity to repair change long before you feel older. Ment connects the signals so you can act earlier.",
    'hero.cta': 'Get early access',
    'hero.secondaryCta': 'Discover your longevity',
    'hero.note': 'Built for the female body. Founded in Sweden.',

    'platform.eyebrow': 'MENT HEALTH TWIN',
    'platform.title': 'Not more data. Better decisions.',
    'platform.body': 'Your personal health twin connects blood work, hormones, cycle, wearables and lifestyle. See what is changing, why it matters and what to do next.',
    'platform.score': 'YOUR MENT SIGNAL',
    'platform.trend': 'YOUR TREND',
    'platform.trendValue': 'Stronger than 90 days ago',
    'platform.action': 'NEXT BEST STEP',
    'platform.actionValue': 'Stabilise recovery',
    'platform.actionBody': 'Your HRV drops during the late luteal phase. Adjust training load and sleep window for 7 days.',
    'platform.step1': 'We bring all your health data together, with access to tailored health testing through our partner clinics.',
    'platform.step2': 'Your digital twin is created — a living representation of your body that evolves with your data.',
    'platform.step3': 'We turn your data into personalised guidance. Ment helps you understand what to focus on next to reach your health goals.',
    'platform.step4': 'We give you the data. You act on it.',
    'platform.outro': 'Access curated testing, products, treatments and longevity interventions through MENT.',

    'app.eyebrow': 'THE MENT APP',
    'app.title': 'A digital mirror of your biological health.',
    'app.launching': 'Launching soon.',

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

    'membership.eyebrow': 'EARLY ACCESS',
    'membership.title': 'Be among the first.',
    'membership.intro': 'Ment will initially open to people living in Stockholm. Join the waitlist and we will let you know when the time comes.',
    'membership.stockholm': 'FIRST LAUNCH · STOCKHOLM ONLY',
    'membership.entry.eyebrow': 'YOUR PLACE IN MENT',
    'membership.entry.title1': 'ARE YOU ON',
    'membership.entry.title2': 'THE WAITLIST?',
    'membership.entry.cta': 'JOIN THE WAITLIST',
    'membership.drawer.title': 'Join the waitlist',
    'membership.drawer.close': 'Close',
    'membership.waitlist.badge': 'FREE WAITLIST',
    'membership.waitlist.title': 'Be among the first.',
    'membership.waitlist.lead': 'Leave your email address and we will let you know when Ment opens.',
    'membership.waitlist.cta': 'Join the waitlist',
    'waitlist.label': 'Email address',
    'waitlist.placeholder': 'Your email address',

    'faq.eyebrow': 'FREQUENTLY ASKED QUESTIONS',
    'faq.title': 'The essentials, without the fine print.',
    'faq.waitlist.q': 'What happens when I join the waitlist?',
    'faq.waitlist.a': 'You will receive launch updates and we will contact you when Ment becomes available to you.',
    'faq.location.q': 'Where will Ment launch first?',
    'faq.location.a': 'The first launch will take place in Stockholm. More locations will follow.',
    'faq.medical.q': 'Does Ment replace medical care?',
    'faq.medical.a': 'No. Ment provides health insights and guidance but does not diagnose or replace contact with a licensed healthcare professional.',

    'finalCta.eyebrow': 'EARLY ACCESS · STOCKHOLM',
    'finalCta.title': 'Begin before you feel it.',
    'finalCta.body': 'Join the waitlist and we will let you know when Ment opens.',
    'finalCta.button': 'Join the waitlist',

    'market.eyebrow': 'THE MENT MARKET',
    'market.curated': 'Curated for your body.',
    'market.launching': 'Launching soon.',
    'market.description': 'A curated marketplace for the next generation of longevity.',
    'market.categories': 'Peptides. Diagnostics. Supplements. Treatments. Recovery. Skincare.',
    'market.categoriesLabel': 'Categories',
    'market.category1': 'Peptides',
    'market.category2': 'Diagnostics',
    'market.category3': 'Supplements',
    'market.category4': 'Treatments',
    'market.category5': 'Recovery',
    'market.category6': 'Skincare',
    'market.cta': 'Join the waitlist',

    'footer.disclaimer': 'Provides health insights but does not diagnose or replace medical care.',

    /* — om-oss.html — */
    'about.eyebrow': 'ABOUT MENT MARKERS',
    'about.title': 'We are building a new way to understand health.',
    'about.body1': "Ment Markers is a preventive health concept that combines AI with health data. The goal is to make the body's signals comprehensible and help people make better decisions for their long-term health.",
    'about.body2': 'Wherever you start, Ment Markers gives you the intelligence to understand your longevity and the confidence to own it. Founded by women. Built in Sweden.',
    'about.stockholm': 'FOUNDED IN STOCKHOLM',
    'founders.label': 'OUR FOUNDERS',
    'founders.title': 'The people behind Ment.',
    'founders.sara.role': 'CO-FOUNDER, SCIENCE',
    'founders.lovisa.role': 'CO-FOUNDER, PRODUCT',
    'values.title': 'What we hold to',
    'values.eyebrow': 'OUR FOUNDATION',
    'value1.title': 'Clarity over complexity',
    'value1.body': 'We turn clinical data such as genetics, blood work and biometrics into insights you can actually understand, not raw numbers that need a medical degree.',
    'value2.title': 'Own your data, own your health',
    'value2.body': 'You own your health information and decide how deep to go, from a quick overview to your complete genetic picture.',
    'value3.title': 'Evidence, not guesswork',
    'value3.body': 'Every insight is built on clinically grounded data and real science, not trends or wellness fads.',
    'value4.title': 'Progress you can measure',
    'value4.body': 'We focus on long term, trackable change: biological age, risk markers and real trends over time.',
    'aboutWaitlist.title': 'Stop guessing about your own body.',
    'waitlist.body': 'We are launching soon. Join the waitlist and be among the first to hear from us.',
    'waitlist.submit': 'Join'
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
     3. Header — transparent in the hero, glass after scrolling
     ================================================================= */

  var header = document.getElementById('site-header');
  if (header) {
    var lastY = window.scrollY;
    var ticking = false;

    var onScroll = function () {
      var y = window.scrollY;
      if (y < 24) {
        header.classList.remove('is-stuck', 'is-hidden');
      } else if (header.classList.contains('ment-header')) {
        header.classList.add('is-stuck');
        header.classList.remove('is-hidden');
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
    onScroll();
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
