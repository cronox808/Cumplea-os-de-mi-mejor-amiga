// Fondo de particulas configurable. Cada pagina puede definir, ANTES de
// cargar este script, dos variables globales opcionales:
//
//   window.PARTICLE_TYPE   = 'sparkle' | 'bubbles' | 'leaves' | 'confetti' | 'embers'
//   window.PARTICLE_COLORS = ['#rrggbb', ...]
//
// Si no se definen, usa 'sparkle' con colores dorado/verde por defecto.
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;

  const TYPE = window.PARTICLE_TYPE || 'sparkle';
  const COLORS = window.PARTICLE_COLORS || ['#ffd76a', '#8be05a', '#6ad6ff'];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const COUNTS = { sparkle: 60, bubbles: 40, leaves: 30, confetti: 70, embers: 26 };
  const N = COUNTS[TYPE] || 50;

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function spawn() {
    switch (TYPE) {
      case 'bubbles':
        return {
          x: rand(0, w), y: h + rand(0, 40),
          r: rand(4, 10), speed: rand(0.4, 1.1),
          wobble: rand(0, Math.PI * 2), wobbleSpeed: rand(0.01, 0.03),
          color: pick(COLORS)
        };
      case 'leaves':
        return {
          x: rand(0, w), y: -rand(0, 40),
          size: rand(6, 12), speed: rand(0.3, 0.8),
          drift: rand(-0.6, 0.6), angle: rand(0, Math.PI * 2),
          spin: rand(-0.02, 0.02), color: pick(COLORS)
        };
      case 'confetti':
        return {
          x: rand(0, w), y: -rand(0, 40),
          len: rand(10, 18), thick: rand(3, 5),
          speed: rand(1.2, 2.6), drift: rand(-0.8, 0.8),
          angle: rand(0, Math.PI * 2), spin: rand(-0.15, 0.15),
          color: pick(COLORS)
        };
      case 'embers':
        return {
          x: rand(0, w), y: h + rand(0, 40),
          size: rand(1.5, 3), speed: rand(0.15, 0.4),
          drift: rand(-0.15, 0.15), color: pick(COLORS),
          flicker: rand(0, Math.PI * 2)
        };
      default: // sparkle
        return {
          x: rand(0, w), y: h + rand(0, 40),
          size: rand(2, 5), speed: rand(0.3, 1.1),
          drift: rand(-0.2, 0.2), color: pick(COLORS),
          flicker: rand(0, Math.PI * 2)
        };
    }
  }

  const particles = Array.from({ length: N }, spawn);

  function draw(p) {
    switch (TYPE) {
      case 'bubbles': {
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
      case 'leaves': {
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = p.color;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
        break;
      }
      case 'confetti': {
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = p.color;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillRect(-p.len / 2, -p.thick / 2, p.len, p.thick);
        ctx.restore();
        break;
      }
      case 'embers': {
        const alpha = 0.25 + 0.35 * Math.sin(p.flicker);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        break;
      }
      default: { // sparkle
        const alpha = 0.4 + 0.4 * Math.sin(p.flicker);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    }
  }

  function step(p) {
    switch (TYPE) {
      case 'bubbles':
        p.y -= p.speed;
        p.wobble += p.wobbleSpeed;
        p.x += Math.sin(p.wobble) * 0.6;
        if (p.y < -20) Object.assign(p, spawn(), { y: h + 20 });
        break;
      case 'leaves':
        p.y += p.speed;
        p.x += p.drift;
        p.angle += p.spin;
        if (p.y > h + 20) Object.assign(p, spawn(), { y: -20 });
        break;
      case 'confetti':
        p.y += p.speed;
        p.x += p.drift;
        p.angle += p.spin;
        if (p.y > h + 20) Object.assign(p, spawn(), { y: -20 });
        break;
      case 'embers':
        p.y -= p.speed;
        p.x += p.drift;
        p.flicker += 0.04;
        if (p.y < -10) Object.assign(p, spawn(), { y: h + 10 });
        break;
      default: // sparkle
        p.y -= p.speed;
        p.x += p.drift;
        p.flicker += 0.05;
        if (p.y < -10) Object.assign(p, spawn(), { y: h + 10 });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      step(p);
      draw(p);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }
  tick();
})();
