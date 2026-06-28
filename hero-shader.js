// Cursor-reactive WebGL backdrop for the hero.
// A domain-warped emerald flow field with metallic brass veins and a warm
// gold light that tracks the pointer and bends the flow toward it. Pure
// progressive enhancement: if WebGL is unavailable, the shader fails to
// compile, or the user prefers reduced motion, the canvas hides and the CSS
// gradient on .hero shows instead. Crawlers never depend on any of this.

(function () {
  const canvas = document.querySelector(".hero-shader");
  if (!canvas) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hide = () => { canvas.style.display = "none"; };
  if (reducedMotion.matches) { hide(); return; }

  const gl =
    canvas.getContext("webgl", { antialias: false, alpha: true, depth: false, premultipliedAlpha: false }) ||
    canvas.getContext("experimental-webgl");
  if (!gl) { hide(); return; }

  const VERT = `
    attribute vec2 p;
    void main() { gl_Position = vec4(p, 0.0, 1.0); }
  `;

  const FRAG = `
    precision highp float;
    uniform vec2 u_res;
    uniform float u_time;
    uniform vec2 u_mouse;

    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 perm = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                             dot(x12.zw, x12.zw)), 0.0);
      m = m*m; m = m*m;
      vec3 x = 2.0 * fract(perm * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    float fbm(vec2 p) {
      float s = 0.0, a = 0.5;
      for (int i = 0; i < 6; i++) {
        s += a * snoise(p);
        p = p * 2.03 + 11.5;
        a *= 0.5;
      }
      return s;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_res.xy;
      float aspect = u_res.x / u_res.y;
      vec2 p = uv;  p.x *= aspect;  p *= 1.32;
      vec2 mp = u_mouse; mp.x *= aspect; mp *= 1.32;
      float t = u_time * 0.06;

      // the cursor pulls the flow toward it (gravitational lensing)
      vec2 toM = mp - p;
      float dm = length(toM);
      vec2 pw = p + toM * (exp(-dm * 1.7) * 0.55);

      // layered domain warp
      vec2 q = vec2(fbm(pw + vec2(0.0, t)), fbm(pw + vec2(5.2, -t)));
      vec2 r = vec2(fbm(pw + 1.7 * q + vec2(1.7, 9.2) + 0.20 * t),
                    fbm(pw + 1.7 * q + vec2(8.3, 2.8) - 0.18 * t));
      float n = fbm(pw + 2.0 * r);
      float base = 0.5 + 0.5 * n;

      // sharpened ridges read as metallic veins
      float ridge = 1.0 - abs(2.0 * base - 1.0);
      ridge = pow(ridge, 2.4);

      vec3 ink   = vec3(0.012, 0.040, 0.030);
      vec3 deep  = vec3(0.024, 0.092, 0.067);
      vec3 emer  = vec3(0.055, 0.235, 0.152);
      vec3 mint  = vec3(0.135, 0.480, 0.305);
      vec3 brass = vec3(0.620, 0.360, 0.150);
      vec3 gold  = vec3(0.910, 0.640, 0.270);

      vec3 col = mix(ink, deep, smoothstep(0.12, 0.50, base));
      col = mix(col, emer, smoothstep(0.46, 0.82, base));
      col = mix(col, mint, smoothstep(0.78, 0.99, base) * 0.45);

      // brass catches the ridges
      col += brass * ridge * 0.42 * smoothstep(0.35, 0.95, base);

      // recede the ambient flow so the cursor light leads the composition
      col *= 0.78;

      // warm light pooled at the cursor: focused core + soft halo
      float core = exp(-dm * 4.2);
      float halo = exp(-dm * 1.7);
      col += gold * core * 1.15;
      col += brass * halo * 0.30;
      // brighten the emerald flow the light touches
      col += emer * exp(-dm * 2.1) * (0.35 + ridge * 0.7);

      // contrast + lift
      col = pow(col, vec3(0.92));
      col *= 1.07;

      // vignette
      vec2 vd = uv - 0.5;
      float vig = smoothstep(1.0, 0.22, dot(vd, vd) * 2.3);
      col *= mix(0.70, 1.0, vig);

      // settle the bottom toward ink to meet the .hero::after fade
      col = mix(ink, col, smoothstep(0.0, 0.15, uv.y));

      // fine grain
      float gr = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + u_time) * 43758.5453);
      col += (gr - 0.5) * 0.022;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { gl.deleteShader(sh); return null; }
    return sh;
  }

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) { hide(); return; }

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { hide(); return; }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, "u_res");
  const uTime = gl.getUniformLocation(prog, "u_time");
  const uMouse = gl.getUniformLocation(prog, "u_mouse");

  // pointer-tracked light, with smoothing + idle auto-orbit
  let targetX = 0.64, targetY = 0.6;
  let curX = 0.5, curY = 0.5;
  let lastMove = -1e9;

  window.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    if (r.width === 0) return;
    targetX = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    targetY = Math.min(1, Math.max(0, 1 - (e.clientY - r.top) / r.height));
    lastMove = performance.now();
  }, { passive: true });

  const DPR_CAP = 1.6;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  function draw(timeSec) {
    resize();
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, timeSec);
    gl.uniform2f(uMouse, curX, curY);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  let running = false, raf = 0, start = 0;

  function frame(now) {
    if (!running) return;
    if (!start) start = now;
    const tsec = (now - start) / 1000;
    // when the pointer is idle, the light drifts on its own so it stays alive
    if (now - lastMove > 2000) {
      targetX = 0.5 + 0.34 * Math.cos(tsec * 0.45);
      targetY = 0.56 + 0.24 * Math.sin(tsec * 0.38);
    }
    curX += (targetX - curX) * 0.045;
    curY += (targetY - curY) * 0.045;
    draw(tsec);
    raf = requestAnimationFrame(frame);
  }

  function play() { if (!running) { running = true; raf = requestAnimationFrame(frame); } }
  function pause() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

  const io = new IntersectionObserver((entries) => {
    const visible = entries[0] && entries[0].isIntersecting;
    if (visible && !document.hidden) play(); else pause();
  }, { threshold: 0.01 });
  io.observe(canvas);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
    else if (canvas.getBoundingClientRect().bottom > 0) play();
  });

  window.addEventListener("resize", resize);

  // immediate first frame so there's never a flash of the CSS fallback
  resize();
  draw(0);
})();
