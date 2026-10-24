// ⚠️ À remplacer par la vraie adresse de Lana
const EMAIL_LANA = 'bonjour@lanaclaviere.fr';

const PRODUCTS = [
  { id: 'soleil', name: 'Soleil du matin', type: 'imprime', price: 22, bag: '#efe2c8', ink: '#c8643b', motif: 'sun', desc: 'Un grand soleil orangé pour garder la bonne humeur.' },
  { id: 'fleurs', name: 'Petites fleurs', type: 'brode', price: 30, bag: '#f3ece0', ink: '#d86f8f', motif: 'flowers', desc: 'Un bouquet brodé fil à fil, tout en douceur.' },
  { id: 'vagues', name: 'Les vagues', type: 'imprime', price: 22, bag: '#dfe8e4', ink: '#2f6f8f', motif: 'waves', desc: 'Pour la plage, la piscine ou rêver de vacances.' },
  { id: 'rayures', name: 'Marinière', type: 'imprime', price: 20, bag: '#f6f1e8', ink: '#2e3f6e', motif: 'stripes', desc: "Le classique à rayures, qui va avec tout." },
  { id: 'coeur', name: 'Cœur brodé', type: 'brode', price: 28, bag: '#2e2a26', ink: '#e8a37c', motif: 'heart', desc: 'Sac noir avec un petit cœur brodé au centre.' },
  { id: 'pois', name: 'Pois pastel', type: 'imprime', price: 20, bag: '#f5dfd6', ink: '#8fa58a', motif: 'dots', desc: 'Des pois verts sauge sur fond rose poudré.' },
  { id: 'feuille', name: 'Feuille de forêt', type: 'brode', price: 30, bag: '#e3e6d4', ink: '#4f6b45', motif: 'leaf', desc: 'Une feuille brodée, inspirée des balades en forêt.' },
  { id: 'lune', name: 'Nuit étoilée', type: 'imprime', price: 24, bag: '#2d3550', ink: '#f2d27a', motif: 'moon', desc: 'Une lune et des étoiles dorées sur bleu nuit.' },
];

const BAG_COLORS = ['#efe2c8', '#f6f1e8', '#2e2a26', '#dfe8e4', '#f5dfd6', '#2d3550'];
const INK_COLORS = ['#c8643b', '#2e2a26', '#ffffff', '#d86f8f', '#4f6b45', '#f2d27a'];
const PERSO_PRICE = { imprime: 24, brode: 32 };

