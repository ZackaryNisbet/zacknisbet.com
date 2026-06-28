// Progressive-enhancement WebGL backdrop for the hero.
// Renders an animated, domain-warped noise field in the site's ink/green/brass
// palette. If WebGL is unavailable, the shader errors, or the user prefers
// reduced motion, the canvas hides and the CSS gradient on .hero shows instead.
// Crawlers and structured data never depend on any of this.

(function () {
  const canvas = document.querySelector(".hero-shader");
  if (!canvas) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hide = () => {
    canvas.style.display = "none";
  };

  if (reducedMotion.matches) {
    hide();
    return;
  }

  const gl =
    canvas.getContext("webgl", { antialias: false, alpha: true, depth: false }) ||
    canvas.getContext("experimental-webgl");

  if (!gl) {
    hide();
    return;
  }

  const VERT = `
    attribute vec2 p;
    void main() { gl_Position = vec4(p, 0.0, 1.0); }
  `;

  // Ashima 2D simplex noise (snoise) + fbm + domain warp.
  const FRAG = `
    precision highp float;
    uniform vec2 u_res;
    uniform float u_time;

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
      for (int i = 0; i < 5; i++) {
        s += a * snoise(p);
        p *= 2.02;
        a *= 0.5;
      }
      return s;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_res.xy;
      vec2 p = uv;
      p.x *= u_res.x / u_res.y;       // aspect-correct
      p *= 1.6;
      float t = u_time * 0.045;

      // domain warp
      vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(3.2, -t)));
      vec2 r = vec2(fbm(p + 1.4 * q + vec2(1.7, 9.2) + 0.15 * t),
                    fbm(p + 1.4 * q + vec2(8.3, 2.8) - 0.12 * t));
      float n = fbm(p + 1.8 * r);
      n = 0.5 + 0.5 * n;              // -> 0..1

      vec3 ink   = vec3(0.030, 0.067, 0.054);
      vec3 mid   = vec3(0.055, 0.130, 0.100);
      vec3 green = vec3(0.105, 0.235, 0.168);
      vec3 brass = vec3(0.430, 0.205, 0.110);

      vec3 col = mix(ink, mid, smoothstep(0.22, 0.58, n));
      col = mix(col, green, smoothstep(0.52, 0.86, n));
      col += brass * smoothstep(0.80, 0.99, n) * (0.45 + 0.30 * length(r));

      // light drifts toward the upper-right negative space
      col *= 0.90 + 0.16 * smoothstep(0.1, 1.0, uv.x + uv.y * 0.4);
      // ease the very bottom toward ink to meet the .hero::after fade
      col = mix(ink, col, smoothstep(0.0, 0.20, uv.y));

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) {
    hide();
    return;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    hide();
    return;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, "u_res");
  const uTime = gl.getUniformLocation(prog, "u_time");

  const DPR_CAP = 1.5;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  let running = false;
  let raf = 0;
  let start = 0;

  function draw(timeSec) {
    resize();
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, timeSec);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function frame(now) {
    if (!running) return;
    if (!start) start = now;
    draw((now - start) / 1000);
    raf = requestAnimationFrame(frame);
  }

  function play() {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }
  function pause() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  // Only run while the hero is on screen and the tab is visible.
  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries[0] && entries[0].isIntersecting;
      if (visible && !document.hidden) play();
      else pause();
    },
    { threshold: 0.01 }
  );
  io.observe(canvas);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
    else if (canvas.getBoundingClientRect().bottom > 0) play();
  });

  window.addEventListener("resize", resize);

  // Paint one frame immediately so there is never a flash of the CSS
  // fallback, even before the IntersectionObserver fires or on a tab that
  // loads in the background.
  resize();
  draw(0);
})();
