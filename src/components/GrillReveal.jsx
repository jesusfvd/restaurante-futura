import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import './GrillReveal.css';

// ═══════════════════════════════════════════════════════════════════
//  GLSL — Fragment Shader de fuego (fBm + Curl Noise)
//  Técnica: Fractal Brownian Motion con 6 octavas + Curl Noise
//  para turbulencia lateral orgánica, paleta de temperatura real
// ═══════════════════════════════════════════════════════════════════
const FIRE_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FIRE_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uOpen;
  uniform int   uHalf;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // Fractal Brownian Motion — 6 octavas para máximo detalle
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p  = rot * p * 2.1;
      a *= 0.5;
    }
    return v;
  }

  // Curl Noise — turbulencia lateral física
  vec2 curl(vec2 p, float t) {
    float eps = 0.01;
    float n1 = fbm(p + vec2(0.0, eps) + t * 0.3);
    float n2 = fbm(p - vec2(0.0, eps) + t * 0.3);
    float n3 = fbm(p + vec2(eps, 0.0) + t * 0.3);
    float n4 = fbm(p - vec2(eps, 0.0) + t * 0.3);
    return vec2((n1 - n2) / (2.0 * eps), -(n3 - n4) / (2.0 * eps));
  }

  // Paleta física de temperatura del fuego
  vec3 firePalette(float t) {
    t = clamp(t, 0.0, 1.0);
    vec3 c0 = vec3(0.0,   0.0,   0.0);   // negro
    vec3 c1 = vec3(0.80,  0.05,  0.0);   // rojo oscuro
    vec3 c2 = vec3(1.0,   0.35,  0.0);   // naranja
    vec3 c3 = vec3(1.0,   0.75,  0.1);   // amarillo
    vec3 c4 = vec3(1.0,   1.0,   0.85);  // blanco caliente
    if (t < 0.25) return mix(c0, c1, t / 0.25);
    if (t < 0.50) return mix(c1, c2, (t - 0.25) / 0.25);
    if (t < 0.75) return mix(c2, c3, (t - 0.50) / 0.25);
    return mix(c3, c4, (t - 0.75) / 0.25);
  }

  void main() {
    vec2 uv = vUv;
    float yDir = (uHalf == 0) ? uv.y : (1.0 - uv.y);
    float fx = uv.x;
    float fy = yDir;

    // Curl noise para movimiento lateral orgánico
    vec2 curlOff = curl(vec2(fx * 3.0, fy * 2.0), uTime) * 0.18;
    vec2 p = vec2(fx + curlOff.x, fy * 1.8 - uTime * 0.55) + curlOff * 0.4;

    // fBm multi-capa
    float f  = fbm(p * vec2(2.2, 1.8));
    f += fbm(p * vec2(4.1, 2.9) + 0.7) * 0.45;
    f += fbm(p * vec2(8.2, 5.8) + 1.4) * 0.20;

    // Máscara de altura y borde
    float heightMask = pow(1.0 - smoothstep(0.0, 0.85, fy), 1.3);
    float edgeMask   = smoothstep(0.0, 0.08, fx) * smoothstep(1.0, 0.92, fx);

    float fire = smoothstep(0.18, 0.82, f * heightMask * edgeMask);
    fire = pow(fire, 0.75) * (1.0 - uOpen * 0.95);

    vec3 col = firePalette(fire * 1.3) * uIntensity;

    // Bloom halo
    float bloom = smoothstep(0.6, 1.0, fire) * 0.35;
    col += firePalette(0.9) * bloom * uIntensity;

    // Fondo con brasas procedurales
    vec3 bg = vec3(0.04, 0.015, 0.005);
    float ember = noise(vec2(fx * 18.0, fy * 6.0 + uTime * 0.1))
                * noise(vec2(fx * 18.0, fy * 6.0 + uTime * 0.1) * 2.3 + 0.7);
    ember = smoothstep(0.55, 0.85, ember) * heightMask * (1.0 - fy + 0.1) * 0.6;
    bg += vec3(1.0, 0.3, 0.05) * ember * uIntensity;

    col = mix(bg, col, clamp(fire + bloom * 0.5, 0.0, 1.0));
    col = col / (col + 0.5);
    col = pow(col, vec3(0.45));

    gl_FragColor = vec4(col, uIntensity);
  }
