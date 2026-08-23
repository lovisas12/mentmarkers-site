(function () {
  'use strict';

  var canvas = document.getElementById('ment-avatar-canvas');
  var wrap = document.querySelector('.avatar-canvas-wrap');
  var section = document.querySelector('.platform--avatar');
  if (!canvas || !wrap || !section) return;

  var ctx = canvas.getContext('2d');
  var figure = new Image();
  var logo = new Image();
  var dots = [];
  var logoReady = false;
  var figureReady = false;
  var phase = 'hold';
  var phaseStarted = performance.now() / 1000;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raf = 0;
  var cssWidth = 0;
  var cssHeight = 0;
  var sectionHeight = 0;
  var sectionOffsetY = 0;
  var dpr = 1;
  var inView = false;
  var stepElements = Array.prototype.slice.call(section.querySelectorAll('.avatar-step'));

  if (!reducedMotion) section.classList.add('avatar-reveal-ready');

  var settings = {
    density: 250,
    zoom: 1.33,
    alignX: 0.72,
    shiftY: 0.035,
    spread: 0.82,
    spreadX: 2.05,
    logoSize: 0.38,
    logoLift: 0.075,
    speed: 0.86,
    tint: '#3f484e'
  };

  function randomFactory(seed) {
    return function () {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
  }

  function smootherstep(value) {
    value = Math.max(0, Math.min(1, value));
    return value * value * value * (value * (value * 6 - 15) + 10);
  }

  function buildFigure() {
    var width = Math.min(1200, figure.naturalWidth);
    var height = Math.round(width * figure.naturalHeight / figure.naturalWidth);
    var source = document.createElement('canvas');
    source.width = width;
    source.height = height;
    var sourceCtx = source.getContext('2d', { willReadFrequently: true });
    sourceCtx.drawImage(figure, 0, 0, width, height);
    var pixels = sourceCtx.getImageData(0, 0, width, height).data;
    var ink = new Float32Array(width * height);
    var top = -1;
    var bottom = 0;
    var left = width;
    var right = 0;
    var x;
    var y;

    for (y = 0; y < height; y += 1) {
      for (x = 0; x < width; x += 1) {
        var pixelIndex = y * width + x;
        var rgbaIndex = pixelIndex * 4;
        var luminance = (pixels[rgbaIndex] * .299 + pixels[rgbaIndex + 1] * .587 + pixels[rgbaIndex + 2] * .114) / 255;
        var value = Math.max(0, 1 - luminance) * (pixels[rgbaIndex + 3] / 255);
        ink[pixelIndex] = value;
        if (value > .1) {
          if (top < 0) top = y;
          bottom = y;
          if (x < left) left = x;
          if (x > right) right = x;
        }
      }
    }

    var figureHeight = Math.max(1, bottom - top);
    var centerX = (left + right) / 2;
    var step = figureHeight / settings.density;
    var half = step / 2;
    var random = randomFactory(20250819);
    dots = [];

    for (var row = 0; row * step + top <= bottom; row += 1) {
      var cellY = top + row * step + half;
      var offset = (row % 2) * half;
      for (var cellX = left + offset; cellX <= right; cellX += step) {
        var x0 = Math.max(0, Math.round(cellX - half));
        var x1 = Math.min(width - 1, Math.round(cellX + half));
        var y0 = Math.max(0, Math.round(cellY - half));
        var y1 = Math.min(height - 1, Math.round(cellY + half));
        var sum = 0;
        var count = 0;
        var massX = 0;
        var massY = 0;

        for (y = y0; y <= y1; y += 1) {
          for (x = x0; x <= x1; x += 1) {
            var cellInk = ink[y * width + x];
            sum += cellInk;
            count += 1;
            massX += x * cellInk;
            massY += y * cellInk;
          }
        }

        var coverage = count ? sum / count : 0;
        if (coverage < .05) continue;
        var sampledX = sum ? massX / sum : cellX;
        var sampledY = sum ? massY / sum : cellY;
        sampledX = cellX + Math.max(-half, Math.min(half, sampledX - cellX)) * .85;
        sampledY = cellY + Math.max(-half, Math.min(half, sampledY - cellY)) * .85;
        var homeX = (sampledX - centerX) / figureHeight;
        var homeY = (sampledY - top) / figureHeight - .5;
        var angle = Math.atan2(homeY, homeX) + (random() - .5) * 1.5 + Math.PI / 2;
        var distance = .16 + random() * random() * .4;

        dots.push({
          hx: homeX,
          hy: homeY,
          sx: homeX * .35 + Math.cos(angle) * distance,
          sy: homeY * .35 + Math.sin(angle) * distance * .8,
          orbit: .01 + random() * .026,
          orbitPhase: random() * Math.PI * 2,
          orbitSpeed: .5 + random() * .9,
          delay: Math.max(0, Math.min(1, (.5 - homeY) * .55 + random() * .42)),
          breathPhase: random() * Math.PI * 2,
          radius: Math.max(step * .18, step * .74 * Math.sqrt(Math.min(1, coverage * 1.25))) / figureHeight,
          alpha: Math.min(1, .88 + coverage * 1.2)
        });
      }
    }

    figureReady = true;
    if (logo.complete && logo.naturalWidth) buildLogo();
    resize();
    showRestingFigure();
    if (inView) startAnimation();
  }

  function buildLogo() {
    if (!dots.length) return;
    var width = 420;
    var height = Math.max(1, Math.round(width * logo.naturalHeight / logo.naturalWidth));
    var source = document.createElement('canvas');
    source.width = width;
    source.height = height;
    var sourceCtx = source.getContext('2d', { willReadFrequently: true });
    sourceCtx.drawImage(logo, 0, 0, width, height);
    var pixels = sourceCtx.getImageData(0, 0, width, height).data;
    var points = [];

    for (var y = 0; y < height; y += 2) {
      for (var x = 0; x < width; x += 2) {
        var index = (y * width + x) * 4;
        var luminance = (pixels[index] * .299 + pixels[index + 1] * .587 + pixels[index + 2] * .114) / 255;
        if (pixels[index + 3] > 110 && luminance < .75) points.push([x, y]);
      }
    }
    if (!points.length) return;

    var scale = settings.logoSize / height;
    var normalized = points.map(function (point) {
      return [(point[0] - width / 2) * scale, (point[1] - height / 2) * scale - settings.shiftY - settings.logoLift];
    });
    var bodyOrder = dots.map(function (_, index) { return index; }).sort(function (a, b) {
      return Math.atan2(dots[a].hy, dots[a].hx) - Math.atan2(dots[b].hy, dots[b].hx);
    });
    var logoOrder = normalized.map(function (_, index) { return index; }).sort(function (a, b) {
      return Math.atan2(normalized[a][1], normalized[a][0]) - Math.atan2(normalized[b][1], normalized[b][0]);
    });
    var random = randomFactory(7717);

    bodyOrder.forEach(function (dotIndex, orderIndex) {
      var logoIndex = logoOrder[Math.min(logoOrder.length - 1, Math.floor(orderIndex / bodyOrder.length * logoOrder.length))];
      dots[dotIndex].lx = normalized[logoIndex][0] + (random() - .5) * .005;
      dots[dotIndex].ly = normalized[logoIndex][1] + (random() - .5) * .005;
      dots[dotIndex].logoDelay = random() * .35;
    });
    logoReady = true;
  }

  function resize() {
    var rect = wrap.getBoundingClientRect();
    var sectionRect = section.getBoundingClientRect();
    cssWidth = Math.max(1, rect.width);
    cssHeight = Math.max(1, rect.height);
    sectionHeight = Math.max(1, sectionRect.height);
    sectionOffsetY = sectionRect.top - rect.top;
    dpr = Math.min(1.5, window.devicePixelRatio || 1);
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    canvas.style.width = cssWidth + 'px';
    canvas.style.height = cssHeight + 'px';
  }

  function setPhase(next, time) {
    phase = next;
    phaseStarted = time;
  }

  function getDurations() {
    var speed = settings.speed;
    return {
      out: 3.8 / speed,
      loose: .25 / speed,
      form: 3.6 / speed,
      logo: .48 / speed,
      unform: 3.2 / speed,
      loose2: .2 / speed,
      in: 3.8 / speed,
      hold: .5 / speed
    };
  }

  function showRestingFigure() {
    if (!figureReady) return;
    var now = performance.now() / 1000;
    setPhase('hold', now);
    draw(now, getDurations());
  }

  function startAnimation() {
    if (!figureReady) return;
    if (raf) cancelAnimationFrame(raf);
    showRestingFigure();
    if (!reducedMotion) raf = requestAnimationFrame(loop);
  }

  function pauseAnimation() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    showRestingFigure();
  }

  function draw(time, durations) {
    if (!figureReady || !dots.length) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    var elapsed = time - phaseStarted;
    var progress = phase === 'out' ? Math.min(1, elapsed / durations.out)
      : phase === 'in' ? 1 - Math.min(1, elapsed / durations.in)
      : phase === 'hold' ? 0 : 1;
    var logoAmount = phase === 'form' ? smootherstep(elapsed / durations.form)
      : phase === 'logo' ? 1
      : phase === 'unform' ? 1 - smootherstep(elapsed / durations.unform) : 0;
    var figurePixelHeight = sectionHeight * settings.zoom;
    var centerX = cssWidth * settings.alignX;
    var centerY = sectionOffsetY + sectionHeight / 2 + figurePixelHeight * settings.shiftY;
    var drift = (.5 - settings.alignX) * cssWidth / figurePixelHeight;

    ctx.fillStyle = settings.tint;
    dots.forEach(function (dot) {
      var wave = Math.max(0, Math.min(1, (progress * 1.24 - dot.delay * .24) / (1 - dot.delay * .24 + .0001)));
      var eased = smootherstep(wave);
      var x = dot.hx;
      var y = dot.hy;

      if (eased > .0005) {
        x += (dot.sx * settings.spread * settings.spreadX - dot.hx) * eased;
        y += (dot.sy * settings.spread - dot.hy) * eased;
        x += drift * eased;
        var loose = eased * (1 - logoAmount);
        x += Math.cos(time * dot.orbitSpeed + dot.orbitPhase) * dot.orbit * loose;
        y += Math.sin(time * dot.orbitSpeed * .8 + dot.orbitPhase) * dot.orbit * loose;
      }

      if (logoAmount > .0005 && dot.lx !== undefined) {
        var logoWave = Math.max(0, Math.min(1, (logoAmount * 1.22 - dot.logoDelay * .6) / (1 - dot.logoDelay * .6 + .0001)));
        var logoEase = smootherstep(logoWave);
        x += (dot.lx - x) * logoEase;
        y += (dot.ly - y) * logoEase;
      }

      var breath = (1 - eased) * .004;
      y += Math.sin(time * .7 + dot.breathPhase * .15 + dot.hy * 2.2) * breath;
      x += Math.cos(time * .55 + dot.hy * 1.8) * breath * .6;

      var px = centerX + x * figurePixelHeight;
      var py = centerY + y * figurePixelHeight;
      var radius = Math.max(.72, dot.radius * figurePixelHeight * (1 + .22 * eased * (1 - logoAmount)));
      if (px + radius < 0 || px - radius > cssWidth || py + radius < 0 || py - radius > cssHeight) return;
      ctx.globalAlpha = dot.alpha * (1 - .22 * eased * (1 - logoAmount));
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function loop(frameTime) {
    if (!inView) {
      raf = 0;
      return;
    }
    var now = frameTime / 1000;
    var durations = getDurations();
    var elapsed = now - phaseStarted;

    if (!reducedMotion) {
      if (phase === 'hold' && elapsed > durations.hold) setPhase('out', now);
      else if (phase === 'out' && elapsed > durations.out) setPhase('loose', now);
      else if (phase === 'loose' && elapsed > durations.loose) setPhase(logoReady ? 'form' : 'in', now);
      else if (phase === 'form' && elapsed > durations.form) setPhase('logo', now);
      else if (phase === 'logo' && elapsed > durations.logo) setPhase('unform', now);
      else if (phase === 'unform' && elapsed > durations.unform) setPhase('loose2', now);
      else if (phase === 'loose2' && elapsed > durations.loose2) setPhase('in', now);
      else if (phase === 'in' && elapsed > durations.in) setPhase('hold', now);
    }

    draw(now, durations);
    if (!reducedMotion) raf = requestAnimationFrame(loop);
  }

  figure.onload = buildFigure;
  logo.onload = buildLogo;
  figure.src = 'assets/ment-avatar-source.webp';
  logo.src = 'assets/ment-logo.svg';
  window.addEventListener('resize', function () {
    resize();
    if (!inView) showRestingFigure();
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    if (!reducedMotion) {
      var stepObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          stepObserver.unobserve(entry.target);
        });
      }, { threshold: .28, rootMargin: '0px 0px -18% 0px' });
      stepElements.forEach(function (step) { stepObserver.observe(step); });
    }

    var visibilityObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.target !== section) return;
        if (entry.isIntersecting) {
          if (inView) return;
          inView = true;
          startAnimation();
        } else {
          inView = false;
          pauseAnimation();
        }
      });
    }, { threshold: .18 });
    visibilityObserver.observe(section);
  } else {
    stepElements.forEach(function (step) { step.classList.add('is-visible'); });
    inView = true;
    startAnimation();
  }
})();
