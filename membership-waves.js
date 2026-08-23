(function () {
  'use strict';

  var canvases = document.querySelectorAll('[data-ment-waves]');
  if (!canvases.length) return;

  Array.prototype.forEach.call(canvases, function (canvas) {

  var gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power'
  });
  if (!gl) return;

  var vertexSource = [
    'attribute vec2 a_position;',
    'void main() {',
    '  gl_Position = vec4(a_position, 0.0, 1.0);',
    '}'
  ].join('\n');

  var fragmentSource = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'uniform vec2 u_resolution;',
    'uniform float u_time;',
    'uniform vec3 u_colors[4];',
    '',
    'float hash21(vec2 p) {',
    '  p = fract(p * vec2(234.34, 435.345));',
    '  p += dot(p, p + 34.23);',
    '  return fract(p.x * p.y);',
    '}',
    'float grainHash(vec2 p) {',
    '  vec3 p3 = fract(vec3(p.xyx) * 0.1031);',
    '  p3 += dot(p3, p3.yzx + 33.33);',
    '  return fract((p3.x + p3.y) * p3.z);',
    '}',
    'float noise(vec2 p) {',
    '  vec2 i = floor(p);',
    '  vec2 f = fract(p);',
    '  vec2 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),',
    '    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), u.x), u.y);',
    '}',
    'float fbm(vec2 p) {',
    '  float v = 0.0;',
    '  float a = 0.5;',
    '  for (int i = 0; i < 5; i++) {',
    '    v += a * noise(p);',
    '    p = p * 2.03 + vec2(17.0, 9.2);',
    '    a *= 0.5;',
    '  }',
    '  return v;',
    '}',
    '',
    'vec3 srgbToLinear(vec3 c) {',
    '  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c));',
    '}',
    'vec3 linearToSrgb(vec3 c) {',
    '  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));',
    '}',
    'vec3 linToOklab(vec3 c) {',
    '  float l = 0.4122214708*c.r + 0.5363325363*c.g + 0.0514459929*c.b;',
    '  float m = 0.2119034982*c.r + 0.6806995451*c.g + 0.1073969566*c.b;',
    '  float s = 0.0883024619*c.r + 0.2817188376*c.g + 0.6299787005*c.b;',
    '  l = pow(max(l, 0.0), 1.0/3.0); m = pow(max(m, 0.0), 1.0/3.0); s = pow(max(s, 0.0), 1.0/3.0);',
    '  return vec3(0.2104542553*l + 0.7936177850*m - 0.0040720468*s,',
    '    1.9779984951*l - 2.4285922050*m + 0.4505937099*s,',
    '    0.0259040371*l + 0.7827717662*m - 0.8086757660*s);',
    '}',
    'vec3 oklabToLin(vec3 c) {',
    '  float l = c.x + 0.3963377774*c.y + 0.2158037573*c.z;',
    '  float m = c.x - 0.1055613458*c.y - 0.0638541728*c.z;',
    '  float s = c.x - 0.0894841775*c.y - 1.2914855480*c.z;',
    '  l=l*l*l; m=m*m*m; s=s*s*s;',
    '  return vec3(4.0767416621*l - 3.3077115913*m + 0.2309699292*s,',
    '    -1.2684380046*l + 2.6097574011*m - 0.3413193965*s,',
    '    -0.0041960863*l - 0.7034186147*m + 1.7076147010*s);',
    '}',
    'vec3 mixColour(vec3 a, vec3 b, float t) {',
    '  vec3 la = linToOklab(srgbToLinear(a));',
    '  vec3 lb = linToOklab(srgbToLinear(b));',
    '  return clamp(linearToSrgb(oklabToLin(mix(la, lb, t))), 0.0, 1.0);',
    '}',
    'vec3 palette(float x) {',
    '  float f = clamp(x, 0.0, 1.0) * 3.0;',
    '  vec3 c = mixColour(u_colors[0], u_colors[1], smoothstep(0.0, 1.0, clamp(f, 0.0, 1.0)));',
    '  c = mixColour(c, u_colors[2], smoothstep(0.0, 1.0, clamp(f - 1.0, 0.0, 1.0)));',
    '  c = mixColour(c, u_colors[3], smoothstep(0.0, 1.0, clamp(f - 2.0, 0.0, 1.0)));',
    '  return c;',
    '}',
    'void main() {',
    '  vec2 uv = gl_FragCoord.xy / u_resolution.xy;',
    '  vec2 p = (gl_FragCoord.xy - 0.5*u_resolution.xy) / min(u_resolution.x, u_resolution.y);',
    '  float cr = cos(3.37), sr = sin(3.37);',
    '  p = mat2(cr, -sr, sr, cr) * (p * 1.32);',
    '  p += 0.40 * vec2(sin(u_time * 0.31), cos(u_time * 0.23));',
    '  p += 0.01 * (vec2(fbm(p * 1.73 + 4.0), fbm(p * 1.73 + vec2(5.2, 1.3))) - 0.5);',
    '  float y = uv.y + sin(uv.x * 7.4 + u_time * 0.8) * 0.08',
    '    + (fbm(p * 2.0 + u_time * 0.1) - 0.5) * 0.294;',
    '  vec3 col = palette(y);',
    '  col = (col - 0.5) * 1.08 + 0.5;',
    '  float luma = dot(col, vec3(0.299, 0.587, 0.114));',
    '  col = mix(vec3(luma), col, 1.18);',
    '  col += (grainHash(gl_FragCoord.xy + vec2(4984.0)) - 0.5) * 0.025;',
    '  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);',
    '}'
  ].join('\n');

  function compile(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  var vertexShader = compile(gl.VERTEX_SHADER, vertexSource);
  var fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) return;

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

  gl.useProgram(program);
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var position = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  var resolution = gl.getUniformLocation(program, 'u_resolution');
  var time = gl.getUniformLocation(program, 'u_time');
  var colors = gl.getUniformLocation(program, 'u_colors[0]');
  gl.uniform3fv(colors, new Float32Array([
    0.094, 0.149, 0.204,
    0.275, 0.318, 0.373,
    0.722, 0.780, 0.800,
    0.953, 0.933, 0.906
  ]));

  var start = performance.now();
  var frame = 0;
  var inView = true;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    var height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  function draw(now) {
    resize();
    gl.uniform2f(resolution, canvas.width, canvas.height);
    gl.uniform1f(time, ((now - start) / 1000) * -0.67);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    frame = reduceMotion ? 0 : requestAnimationFrame(draw);
  }

  function handleVisibility() {
    if (document.hidden || !inView) {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    } else if (!frame && !reduceMotion) {
      start = performance.now();
      frame = requestAnimationFrame(draw);
    }
  }

  document.addEventListener('visibilitychange', handleVisibility);
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.target !== canvas) return;
        inView = entry.isIntersecting;
        handleVisibility();
      });
    }, { threshold: .02 });
    observer.observe(canvas);
  }
  if (reduceMotion) draw(performance.now());
  else frame = requestAnimationFrame(draw);
  });
}());