`;

// ═══════════════════════════════════════════════════════════════════
//  GLSL — Shader de barras metálicas con PBR artesanal
// ═══════════════════════════════════════════════════════════════════
const BAR_VERT = `
  varying vec3 vNormal;
  varying vec3 vPos;
  varying vec2 vUv;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPos    = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vUv     = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const BAR_FRAG = `
  precision highp float;
  varying vec3 vNormal;
  varying vec3 vPos;
  varying vec2 vUv;
  uniform float uHeat;
  uniform float uTime;

  void main() {
    vec3 metalBase = vec3(0.18, 0.16, 0.14);
    vec3 lightDir  = normalize(vec3(sin(uTime * 0.3) * 0.3, cos(uTime * 0.2) * 0.2, 1.0));
    vec3 viewDir   = normalize(-vPos);
    vec3 halfDir   = normalize(lightDir + viewDir);

    // Especular Blinn-Phong (metal pulido)
    float spec     = pow(max(dot(vNormal, halfDir), 0.0), 120.0) * 0.9;
    vec3  fireDir  = normalize(vec3(sin(uTime * 2.0) * 0.5, 0.0, 1.0));
    float fireSpec = pow(max(dot(vNormal, normalize(fireDir + viewDir)), 0.0), 60.0) * 0.6;

    // Rayado longitudinal (anisotropía)
    float scratch  = fract(vUv.y * 80.0) * 0.5 + 0.75;
    float centerGlow = pow(1.0 - abs(vUv.x - 0.5) * 2.0, 1.5);

    // Color de temperatura
    vec3 coolColor = metalBase * scratch;
    vec3 heatColor = mix(vec3(0.9, 0.15, 0.02), vec3(1.0, 0.6, 0.1), centerGlow);
    vec3 baseColor = mix(coolColor, heatColor, uHeat * centerGlow * 0.7);
    vec3 fireAmb   = vec3(1.0, 0.35, 0.05) * uHeat * 0.3;

    vec3 col = baseColor
             + vec3(spec) * mix(1.0, 0.6, uHeat)
             + vec3(fireSpec * uHeat) * vec3(1.0, 0.5, 0.1)
             + fireAmb;

    // AO en bordes de la barra
    float ao = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
    col *= mix(0.4, 1.0, ao);

    gl_FragColor = vec4(col, 1.0);
  }
`;

