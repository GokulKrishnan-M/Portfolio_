import { useEffect, useRef } from 'react';

type Orb = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: string;
  phase: number;
};

type Streak = {
  x: number;
  y: number;
  length: number;
  speed: number;
  width: number;
  color: string;
};

type Pulse = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  color: string;
};

type AccentShapeKind = 'circle' | 'triangle' | 'square';
type AmbientShapeKind = 'diamond' | 'shard';

type AccentShape = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  pulseOffset: number;
  shape: AccentShapeKind;
  fill: string;
  glow: string;
  detail: string;
  alpha: number;
};

type AmbientParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  thickness: number;
  rotation: number;
  rotationSpeed: number;
  shape: AmbientShapeKind;
  fill: string;
  glow: string;
  detail: string;
  alpha: number;
  pulseOffset: number;
};

type GridNode = {
  x: number;
  y: number;
  phase: number;
  drift: number;
};

const constellationPalette = ['#00d8ff', '#a855f7', '#ff7b72', '#7dd3fc'];
const streakPalette = ['#60a5fa', '#22d3ee', '#c084fc', '#f472b6'];
const pulsePalette = ['#00d8ff', '#8b5cf6', '#fb7185'];
const accentShapePalette = [
  { fill: 'rgba(255, 215, 64, 0.92)', glow: 'rgba(255, 208, 0, 0.58)', detail: 'rgba(255, 247, 204, 0.34)' },
  { fill: 'rgba(255, 94, 58, 0.92)', glow: 'rgba(255, 78, 0, 0.56)', detail: 'rgba(255, 214, 204, 0.3)' },
  { fill: 'rgba(95, 120, 255, 0.9)', glow: 'rgba(71, 98, 255, 0.52)', detail: 'rgba(218, 226, 255, 0.26)' },
  { fill: 'rgba(255, 210, 196, 0.88)', glow: 'rgba(255, 221, 210, 0.48)', detail: 'rgba(255, 250, 245, 0.28)' },
  { fill: 'rgba(123, 130, 145, 0.28)', glow: 'rgba(255, 255, 255, 0.12)', detail: 'rgba(255, 255, 255, 0.16)' },
];
const ambientPalette = [
  { fill: 'rgba(34, 211, 238, 0.68)', glow: 'rgba(34, 211, 238, 0.32)', detail: 'rgba(214, 251, 255, 0.24)' },
  { fill: 'rgba(96, 165, 250, 0.64)', glow: 'rgba(96, 165, 250, 0.3)', detail: 'rgba(223, 238, 255, 0.22)' },
  { fill: 'rgba(167, 139, 250, 0.58)', glow: 'rgba(167, 139, 250, 0.28)', detail: 'rgba(238, 231, 255, 0.2)' },
  { fill: 'rgba(244, 114, 182, 0.42)', glow: 'rgba(244, 114, 182, 0.2)', detail: 'rgba(255, 233, 244, 0.18)' },
];

