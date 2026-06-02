import { useEffect, useRef } from "react";


type Star = {
  x: number;
  y: number;
  r: number;
  base: number;
  twinkle: number;
  phase: number;
  gold: boolean;
  layer: number; // 0 far, 1 mid, 2 near
  drift: number;
};

type Particle = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  layer: number;
};

type Constellation = {
  points: number[];
  life: number;
  maxLife: number;
};

const PURPLE_DEEP = "#080214";
const PURPLE_MID = "#160a2e";
const PURPLE_GLOW = "#27124f";
const GOLD = "224, 188, 110";
const WHITE = "240, 235, 255";

export default function CelestialBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Star[] = [];
    let particles: Particle[] = [];
    const constellations: Constellation[] = [];
    let raf = 0;
    let last = performance.now();
    let scrollY = window.scrollY;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isMobile = window.innerWidth < 768;

    const buildScene = () => {
      const area = width * height;
      // total stars across 3 layers
      const total = Math.min(isMobile ? 160 : 320, Math.floor(area / 7000));
      stars = Array.from({ length: total }, () => {
        const layer = Math.random() < 0.55 ? 0 : Math.random() < 0.75 ? 1 : 2;
        const gold = Math.random() < (layer === 2 ? 0.45 : 0.2);
        const sizeBase = layer === 0 ? 0.5 : layer === 1 ? 0.9 : 1.4;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * sizeBase + 0.3,
          base: layer === 0 ? 0.25 : layer === 1 ? 0.4 : 0.55,
          twinkle: 0.1 + Math.random() * 0.3,
          phase: Math.random() * Math.PI * 2,
          gold,
          layer,
          drift: (Math.random() - 0.5) * 0.008 * (layer + 1),
        };
      });

      const pCount = isMobile ? 18 : 36;
      particles = Array.from({ length: pCount }, () => {
        const layer = Math.floor(Math.random() * 3);
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.3 + 0.4 + layer * 0.3,
          vx: (Math.random() - 0.5) * 0.04 * (layer + 1),
          vy: (-0.02 - Math.random() * 0.04) * (layer + 1),
          alpha: 0.08 + Math.random() * 0.18,
          layer,
        };
      });
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildScene();
    };
    resize();
    window.addEventListener("resize", resize);

    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const spawnConstellation = () => {
      // pick a random region of the screen so constellations form in
      // different areas over time, not always the same cluster
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const radius = Math.min(width, height) * (0.18 + Math.random() * 0.12);
      const candidates: number[] = [];
      for (let i = 0; i < stars.length; i++) {
        if (stars[i].layer === 0) continue;
        const dx = stars[i].x - rx;
        const dy = stars[i].y - ry;
        if (dx * dx + dy * dy < radius * radius) candidates.push(i);
      }
      if (candidates.length < 4) return;
      const startIdx = candidates[Math.floor(Math.random() * candidates.length)];
      const indices: number[] = [startIdx];
      const used = new Set([startIdx]);
      let current = stars[startIdx];
      const count = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        let bestIdx = -1;
        let bestDist = Infinity;
        for (const j of candidates) {
          if (used.has(j)) continue;
          const s = stars[j];
          const dx = s.x - current.x;
          const dy = s.y - current.y;
          const d = dx * dx + dy * dy;
          if (d > 50 * 50 && d < 220 * 220 && d < bestDist) {
            bestDist = d;
            bestIdx = j;
          }
        }
        if (bestIdx === -1) break;
        indices.push(bestIdx);
        used.add(bestIdx);
        current = stars[bestIdx];
      }
      if (indices.length < 3) return;
      constellations.push({ points: indices, life: 0, maxLife: 9000 + Math.random() * 6000 });
    };

    let constellationTimer = 2500;

    const render = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;

      // base radial gradient
      const grd = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.05,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.9
      );
      grd.addColorStop(0, PURPLE_GLOW);
      grd.addColorStop(0.5, PURPLE_MID);
      grd.addColorStop(1, PURPLE_DEEP);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);

      // slow drifting magical glows
      const t = now * 0.00004;
      const blob = (cx: number, cy: number, r: number, color: string, a: number) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(${color}, ${a})`);
        g.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      };
      blob(
        width * (0.3 + Math.sin(t) * 0.06),
        height * (0.4 + Math.cos(t * 0.8) * 0.04),
        Math.max(width, height) * 0.5,
        "120, 70, 200",
        0.14
      );
      blob(
        width * (0.75 + Math.cos(t * 1.2) * 0.05),
        height * (0.7 + Math.sin(t) * 0.03),
        Math.max(width, height) * 0.42,
        "180, 140, 80",
        0.05
      );

      // particles (parallax: deeper layers move less with scroll)
      for (const p of particles) {
        p.x += p.vx * dt * 0.6;
        p.y += p.vy * dt * 0.6;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        const parY = -scrollY * (0.04 + p.layer * 0.06);
        let drawY = p.y + parY;
        // wrap vertically so they cover whole page feel
        drawY = ((drawY % height) + height) % height;
        ctx.fillStyle = `rgba(${WHITE}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, drawY, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // constellations (near layer only)
      constellationTimer -= dt;
      if (constellationTimer <= 0 && constellations.length < 2 && !reduced) {
        spawnConstellation();
        constellationTimer = 8000 + Math.random() * 7000;
      }
      const nearParY = -scrollY * 0.22;
      for (let i = constellations.length - 1; i >= 0; i--) {
        const c = constellations[i];
        c.life += dt;
        const p = c.life / c.maxLife;
        let alpha = 0;
        if (p < 0.3) alpha = (p / 0.3) * 0.22;
        else if (p < 0.7) alpha = 0.22;
        else if (p < 1) alpha = (1 - (p - 0.7) / 0.3) * 0.22;
        else {
          constellations.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(${GOLD}, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let k = 0; k < c.points.length; k++) {
          const s = stars[c.points[k]];
          const y = s.y + nearParY;
          if (k === 0) ctx.moveTo(s.x, y);
          else ctx.lineTo(s.x, y);
        }
        ctx.stroke();
      }

      // stars by layer (drift + parallax)
      for (const s of stars) {
        s.phase += dt * 0.0008 * s.twinkle * 4;
        s.x += s.drift * dt * 0.3;
        if (s.x < -5) s.x = width + 5;
        if (s.x > width + 5) s.x = -5;

        const tw = s.base + Math.sin(s.phase) * s.twinkle;
        const a = Math.max(0.08, Math.min(0.85, tw));
        const color = s.gold ? GOLD : WHITE;
        const parY = -scrollY * (0.05 + s.layer * 0.09);
        let y = s.y + parY;
        // wrap so stars repeat — keeps coverage across long pages
        y = ((y % height) + height) % height;

        // glow only for mid/near layers — keeps far layer crisp & cheap
        if (s.layer > 0) {
          const g = ctx.createRadialGradient(s.x, y, 0, s.x, y, s.r * 5);
          g.addColorStop(0, `rgba(${color}, ${a * 0.5})`);
          g.addColorStop(1, `rgba(${color}, 0)`);
          ctx.fillStyle = g;
          ctx.fillRect(s.x - s.r * 5, y - s.r * 5, s.r * 10, s.r * 10);
        }
        ctx.fillStyle = `rgba(${color}, ${a})`;
        ctx.beginPath();
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: PURPLE_DEEP }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(5,2,15,0.5) 100%)",
            
        }}
      />
    </div>
  );
}
