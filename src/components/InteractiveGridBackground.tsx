import { useEffect, useRef } from 'react';

type Point = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
};

export const InteractiveGridBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let frameId = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let points: Point[][] = [];
    const mouse = { x: -9999, y: -9999, active: false, strength: 0 };
    const spacing = 46;

    const buildGrid = () => {
      points = [];
      const columns = Math.ceil(width / spacing) + 3;
      const rows = Math.ceil(height / spacing) + 3;
      const startX = -spacing;
      const startY = -spacing;

      for (let y = 0; y < rows; y++) {
        const row: Point[] = [];
        for (let x = 0; x < columns; x++) {
          const px = startX + x * spacing;
          const py = startY + y * spacing;
          row.push({ x: px, y: py, ox: px, oy: py, vx: 0, vy: 0 });
        }
        points.push(row);
      }
    };

    const resize = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      buildGrid();
    };

    const handlePointerMove = (event: PointerEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
    };

    const handleMouseOut = (event: MouseEvent) => {
      if (!event.relatedTarget) {
        mouse.active = false;
      }
    };

    const handleWindowBlur = () => {
      mouse.active = false;
    };

    const drawLine = (from: Point, to: Point) => {
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      const distanceToMouse = Math.hypot(midX - mouse.x, midY - mouse.y);
      const glow = Math.max(0, 1 - distanceToMouse / 180) * mouse.strength;

      context.strokeStyle = glow > 0
        ? `rgba(82, 173, 255, ${0.14 + glow * 0.56})`
        : 'rgba(148, 163, 184, 0.095)';
      context.lineWidth = glow > 0 ? 0.9 + glow * 0.9 : 0.8;
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.stroke();
    };

    const drawDot = (point: Point) => {
      const distanceToMouse = Math.hypot(point.x - mouse.x, point.y - mouse.y);
      const glow = Math.max(0, 1 - distanceToMouse / 150) * mouse.strength;
      context.fillStyle = glow > 0
        ? `rgba(125, 201, 255, ${0.28 + glow * 0.58})`
        : 'rgba(148, 163, 184, 0.13)';
      context.beginPath();
      context.arc(point.x, point.y, glow > 0 ? 1 + glow * 1.1 : 0.9, 0, Math.PI * 2);
      context.fill();
    };

    const render = () => {
      context.clearRect(0, 0, width, height);
      mouse.strength += ((mouse.active ? 1 : 0) - mouse.strength) * (mouse.active ? 0.08 : 0.2);

      for (const row of points) {
        for (const point of row) {
          const dx = point.ox - mouse.x;
          const dy = point.oy - mouse.y;
          const distance = Math.hypot(dx, dy);
          const force = Math.max(0, 1 - distance / 180) * mouse.strength;

          if (force > 0) {
            const angle = Math.atan2(dy, dx);
            const wave = Math.sin((distance * 0.045) - performance.now() * 0.004);
            point.vx += Math.cos(angle) * force * 1.05 + Math.cos(angle + Math.PI / 2) * wave * force * 0.52;
            point.vy += Math.sin(angle) * force * 1.05 + Math.sin(angle + Math.PI / 2) * wave * force * 0.52;
          }

          const restoreStrength = mouse.active ? 0.045 : 0.18;
          point.vx += (point.ox - point.x) * restoreStrength;
          point.vy += (point.oy - point.y) * restoreStrength;
          point.vx *= mouse.active ? 0.84 : 0.68;
          point.vy *= mouse.active ? 0.84 : 0.68;
          point.x += point.vx;
          point.y += point.vy;

          if (!mouse.active && mouse.strength < 0.03) {
            point.x = point.ox;
            point.y = point.oy;
            point.vx = 0;
            point.vy = 0;
          }
        }
      }

      for (let y = 0; y < points.length; y++) {
        for (let x = 0; x < points[y].length; x++) {
          const point = points[y][x];
          if (x < points[y].length - 1) drawLine(point, points[y][x + 1]);
          if (y < points.length - 1) drawLine(point, points[y + 1][x]);
        }
      }

      for (const row of points) {
        for (const point of row) {
          drawDot(point);
        }
      }

      const gradient = context.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 210);
      gradient.addColorStop(0, `rgba(34, 211, 238, ${0.08 * mouse.strength})`);
      gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      frameId = window.requestAnimationFrame(render);
    };

    resize();
    render();

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
      aria-hidden="true"
    />
  );
};