export const ParticleBackground = ({
  type = 0,
  variant = 'default',
  fitParent = false,
  priority = false,
}: {
  type?: number;
  variant?: 'default' | 'ambient';
  fitParent?: boolean;
  priority?: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    let animationFrameId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    let lastDrawTime = 0;
    let lastUpdateTime = 0;
    const mode = type % 5;
    const isPriorityShapeMode = priority && mode === 3;
    const targetFrameMs = isPriorityShapeMode ? 1000 / 45 : variant === 'ambient' ? 1000 / 30 : 1000 / 50;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, isPriorityShapeMode ? 1.35 : variant === 'ambient' ? 1.15 : 1.4);

    let orbs: Orb[] = [];
    let streaks: Streak[] = [];
    let pulses: Pulse[] = [];
    let accentShapes: AccentShape[] = [];
    let ambientParticles: AmbientParticle[] = [];
    let gridNodes: GridNode[] = [];
    const pointer = { x: -9999, y: -9999, active: false, strength: 0 };

    const measurementTarget = fitParent ? canvas.parentElement : null;

    const resizeCanvas = () => {
      const bounds = fitParent
        ? measurementTarget?.getBoundingClientRect() ?? canvas.getBoundingClientRect()
        : { width: window.innerWidth, height: window.innerHeight };

      width = bounds.width || window.innerWidth;
      height = bounds.height || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, isPriorityShapeMode ? 1.35 : variant === 'ambient' ? 1.15 : 1.4);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(dpr, dpr);

      const priorityVelocity = (min: number, range: number) => {
        const direction = Math.random() < 0.5 ? -1 : 1;
        return direction * (min + Math.random() * range);
      };

      orbs = Array.from({ length: 36 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        size: Math.random() * 3.5 + 1.5,
        hue: constellationPalette[Math.floor(Math.random() * constellationPalette.length)],
        phase: Math.random() * Math.PI * 2,
      }));

      streaks = Array.from({ length: 44 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 90 + 50,
        speed: Math.random() * 3 + 2,
        width: Math.random() * 1.5 + 0.6,
        color: streakPalette[Math.floor(Math.random() * streakPalette.length)],
      }));

      pulses = Array.from({ length: 4 }, (_, index) => ({
        x: width * (0.2 + index * 0.23),
        y: height * (0.32 + (index % 2) * 0.24),
        radius: 40 + index * 24,
        speed: 0.35 + index * 0.05,
        color: pulsePalette[index % pulsePalette.length],
      }));

      accentShapes = Array.from({ length: isPriorityShapeMode ? 24 : 18 }, (_, index) => {
        const shapeCycle: AccentShapeKind[] = ['triangle', 'square', 'circle', 'triangle', 'circle', 'square'];
        const palette = accentShapePalette[index % accentShapePalette.length];

        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: isPriorityShapeMode ? priorityVelocity(0.22, 0.32) : (Math.random() - 0.5) * 0.24,
          vy: isPriorityShapeMode ? priorityVelocity(0.16, 0.28) : (Math.random() - 0.5) * 0.22,
          size: 14 + (index % 4) * 6 + Math.random() * 4,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * (isPriorityShapeMode ? 0.014 : 0.007),
          pulseOffset: Math.random() * Math.PI * 2,
          shape: shapeCycle[index % shapeCycle.length],
          fill: palette.fill,
          glow: palette.glow,
          detail: palette.detail,
          alpha: 0.55 + (index % 3) * 0.1,
        };
      });

      ambientParticles = Array.from({ length: 14 }, (_, index) => {
        const palette = ambientPalette[index % ambientPalette.length];

        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.16,
          size: 16 + (index % 4) * 6 + Math.random() * 6,
          thickness: 1.8 + (index % 3) * 0.5,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.008,
          shape: index % 2 === 0 ? 'diamond' : 'shard',
          fill: palette.fill,
          glow: palette.glow,
          detail: palette.detail,
          alpha: 0.18 + (index % 3) * 0.04,
          pulseOffset: Math.random() * Math.PI * 2,
        };
      });

      gridNodes = Array.from({ length: 44 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        phase: Math.random() * Math.PI * 2,
        drift: 0.35 + Math.random() * 0.55,
      }));
    };

    const drawOrb = (orb: Orb, time: number) => {
      const glowSize = orb.size * (priority ? 10 : 8);
      const alpha = (priority ? 0.5 : 0.35) + Math.sin(time * 0.0012 + orb.phase) * (priority ? 0.2 : 0.15);
      const gradient = context.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, glowSize);

      gradient.addColorStop(0, `${orb.hue}cc`);
      gradient.addColorStop(0.35, `${orb.hue}55`);
      gradient.addColorStop(1, 'transparent');

      context.save();
      context.globalAlpha = alpha;
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(orb.x, orb.y, glowSize, 0, Math.PI * 2);
      context.fill();
      context.restore();

      context.save();
      context.fillStyle = orb.hue;
      context.shadowColor = orb.hue;
      context.shadowBlur = priority ? 22 : 14;
      context.beginPath();
      context.arc(orb.x, orb.y, priority ? orb.size * 1.18 : orb.size, 0, Math.PI * 2);
      context.fill();
      context.restore();
    };

    const drawConstellation = (time: number, deltaScale: number) => {
      for (const orb of orbs) {
        const pointerDistance = Math.hypot(orb.x - pointer.x, orb.y - pointer.y);
        const pointerForce = Math.max(0, 1 - pointerDistance / 170) * pointer.strength;

        if (pointerForce > 0) {
          const angle = Math.atan2(orb.y - pointer.y, orb.x - pointer.x);
          orb.vx += Math.cos(angle) * pointerForce * 0.08;
          orb.vy += Math.sin(angle) * pointerForce * 0.08;
        }

        orb.x += orb.vx * deltaScale;
        orb.y += orb.vy * deltaScale;
        orb.vx *= 0.995;
        orb.vy *= 0.995;

        if (orb.x < -20) orb.x = width + 20;
        if (orb.x > width + 20) orb.x = -20;
        if (orb.y < -20) orb.y = height + 20;
        if (orb.y > height + 20) orb.y = -20;
      }

      context.save();
      for (let i = 0; i < orbs.length; i += 1) {
        for (let j = i + 1; j < orbs.length; j += 1) {
          const dx = orbs[i].x - orbs[j].x;
          const dy = orbs[i].y - orbs[j].y;
          const distance = Math.hypot(dx, dy);

          if (distance < 150) {
            const lineAlpha = priority ? 0.28 - distance / 760 : 0.16 - distance / 1000;
            context.strokeStyle = `rgba(125, 211, 252, ${Math.max(0.04, lineAlpha)})`;
            context.lineWidth = priority ? 1.15 : 1;
            context.beginPath();
            context.moveTo(orbs[i].x, orbs[i].y);
            context.lineTo(orbs[j].x, orbs[j].y);
            context.stroke();
          }
        }
      }
      context.restore();

      for (const orb of orbs) {
        drawOrb(orb, time);
      }
    };

    const drawStreakField = (deltaScale: number) => {
      for (const streak of streaks) {
        streak.x += streak.speed * 0.45 * deltaScale;
        streak.y += streak.speed * deltaScale;

        if (streak.y - streak.length > height || streak.x - streak.length > width) {
          streak.x = Math.random() * width - width * 0.3;
          streak.y = -streak.length;
        }

        const tailX = streak.x - streak.length * 0.45;
        const tailY = streak.y - streak.length;

        const gradient = context.createLinearGradient(streak.x, streak.y, tailX, tailY);
        gradient.addColorStop(0, `${streak.color}ee`);
        gradient.addColorStop(0.35, `${streak.color}88`);
        gradient.addColorStop(1, 'transparent');

        context.save();
        context.strokeStyle = gradient;
        context.lineWidth = streak.width;
        context.shadowColor = streak.color;
        context.shadowBlur = 14;
        context.beginPath();
        context.moveTo(streak.x, streak.y);
        context.lineTo(tailX, tailY);
        context.stroke();
        context.restore();
      }
    };

    const drawPulseField = (time: number, deltaScale: number) => {
      const baseY = height * 0.5;
      const waveConfigs = [
        { amplitude: 42, frequency: 0.007, speed: 0.0011, color: '#00d8ff', alpha: 0.45 },
        { amplitude: 30, frequency: 0.009, speed: 0.0016, color: '#8b5cf6', alpha: 0.38 },
        { amplitude: 22, frequency: 0.012, speed: 0.0022, color: '#fb7185', alpha: 0.26 },
      ];

      for (const wave of waveConfigs) {
        context.save();
        context.beginPath();
        for (let x = -40; x <= width + 40; x += 10) {
          const y =
            baseY +
            Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude +
            Math.cos(x * (wave.frequency * 0.55) + time * (wave.speed * 1.3)) * 18;

          if (x === -40) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }
        }

        context.strokeStyle = wave.color;
        context.globalAlpha = wave.alpha;
        context.lineWidth = 2.2;
        context.shadowColor = wave.color;
        context.shadowBlur = 16;
        context.stroke();
        context.restore();
      }

      for (const pulse of pulses) {
        pulse.radius += pulse.speed * deltaScale;
        if (pulse.radius > Math.max(width, height) * 0.18) {
          pulse.radius = 18;
        }

        context.save();
        context.strokeStyle = pulse.color;
        context.globalAlpha = Math.max(0, 0.22 - pulse.radius / 900);
        context.lineWidth = 1.5;
        context.shadowColor = pulse.color;
        context.shadowBlur = 18;
        context.beginPath();
        context.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        context.stroke();
        context.restore();
      }
    };

    const drawTriangle = (size: number, detail: string) => {
      const heightScale = size * 0.9;
      context.beginPath();
      context.moveTo(0, -heightScale);
      context.lineTo(size * 0.86, heightScale);
      context.lineTo(-size * 0.86, heightScale);
      context.closePath();
      context.fill();

      context.strokeStyle = detail;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, -heightScale * 0.55);
      context.lineTo(0, heightScale * 0.58);
      context.stroke();
    };

    const drawSquare = (size: number, detail: string) => {
      const edge = size * 1.7;
      context.fillRect(-edge / 2, -edge / 2, edge, edge);

      context.strokeStyle = detail;
      context.lineWidth = 0.85;
      const step = edge / 4;

      for (let i = 1; i < 4; i += 1) {
        const offset = -edge / 2 + step * i;

        context.beginPath();
        context.moveTo(offset, -edge / 2);
        context.lineTo(offset, edge / 2);
        context.stroke();

        context.beginPath();
        context.moveTo(-edge / 2, offset);
        context.lineTo(edge / 2, offset);
        context.stroke();
      }
    };

    const drawCircle = (size: number) => {
      context.beginPath();
      context.arc(0, 0, size * 0.78, 0, Math.PI * 2);
      context.fill();
    };

    const drawAmbientDiamond = (size: number, detail: string) => {
      context.beginPath();
      context.moveTo(0, -size);
      context.lineTo(size * 0.82, 0);
      context.lineTo(0, size);
      context.lineTo(-size * 0.82, 0);
      context.closePath();
      context.fill();

      context.strokeStyle = detail;
      context.lineWidth = 0.85;
      context.beginPath();
      context.moveTo(-size * 0.3, 0);
      context.lineTo(size * 0.3, 0);
      context.stroke();
    };

    const drawAmbientShard = (size: number, detail: string) => {
      context.beginPath();
      context.moveTo(-size * 0.95, -size * 0.14);
      context.lineTo(size, 0);
      context.lineTo(-size * 0.95, size * 0.14);
      context.closePath();
      context.fill();

      context.strokeStyle = detail;
      context.lineWidth = 0.9;
      context.beginPath();
      context.moveTo(-size * 0.45, 0);
      context.lineTo(size * 0.55, 0);
      context.stroke();
    };

    const drawAccentShapes = (time: number, deltaScale: number) => {
      for (const shape of accentShapes) {
        const pointerDistance = Math.hypot(shape.x - pointer.x, shape.y - pointer.y);
        const pointerForce = Math.max(0, 1 - pointerDistance / 210) * pointer.strength;

        if (pointerForce > 0) {
          const angle = Math.atan2(shape.y - pointer.y, shape.x - pointer.x);
          shape.x += Math.cos(angle) * pointerForce * 1.8 * deltaScale;
          shape.y += Math.sin(angle) * pointerForce * 1.8 * deltaScale;
          shape.rotation += pointerForce * 0.025 * deltaScale;
        }

        shape.x += shape.vx * deltaScale;
        shape.y += shape.vy * deltaScale;
        shape.rotation += shape.rotationSpeed * deltaScale;

        if (shape.x < -50) shape.x = width + 50;
        if (shape.x > width + 50) shape.x = -50;
        if (shape.y < -50) shape.y = height + 50;
        if (shape.y > height + 50) shape.y = -50;

        const glowPulse =
          0.78 + Math.sin(time * (isPriorityShapeMode ? 0.0017 : 0.0011) + shape.pulseOffset) * 0.16;
        const renderSize =
          shape.size *
          (0.96 + Math.sin(time * (isPriorityShapeMode ? 0.002 : 0.0014) + shape.pulseOffset) * (isPriorityShapeMode ? 0.06 : 0.04));
        const driftX = isPriorityShapeMode ? Math.sin(time * 0.00034 + shape.pulseOffset) * 8 : 0;
        const driftY = isPriorityShapeMode ? Math.cos(time * 0.0003 + shape.pulseOffset) * 6 : 0;

        context.save();
        context.translate(shape.x + driftX, shape.y + driftY);
        context.rotate(shape.rotation);
        context.globalAlpha = Math.min(0.9, shape.alpha * glowPulse * (isPriorityShapeMode ? 1.05 : 1));
        context.shadowColor = shape.glow;
        context.shadowBlur = shape.size * (isPriorityShapeMode ? 1.7 : 1.5);
        context.fillStyle = shape.fill;

        if (shape.shape === 'triangle') {
          drawTriangle(renderSize, shape.detail);
        } else if (shape.shape === 'square') {
          drawSquare(renderSize, shape.detail);
        } else {
          drawCircle(renderSize);
        }

        context.restore();
      }
    };

    const drawAmbientField = (time: number, deltaScale: number) => {
      for (const particle of ambientParticles) {
        particle.x += particle.vx * deltaScale;
        particle.y += particle.vy * deltaScale;
        particle.rotation += particle.rotationSpeed * deltaScale;

        if (particle.x < -60) particle.x = width + 60;
        if (particle.x > width + 60) particle.x = -60;
        if (particle.y < -60) particle.y = height + 60;
        if (particle.y > height + 60) particle.y = -60;

        const pulse = 0.82 + Math.sin(time * 0.001 + particle.pulseOffset) * 0.22;
        const tailX = particle.x - particle.vx * 130;
        const tailY = particle.y - particle.vy * 130;
        const trailGradient = context.createLinearGradient(particle.x, particle.y, tailX, tailY);

        trailGradient.addColorStop(0, particle.glow.replace(/0\.\d+\)/, `${Math.min(0.24, particle.alpha * pulse * 0.8)})`));
        trailGradient.addColorStop(0.45, particle.glow.replace(/0\.\d+\)/, `${Math.min(0.12, particle.alpha * pulse * 0.45)})`));
        trailGradient.addColorStop(1, 'transparent');

        context.save();
        context.globalAlpha = Math.min(0.48, particle.alpha * pulse * 1.05);
        context.strokeStyle = trailGradient;
        context.lineWidth = particle.thickness;
        context.lineCap = 'round';
        context.shadowColor = particle.glow;
        context.shadowBlur = 10;
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(tailX, tailY);
        context.stroke();
        context.restore();

        context.save();
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        context.globalAlpha = Math.min(0.6, particle.alpha * pulse);
        context.fillStyle = particle.fill;
        context.shadowColor = particle.glow;
        context.shadowBlur = particle.size;

        if (particle.shape === 'diamond') {
          drawAmbientDiamond(particle.size * 0.72, particle.detail);
        } else {
          drawAmbientShard(particle.size * 0.9, particle.detail);
        }

        context.globalAlpha = Math.min(0.28, particle.alpha * pulse * 0.65);
        context.strokeStyle = particle.detail;
        context.lineWidth = 1;

        if (particle.shape === 'diamond') {
          context.beginPath();
          context.moveTo(0, -(particle.size * 0.98));
          context.lineTo(particle.size * 0.98 * 0.82, 0);
          context.lineTo(0, particle.size * 0.98);
          context.lineTo(-(particle.size * 0.98) * 0.82, 0);
          context.closePath();
        } else {
          context.beginPath();
          context.moveTo(-(particle.size * 1.08), -(particle.size * 0.18));
          context.lineTo(particle.size * 1.12, 0);
          context.lineTo(-(particle.size * 1.08), particle.size * 0.18);
          context.closePath();
        }

        context.stroke();
        context.restore();
      }
    };

    const drawTechGridField = (time: number, deltaScale: number) => {
      const gridSize = 72;

      context.save();
      context.lineWidth = 1;
      context.strokeStyle = 'rgba(34, 211, 238, 0.08)';

      for (let x = (time * 0.006) % gridSize; x < width; x += gridSize) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }

      for (let y = (time * 0.004) % gridSize; y < height; y += gridSize) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }
      context.restore();

      for (const node of gridNodes) {
        const pointerDistance = Math.hypot(node.x - pointer.x, node.y - pointer.y);
        const pointerForce = Math.max(0, 1 - pointerDistance / 180) * pointer.strength;

        if (pointerForce > 0) {
          const angle = Math.atan2(node.y - pointer.y, node.x - pointer.x);
          node.x += Math.cos(angle) * pointerForce * 2.2 * deltaScale;
          node.y += Math.sin(angle) * pointerForce * 2.2 * deltaScale;
        }

        node.x += Math.sin(time * 0.0005 + node.phase) * 0.08 * deltaScale;
        node.y += node.drift * deltaScale;

        if (node.y > height + 30) {
          node.y = -30;
          node.x = Math.random() * width;
        }

        const pulse = 0.45 + Math.sin(time * 0.002 + node.phase) * 0.28;
        const radius = 1.6 + pulse * 2.6;

        context.save();
        context.globalAlpha = 0.28 + pulse * 0.34;
        context.fillStyle = '#22d3ee';
        context.shadowColor = '#22d3ee';
        context.shadowBlur = 18;
        context.beginPath();
        context.arc(node.x, node.y, radius, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }

      context.save();
      context.globalAlpha = 0.22;
      context.strokeStyle = 'rgba(167, 139, 250, 0.5)';
      context.lineWidth = 1.2;

      for (let i = 0; i < gridNodes.length; i += 1) {
        for (let j = i + 1; j < gridNodes.length; j += 1) {
          const dx = gridNodes[i].x - gridNodes[j].x;
          const dy = gridNodes[i].y - gridNodes[j].y;
          const distance = Math.hypot(dx, dy);

          if (distance < 125) {
            context.globalAlpha = Math.max(0.04, 0.22 - distance / 600);
            context.beginPath();
            context.moveTo(gridNodes[i].x, gridNodes[i].y);
            context.lineTo(gridNodes[j].x, gridNodes[j].y);
            context.stroke();
          }
        }
      }
      context.restore();
    };

    const animate = (time: number) => {
      if ((!isPriorityShapeMode && !isVisible) || !isPageVisible || time - lastDrawTime < targetFrameMs) {
        animationFrameId = window.requestAnimationFrame(animate);
        return;
      }

      const deltaScale = lastUpdateTime
        ? Math.min((time - lastUpdateTime) / 16.67, 2.5)
        : 1;
      lastDrawTime = time;
      lastUpdateTime = time;
      pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * 0.08;

      context.clearRect(0, 0, width, height);

      if (variant === 'ambient') {
        drawAmbientField(time, deltaScale);
      } else if (mode === 0) {
        drawConstellation(time, deltaScale);
      } else if (mode === 1) {
        drawStreakField(deltaScale);
      } else if (mode === 2) {
        drawPulseField(time, deltaScale);
      } else if (mode === 3) {
        drawAccentShapes(time, deltaScale);
      } else {
        drawTechGridField(time, deltaScale);
      }

      animationFrameId = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) {
        lastDrawTime = 0;
        lastUpdateTime = 0;
      }
    };

    resizeCanvas();
    if (fitParent && typeof ResizeObserver !== 'undefined' && measurementTarget) {
      resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
      });
      resizeObserver.observe(measurementTarget);
    }

    if (!isPriorityShapeMode && typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            lastDrawTime = 0;
            lastUpdateTime = 0;
          }
        },
        { rootMargin: '220px' },
      );
      intersectionObserver.observe(canvas);
    }

    animationFrameId = window.requestAnimationFrame(animate);
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('blur', handlePointerLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
    };
  }, [fitParent, priority, type, variant]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 w-full h-full pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
};
