// script.js
const STORAGE_KEYS = { posts: 'saga_posts_v1', members: 'saga_members_v1', apps: 'saga_apps_v1' };
function read(k) { try { return JSON.parse(localStorage.getItem(k) || '[]') } catch { return [] } }
function write(k, v) { localStorage.setItem(k, JSON.stringify(v)) }
function ts() { return 'id_' + Math.random().toString(36).substr(2, 9) }

// === FUTURISTIC NEURAL NETWORK BACKGROUND ===
if (document.getElementById('bgCanvas')) {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, nodes = [], lines = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Node {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.r = 2 + Math.random() * 3;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
      this.pulse += 0.03;
    }
    draw() {
      const pulse = Math.sin(this.pulse) * 0.5 + 1.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * pulse, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3);
      gradient.addColorStop(0, `rgba(50, 211, 160, ${0.8 * pulse})`);
      gradient.addColorStop(1, 'rgba(50, 211, 160, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  // Create nodes
  for (let i = 0; i < 80; i++) nodes.push(new Node());

  function drawConnections() {
    lines = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(50, 211, 160, ${0.15 * (180 - dist) / 180})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.fillStyle = 'rgba(7, 16, 36, 0.05)';
    ctx.fillRect(0, 0, w, h);
    nodes.forEach(n => { n.update(); n.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();
}

// === SIDE PANEL MENU ===
const hamburger = document.getElementById('hamburger');
const sidePanel = document.getElementById('sidePanel');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');

function openMenu() {
  hamburger.classList.add('active');
  sidePanel.classList.add('open');
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('active');
  sidePanel.classList.remove('open');
  overlay.classList.remove('show');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openMenu);
closeBtn?.addEventListener('click', closeMenu);
overlay?.addEventListener('click', closeMenu);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && sidePanel?.classList.contains('open')) closeMenu();
});

// === NEWS & CMS (unchanged) ===
// ... [Keep your existing renderPosts, renderNewsPreview, etc. from previous version]