// ═══════════════════════════════════════════════════════════════════
//  COMPONENTE REACT
// ═══════════════════════════════════════════════════════════════════
export default function GrillReveal({ isActive, onComplete }) {
  const mountRef   = useRef(null);
  const stateRef   = useRef({
    renderer: null, scene: null, camera: null,
    topGrp: null, botGrp: null,
    firePlaneTop: null, firePlaneBot: null,
    fireUniTop: null, fireUniBot: null,
    barMats: [], lights: [],
    sparks: null, sparkGeo: null, sparkMat: null,
    sVel: [], sLife: [], sMaxL: [],
    raf: null, lastTs: null,
    phase: 'idle', phaseT: 0,
    globalIntensity: 0, globalOpen: 0,
  });

  // ── HELPERS ────────────────────────────────────────────────────
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const easeExpoOut  = t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
  const easeCubicIn  = t => t * t * t;

  const spawnSpark = useCallback((s, i) => {
    const { sPos } = s;
    sPos[i * 3]     = (Math.random() - 0.5) * 10;
    sPos[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
    sPos[i * 3 + 2] = 0.5 + Math.random() * 0.8;
    s.sVel[i] = {
      x: (Math.random() - 0.5) * 0.04,
      y: 0.02 + Math.random() * 0.06,
      z: (Math.random() - 0.5) * 0.02,
    };
    s.sLife[i]  = 0;
    s.sMaxL[i]  = 0.4 + Math.random() * 0.7;
    s.sSiz[i]   = 3 + Math.random() * 8;
  }, []);

  // ── INIT THREE.JS ──────────────────────────────────────────────
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth  || window.innerWidth;
    const H = el.clientHeight || window.innerHeight;
    const s = stateRef.current;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping       = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    el.appendChild(renderer.domElement);
    s.renderer = renderer;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 60);
    camera.position.set(0, 0, 8.5);
    s.scene = scene; s.camera = camera;

    // Iluminación
    scene.add(new THREE.AmbientLight(0x100800, 0.6));
    const lPos    = [[-3,0,2],[3,0,2],[0,-3,1],[0,3,1],[0,0,3]];
    const lColors = [0xFF4400, 0xFF6600, 0xFF3300, 0xFF5500, 0xFF8800];
    s.lights = lPos.map((p, i) => {
      const l = new THREE.PointLight(lColors[i], 0, 14);
      l.position.set(...p);
      scene.add(l);
      return l;
    });

    // Planos de fuego (GLSL)
    const makeFirePlane = (uHalf) => {
      const uni = {
        uTime:      { value: 0 },
        uIntensity: { value: 0 },
        uOpen:      { value: 0 },
        uHalf:      { value: uHalf },
      };
      const mat  = new THREE.ShaderMaterial({
        vertexShader: FIRE_VERT, fragmentShader: FIRE_FRAG,
        uniforms: uni, transparent: true,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(11.5, 4.4), mat);
      mesh.position.z = -0.15;
      scene.add(mesh);
      return { mesh, uni };
    };
    const ft = makeFirePlane(0);
    const fb = makeFirePlane(1);
    s.firePlaneTop = ft.mesh; s.fireUniTop = ft.uni;
    s.firePlaneBot = fb.mesh; s.fireUniBot = fb.uni;

    // Barras metálicas (shader PBR artesanal)
    const BAR_N = 12, BAR_SPAN = 5.5, BAR_L = 11.5;
    const topGrp = new THREE.Group(), botGrp = new THREE.Group();
    scene.add(topGrp); scene.add(botGrp);
    s.topGrp = topGrp; s.botGrp = botGrp;
    s.barMats = [];

    for (let i = 0; i < BAR_N; i++) {
      const mat = new THREE.ShaderMaterial({
        vertexShader: BAR_VERT, fragmentShader: BAR_FRAG,
        uniforms: { uHeat: { value: 0.35 + Math.random() * 0.2 }, uTime: { value: 0 } },
      });
      s.barMats.push(mat);
      const geo = new THREE.CylinderGeometry(0.12, 0.12, BAR_L, 24, 1, false);
      geo.rotateZ(Math.PI / 2);
      const bar = new THREE.Mesh(geo, mat);
      const y   = (i / (BAR_N - 1)) * BAR_SPAN - BAR_SPAN / 2;
      bar.position.set(0, y, 0.3);
      bar.castShadow = true;
      (y >= 0 ? topGrp : botGrp).add(bar);
    }

    // Fondo interior oscuro
    const bgMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 8),
      new THREE.MeshStandardMaterial({ color: 0x030100, roughness: 1 })
    );
    bgMesh.position.z = -0.1;
    scene.add(bgMesh);

    // Sistema de chispas
    const SPARKS = 120;
    const sPos  = new Float32Array(SPARKS * 3);
    const sCol  = new Float32Array(SPARKS * 3);
    const sSiz  = new Float32Array(SPARKS);
    const sVel  = []; const sLife = []; const sMaxL = [];
    const sparkBundle = { sPos, sCol, sSiz, sVel, sLife, sMaxL };
    for (let i = 0; i < SPARKS; i++) spawnSpark(sparkBundle, i);

    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    sparkGeo.setAttribute('color',    new THREE.BufferAttribute(sCol, 3));
    sparkGeo.setAttribute('size',     new THREE.BufferAttribute(sSiz, 1));
    const sparkMat = new THREE.PointsMaterial({
      size: 0.06, vertexColors: true, transparent: true,
      opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const sparksObj = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparksObj);
    s.sparks    = sparksObj;
    s.sparkGeo  = sparkGeo;
    s.sparkMat  = sparkMat;
    Object.assign(s, { sVel, sLife, sMaxL, sSiz, sPos, sCol, SPARKS, sparkBundle });

    renderer.render(scene, camera);

    return () => {
      if (s.raf) cancelAnimationFrame(s.raf);
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []); // eslint-disable-line

  // ── LOOP DE ANIMACIÓN ──────────────────────────────────────────
  useEffect(() => {
    if (!isActive) return;
    const s = stateRef.current;
    if (!s.renderer) return;

    s.phase  = 'ignite';
    s.phaseT = 0;
    s.lastTs = null;
    s.globalIntensity = 0;
    s.globalOpen      = 0;

    const loop = (ts) => {
      s.raf = requestAnimationFrame(loop);
      const dt = s.lastTs ? Math.min((ts - s.lastTs) / 1000, 0.05) : 0.016;
      s.lastTs  = ts;
      s.phaseT += dt;
      const T  = ts * 0.001;
      const t  = s.phaseT;

      // ── IGNITE (0→1.4s) ──
      if (s.phase === 'ignite') {
        s.globalIntensity = clamp(t / 0.8, 0, 1) ** 3;
        const flicker = 1 + Math.sin(t * 22) * 0.12 + Math.sin(t * 13) * 0.07;
        s.fireUniTop.uIntensity.value = s.globalIntensity * flicker;
        s.fireUniBot.uIntensity.value = s.globalIntensity * flicker;
        s.firePlaneTop.scale.x = 1 + Math.sin(t * 8) * 0.015;
        s.firePlaneBot.scale.x = 1 + Math.cos(t * 7) * 0.015;
        if (t > 1.4) { s.phase = 'open'; s.phaseT = 0; }
      }

      // ── OPEN (0→1.1s) ──
      if (s.phase === 'open') {
        const p    = clamp(t / 1.0, 0, 1);
        const e    = easeExpoOut(p);
        s.globalOpen = e;
        s.topGrp.position.y =  e * 6.0;
        s.botGrp.position.y = -e * 6.0;
        const burst  = Math.sin(p * Math.PI) * 0.6;
        const flick  = 1 + Math.sin(t * 25) * 0.1;
        s.fireUniTop.uIntensity.value = (1 + burst) * flick;
        s.fireUniBot.uIntensity.value = (1 + burst) * flick;
        s.fireUniTop.uOpen.value = e;
        s.fireUniBot.uOpen.value = e;
        s.lights.forEach((l, i) => {
          l.intensity = e * (3.5 + burst * 2) + Math.sin(t * 18 + i) * 0.3;
        });
        s.sparkMat.opacity = clamp(e * 1.4, 0, 0.9);
        if (t > 1.1) { s.phase = 'sustain'; s.phaseT = 0; }
      }

      // ── SUSTAIN (0→0.55s) ──
      if (s.phase === 'sustain') {
        const flick = 1 + Math.sin(t * 20) * 0.08 + Math.sin(t * 11) * 0.05;
        s.fireUniTop.uIntensity.value = flick * 0.7;
        s.fireUniBot.uIntensity.value = flick * 0.7;
        if (t > 0.55) { s.phase = 'fadeout'; s.phaseT = 0; }
      }

      // ── FADEOUT (0→0.45s) ──
      if (s.phase === 'fadeout') {
        const fade = 1 - easeCubicIn(clamp(t / 0.45, 0, 1));
        s.fireUniTop.uIntensity.value = fade * 0.7;
        s.fireUniBot.uIntensity.value = fade * 0.7;
        s.sparkMat.opacity = fade * 0.8;
        s.lights.forEach(l => { l.intensity = fade * 2; });
        if (t > 0.45) {
          cancelAnimationFrame(s.raf);
          s.raf = null;
          s.phase = 'idle';
          // Reset
          s.topGrp.position.y = 0; s.botGrp.position.y = 0;
          s.fireUniTop.uIntensity.value = 0; s.fireUniBot.uIntensity.value = 0;
          s.fireUniTop.uOpen.value = 0;      s.fireUniBot.uOpen.value = 0;
          s.sparkMat.opacity = 0;
          s.lights.forEach(l => { l.intensity = 0; });
          s.renderer.render(s.scene, s.camera);
          onComplete?.();
          return;
        }
      }

      // ── TICK GLOBAL ──
      s.fireUniTop.uTime.value = T;
      s.fireUniBot.uTime.value = T;
      s.firePlaneTop.position.y =  0.05;
      s.firePlaneBot.position.y = -0.05;

      s.barMats.forEach((m, i) => {
        m.uniforms.uTime.value = T;
        m.uniforms.uHeat.value = clamp(
          s.globalIntensity * (0.4 + Math.sin(T * 3 + i * 1.3) * 0.15), 0, 1
        );
      });

      // ── SPARKS ──
      const { sparkBundle, SPARKS: N } = s;
      const pA = s.sparkGeo.attributes.position;
      const cA = s.sparkGeo.attributes.color;
      for (let i = 0; i < N; i++) {
        sparkBundle.sLife[i] += dt / sparkBundle.sMaxL[i];
        if (sparkBundle.sLife[i] > 1) spawnSpark(sparkBundle, i);
        const life = 1 - sparkBundle.sLife[i];
        pA.array[i*3]   += sparkBundle.sVel[i].x + Math.sin(T * 4 + i) * 0.005;
        pA.array[i*3+1] += sparkBundle.sVel[i].y * (0.7 + life * 0.4);
        pA.array[i*3+2] += sparkBundle.sVel[i].z;
        cA.array[i*3]   = 1;
        cA.array[i*3+1] = life > 0.5 ? life * 0.9 : 0.3 * life;
        cA.array[i*3+2] = life > 0.8 ? life * 0.4 : 0;
      }
      pA.needsUpdate = true;
      cA.needsUpdate = true;

      s.renderer.render(s.scene, s.camera);
    };

    s.raf = requestAnimationFrame(loop);
    return () => { if (s.raf) { cancelAnimationFrame(s.raf); s.raf = null; } };
  }, [isActive, onComplete, spawnSpark]);

  return (
    <div
      ref={mountRef}
      className={`grill-reveal-mount${isActive ? ' grill-reveal-active' : ''}`}
      aria-hidden="true"
    />
  );
}