// ---------- Dessin d'un tote bag en SVG ----------
function motifSvg(m, ink) {
  switch (m) {
    case 'sun':
      return `<circle cx="100" cy="150" r="30" fill="${ink}"/>` +
        Array.from({ length: 12 }, (_, i) => {
          const a = i * Math.PI / 6, x1 = 100 + Math.cos(a) * 40, y1 = 150 + Math.sin(a) * 40,
            x2 = 100 + Math.cos(a) * 56, y2 = 150 + Math.sin(a) * 56;
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>`;
        }).join('');
    case 'flowers':
      return [[75, 130], [125, 140], [100, 180]].map(([x, y]) =>
        [0, 72, 144, 216, 288].map(d => {
          const a = d * Math.PI / 180;
          return `<circle cx="${x + Math.cos(a) * 11}" cy="${y + Math.sin(a) * 11}" r="9" fill="${ink}" opacity=".85"/>`;
        }).join('') + `<circle cx="${x}" cy="${y}" r="6" fill="#f2d27a"/>`
      ).join('');
    case 'waves':
      return [120, 145, 170, 195].map(y =>
        `<path d="M40 ${y} q15 -14 30 0 t30 0 t30 0 t30 0 t30 0" fill="none" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>`).join('');
    case 'stripes':
      return [100, 125, 150, 175, 200, 225].map(y => `<rect x="30" y="${y}" width="140" height="11" fill="${ink}"/>`).join('');
    case 'heart':
      return `<path d="M100 185 C60 160 62 120 86 120 C95 120 100 128 100 134 C100 128 105 120 114 120 C138 120 140 160 100 185Z" fill="none" stroke="${ink}" stroke-width="5" stroke-dasharray="7 5"/>`;
    case 'dots': {
      let s = '';
      for (let y = 105; y < 240; y += 26) for (let x = 45 + ((y / 26) % 2) * 13; x < 165; x += 26) s += `<circle cx="${x}" cy="${y}" r="6" fill="${ink}"/>`;
      return s;
    }
    case 'leaf':
      return `<path d="M100 205 C55 175 60 120 100 105 C140 120 145 175 100 205Z" fill="none" stroke="${ink}" stroke-width="5" stroke-dasharray="6 4"/>
        <path d="M100 110 L100 215" stroke="${ink}" stroke-width="4"/>
        <path d="M100 140 L80 128 M100 160 L120 146 M100 180 L80 166" stroke="${ink}" stroke-width="3"/>`;
    case 'moon':
      return `<path d="M115 120 a34 34 0 1 0 0 62 a28 28 0 1 1 0 -62Z" fill="${ink}"/>` +
        [[140, 125, 5], [60, 140, 4], [145, 195, 4], [70, 205, 6]].map(([x, y, r]) =>
          `<path d="M${x} ${y - r * 2} L${x + r * .6} ${y - r * .6} L${x + r * 2} ${y} L${x + r * .6} ${y + r * .6} L${x} ${y + r * 2} L${x - r * .6} ${y + r * .6} L${x - r * 2} ${y} L${x - r * .6} ${y - r * .6}Z" fill="${ink}"/>`).join('');
    default:
      return '';
  }
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function toteSvg({ bag, ink, motif, text, brode }) {
  const dark = isDark(bag);
  const seam = dark ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.12)';
  const handle = shade(bag, dark ? 18 : -22);
  let art = motif ? motifSvg(motif, ink) : '';
  if (text) {
    const size = text.length > 12 ? 17 : text.length > 7 ? 22 : 28;
    art += `<text x="100" y="168" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-weight="600" font-size="${size}" fill="${ink}"
      ${brode ? `stroke="${ink}" stroke-width=".6" stroke-dasharray="2 1.5"` : ''}>${esc(text)}</text>`;
  }
  return `<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
    <path d="M62 80 C62 20 138 20 138 80" fill="none" stroke="${handle}" stroke-width="11" stroke-linecap="round"/>
    <path d="M30 78 H170 L176 248 Q176 254 170 254 H30 Q24 254 24 248 Z" fill="${bag}"/>
    <path d="M30 78 H170 L171 92 H29 Z" fill="${seam}"/>
    <path d="M27 240 H173" stroke="${seam}" stroke-width="1.5" stroke-dasharray="4 4"/>
    ${art}
  </svg>`;
}

function hexToRgb(h) { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function isDark(h) { const [r, g, b] = hexToRgb(h); return (r * 299 + g * 587 + b * 114) / 1000 < 110; }
function shade(h, amt) {
  return '#' + hexToRgb(h).map(c => Math.max(0, Math.min(255, c + amt)).toString(16).padStart(2, '0')).join('');
}

// ---------- Hero ----------
document.getElementById('heroArt').innerHTML =
  toteSvg(PRODUCTS[0]) + toteSvg(PRODUCTS[1]);

// ---------- Collection ----------
const grid = document.getElementById('grid');
function renderGrid(filter = 'all') {
  grid.innerHTML = PRODUCTS.filter(p => filter === 'all' || p.type === filter).map((p, i) => `
    <article class="card" style="animation-delay:${i * 50}ms">
      <div class="card-art" style="background:${shade(p.bag, isDark(p.bag) ? 40 : -12)}">${toteSvg(p)}</div>
      <div class="card-body">
        <span class="tag">${p.type === 'brode' ? 'Brodé' : 'Imprimé'}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="card-foot">
          <span class="price">${p.price} €</span>
          <button class="add" data-id="${p.id}">Ajouter</button>
        </div>
      </div>
    </article>`).join('');
}
renderGrid();

document.getElementById('filters').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  document.querySelectorAll('#filters .chip').forEach(c => c.classList.toggle('active', c === b));
  renderGrid(b.dataset.f);
});
grid.addEventListener('click', e => {
  const b = e.target.closest('.add'); if (!b) return;
  const p = PRODUCTS.find(x => x.id === b.dataset.id);
  addToCart({ key: p.id, name: p.name, price: p.price, art: { bag: p.bag, ink: p.ink, motif: p.motif } });
});

// ---------- Personnalisation ----------
const perso = { bag: BAG_COLORS[0], ink: INK_COLORS[0], text: 'Ton prénom ici', style: 'imprime' };
const persoText = document.getElementById('persoText');

function swatches(id, colors, prop) {
  const el = document.getElementById(id);
  el.innerHTML = colors.map(c => `<button class="swatch${c === perso[prop] ? ' active' : ''}" style="background:${c}" data-c="${c}" aria-label="Couleur ${c}"></button>`).join('');
  el.addEventListener('click', e => {
    const b = e.target.closest('.swatch'); if (!b) return;
    perso[prop] = b.dataset.c;
    el.querySelectorAll('.swatch').forEach(s => s.classList.toggle('active', s === b));
    renderPerso();
  });
}
function renderPerso() {
  document.getElementById('persoPreview').innerHTML =
    toteSvg({ bag: perso.bag, ink: perso.ink, text: perso.text || ' ', brode: perso.style === 'brode' });
  document.getElementById('addPerso').textContent = `Ajouter au panier · ${PERSO_PRICE[perso.style]} €`;
}
swatches('bagColors', BAG_COLORS, 'bag');
swatches('inkColors', INK_COLORS, 'ink');
persoText.addEventListener('input', () => { perso.text = persoText.value; renderPerso(); });
document.getElementById('styleToggle').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  perso.style = b.dataset.s;
  document.querySelectorAll('#styleToggle .chip').forEach(c => c.classList.toggle('active', c === b));
  renderPerso();
});
document.getElementById('addPerso').addEventListener('click', () => {
  const text = perso.text.trim();
  if (!text) { toast('Écris un texte pour ton sac 🙂'); persoText.focus(); return; }
  addToCart({
    key: `perso-${perso.bag}-${perso.ink}-${perso.style}-${text}`,
    name: `Personnalisé « ${text} »`,
    sub: perso.style === 'brode' ? 'Brodé' : 'Imprimé',
    price: PERSO_PRICE[perso.style],
    art: { bag: perso.bag, ink: perso.ink, text, brode: perso.style === 'brode' },
  });
});
renderPerso();

// ---------- Panier ----------
let cart = [];
try { cart = JSON.parse(localStorage.getItem('lana-cart')) || []; } catch { cart = []; }

function saveCart() { try { localStorage.setItem('lana-cart', JSON.stringify(cart)); } catch {} }

function addToCart(item) {
  const found = cart.find(c => c.key === item.key);
  if (found) found.qty++; else cart.push({ ...item, qty: 1 });
  saveCart(); renderCart();
  const count = document.getElementById('cartCount');
  count.classList.remove('bump'); void count.offsetWidth; count.classList.add('bump');
  toast(`${item.name} ajouté au panier`);
}

function renderCart() {
  const list = document.getElementById('cartList');
  const n = cart.reduce((s, c) => s + c.qty, 0);
  const total = cart.reduce((s, c) => s + c.qty * c.price, 0);
  document.getElementById('cartCount').textContent = n;
  document.getElementById('cartTotal').textContent = `${total} €`;
  list.innerHTML = cart.length ? cart.map((c, i) => `
    <li>
      ${toteSvg(c.art)}
      <div><span class="name">${esc(c.name)}</span><span class="sub">${c.sub ? esc(c.sub) + ' · ' : ''}${c.price} €</span></div>
      <div class="qty">
        <button data-i="${i}" data-d="-1" aria-label="Retirer un">−</button>
        <span>${c.qty}</span>
        <button data-i="${i}" data-d="1" aria-label="Ajouter un">+</button>
      </div>
    </li>`).join('') : '<li class="empty">Ton panier est vide pour l\'instant.</li>';
}
document.getElementById('cartList').addEventListener('click', e => {
  const b = e.target.closest('button[data-i]'); if (!b) return;
  const item = cart[b.dataset.i];
  item.qty += Number(b.dataset.d);
  if (item.qty <= 0) cart.splice(b.dataset.i, 1);
  saveCart(); renderCart();
});
renderCart();

const drawer = document.getElementById('drawer');
const backdrop = document.getElementById('backdrop');
function openCart(open) {
  drawer.classList.toggle('open', open);
  backdrop.classList.toggle('show', open);
  drawer.setAttribute('aria-hidden', String(!open));
}
document.getElementById('cartBtn').addEventListener('click', () => openCart(true));
document.getElementById('closeCart').addEventListener('click', () => openCart(false));
backdrop.addEventListener('click', () => openCart(false));
document.addEventListener('keydown', e => { if (e.key === 'Escape') openCart(false); });

document.getElementById('checkout').addEventListener('click', () => {
  if (!cart.length) { toast('Ajoute d\'abord un tote bag 🙂'); return; }
  const lines = cart.map(c => `- ${c.qty} × ${c.name}${c.sub ? ' (' + c.sub + ')' : ''} — ${c.qty * c.price} €`);
  const total = cart.reduce((s, c) => s + c.qty * c.price, 0);
  const body = `Bonjour Lana,\n\nJe voudrais commander :\n${lines.join('\n')}\n\nTotal : ${total} €\n\nMon prénom :\nRetrait au Meux ou livraison ? :\nMon adresse (si livraison) :\n\nMerci !`;
  location.href = `mailto:${EMAIL_LANA}?subject=${encodeURIComponent('Commande de tote bags')}&body=${encodeURIComponent(body)}`;
});

// ---------- Contact ----------
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const body = `${f.get('message')}\n\n— ${f.get('nom')} (${f.get('email')})`;
  location.href = `mailto:${EMAIL_LANA}?subject=${encodeURIComponent('Message de ' + f.get('nom'))}&body=${encodeURIComponent(body)}`;
  toast('Ton application mail va s\'ouvrir ✉️');
});

// ---------- Menu mobile + divers ----------
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = !menu.classList.contains('open');
  menu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
});
menu.addEventListener('click', e => {
  if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
});

let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

document.getElementById('year').textContent = new Date().getFullYear();
