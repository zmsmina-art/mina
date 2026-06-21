'use client';

import { useEffect, useRef } from 'react';

/* Dark monochrome "liquid obsidian" flow field.
   Domain-warped fbm (Inigo Quilez warp) shaped into a near-black charcoal
   current with sparse bright caustic veins — light moving deep inside black
   glass. Rendered at reduced internal resolution (it's soft anyway) for cheap
   GPU cost, capped DPR, with a one-frame static render under reduced motion. */

const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;

float hash(vec2 p){ p=fract(p*vec2(123.34,345.45)); p+=dot(p,p+34.345); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
  vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){
  float s=0.0, a=0.5;
  for(int i=0;i<3;i++){ s+=a*noise(p); p=p*2.02+vec2(1.3,-0.7); a*=0.5; }
  return s;
}
void main(){
  vec2 uv=(gl_FragCoord.xy - 0.5*resolution)/resolution.y;
  float t=time*0.05;

  // single domain warp — flowing organic structure (3 fbm calls, not 5)
  vec2 q=vec2(fbm(uv*1.5 + vec2(0.0,0.0) + t*0.10), fbm(uv*1.5 + vec2(5.2,1.3) - t*0.08));
  vec2 r=q;
  float f=fbm(uv*1.5 + 3.2*q + t*0.12);
  f=clamp(f,0.0,1.0);

  float base = 0.012;                          // near-black floor
  float field = pow(f, 3.1) * 0.17;            // deep charcoal currents (mostly dark)
  // thin bright caustic veins where the warp stretches — the glow inside the glass
  float vein = pow(clamp(length(r) - 0.62, 0.0, 1.0) * 2.2, 3.4) * 0.85;
  float g = base + field + vein;

  // radial lift toward upper-centre, hard falloff so edges sink to pure black
  float vig = smoothstep(1.15, 0.02, length(uv - vec2(0.0, 0.06)));
  g *= mix(0.25, 1.0, vig);

  vec3 col = vec3(clamp(g, 0.0, 1.0));
  col *= min(time*0.5, 1.0);                    // fade in on load
  O=vec4(col, 1.0);
}`;

const vertexShaderSource = [
  '#version 300 es',
  'precision highp float;',
  'in vec4 position;',
  'void main(){gl_Position=position;}',
].join('\n');

export default function HeroFlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
    if (!gl) return; // CSS .hero-liquid fallback remains visible

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Internal render scale — soft field, so render small and let CSS upscale.
    const renderScale = 0.45;
    // Shader is live: drop the expensive CSS blur fallback it sits on top of.
    document.documentElement.classList.add('has-hero-flow');

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, vertexShaderSource);
    gl.compileShader(vs);
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, fragmentShaderSource);
    gl.compileShader(fs);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(program, 'resolution');
    const timeLoc = gl.getUniformLocation(program, 'time');

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1) * renderScale;
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (now: number) => {
      gl.useProgram(program);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, now * 1e-3);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    let raf = 0;
    let visible = true;
    let last = -1e9;
    const frameInterval = 1000 / 30; // cap at ~30fps — the drift is slow
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < frameInterval) return;
      last = now;
      draw(now);
    };

    if (reduced) {
      // single static frame mid-evolution
      draw(6000);
    } else {
      raf = requestAnimationFrame(loop);
    }

    // Pause the render loop while the hero is scrolled out of view.
    const io = new IntersectionObserver(
      ([entry]) => {
        const nowVisible = entry.isIntersecting;
        if (nowVisible === visible) return;
        visible = nowVisible;
        if (reduced) return;
        if (visible && !raf) {
          raf = requestAnimationFrame(loop);
        } else if (!visible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      window.removeEventListener('resize', resize);
      io.disconnect();
      document.documentElement.classList.remove('has-hero-flow');
      if (raf) cancelAnimationFrame(raf);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-flow" aria-hidden="true" />;
}
