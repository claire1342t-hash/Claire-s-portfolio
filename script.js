/* ─────────────────────────────────────────
   script.js  —  Claire Portfolio
   ───────────────────────────────────────── */

// ── Custom cursor ──────────────────────────
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});
function addCursorHover(el) {
  el.addEventListener('mouseenter', () => cursor.classList.add('big'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
}
document.querySelectorAll('button, a').forEach(addCursorHover);


// ── Page navigation ────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  const btnMap = { art: 'btn-art', contact: 'btn-contact' };
  if (btnMap[id]) document.getElementById(btnMap[id]).classList.add('active');
}


// ── Art works ──────────────────────────────
// ✏️  Add your works here.
// Each entry: { title, caption, src }
//   src  — path relative to index.html, e.g. "images/work1.jpg"
//           Leave as null to show a placeholder emoji instead.
const works = [
  { title: "台北市心理系聯合排球比賽",  caption: "我在前年台北市心理系聯合排球比賽中擔任美術設計的職位。在這份宣傳單中我選擇將心理系以心理「戲」的方式呈現並加上排球的元素來完成！",  src: "images/北心海報.png" },
  { title: "母親節卡片（正面）",  caption: "這是我在2024年母親節時參加學校母親節卡片設計競賽的投稿作品。我將母親化身成魔術師來強調每次東西不見時媽媽一瞬間就可以找到時的奇蹟。",       src: "images/mothersdaycardfront_page-0001拷貝.jpg" },
  { title: "母親節卡片（背面）",  caption: "2024.",       src: "images/mothersdaycardback_page-0001拷貝.jpg" },
  { title: "法國旅行隨筆",  caption: "在法國旅行時的隨筆",       src: "images/france.png" },
  { title: "7-11的打工時光",  caption: "這是我從高中到大學時在7-11打工時，每天站在櫃檯時看到的風景。",       src: "images/7-11.png" },
  { title: "宿舍的晚餐",  caption: "這是我在大一時，在宿舍所買的晚餐。當初只是想要紀錄晚餐吃什麼跟家人報備而已，每想到某天偶然看到後就決定把它畫下來！",       src: "images/riceball.jpg" },

];

function renderArt() {
  const grid = document.getElementById('artGrid');
  document.getElementById('artCount').textContent = works.length;

  if (works.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;padding:80px 50px;text-align:center;">
        <div style="font-size:3rem;margin-bottom:16px;">🎨</div>
        <p style="font-size:0.8rem;opacity:0.4;">No works yet — add entries in script.js.</p>
      </div>`;
    return;
  }

  grid.innerHTML = '';
  works.forEach((w, i) => {
    const card = document.createElement('div');
    card.className = 'art-card';
    card.style.animationDelay = (i * 0.07) + 's';
    card.innerHTML = `
      <div class="art-color-bar"></div>
      <div class="art-img-wrap">
        ${w.src
          ? `<img class="art-img" src="${w.src}" alt="${w.title}">`
          : `<div class="art-img" style="display:flex;align-items:center;justify-content:center;height:100%;background:#E8E8E0;font-size:3rem;">🖼</div>`
        }
        <div class="art-overlay"><div class="art-overlay-text">${w.caption}</div></div>
      </div>
      <div class="art-caption">
        <div class="art-caption-title">${w.title}</div>
        <div class="art-caption-note">${w.caption}</div>
      </div>`;

    // Click → open lightbox
    card.addEventListener('click', () => openLightbox(w));
    addCursorHover(card);
    grid.appendChild(card);
  });
}
  // Contact
  function updateChar() {
    const c = document.getElementById('msgBody').value.length;
    document.getElementById('charCount').textContent = c + ' chars';
  }
 
  async function sendMessage() {
    const from = document.getElementById('fromEmail').value.trim();
    const subject = document.getElementById('subjectLine').value.trim();
    const body = document.getElementById('msgBody').value.trim();
    if (!from) { showToast('Please enter your email!'); return; }
    if (!body) { showToast('Message is empty!'); return; }
 
    const btn = document.getElementById('sendBtn');
    btn.textContent = 'Sending...';
    btn.disabled = true;
 
    try {
      const res = await fetch('https://formspree.io/f/mojpwdak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: from, subject: subject || '(no subject)', message: body })
      });
 
      if (res.ok) {
        btn.textContent = 'Sent! ✓';
        btn.classList.add('sent');
        showToast('Message sent! ✨');
        document.getElementById('fromEmail').value = '';
        document.getElementById('subjectLine').value = '';
        document.getElementById('msgBody').value = '';
        document.getElementById('charCount').textContent = '0 chars';
        setTimeout(() => {
          btn.textContent = 'Send ↗';
          btn.classList.remove('sent');
          btn.disabled = false;
        }, 3000);
      } else {
        throw new Error('Failed');
      }
    } catch {
      showToast('Failed to send. Try again!');
      btn.textContent = 'Send ↗';
      btn.disabled = false;
    }
  }

    const lightbox = document.getElementById('lightbox');

function openLightbox(w) {
  document.getElementById('lightboxImg').src   = w.src || '';
  document.getElementById('lightboxImg').style.display = w.src ? 'block' : 'none';
  document.getElementById('lightboxTitle').textContent = w.title;
  document.getElementById('lightboxNote').textContent  = w.caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});


// ── Contact form ───────────────────────────
  function updateChar() {
    const c = document.getElementById('msgBody').value.length;
    document.getElementById('charCount').textContent = c + ' chars';
  }
 
  async function sendMessage() {
    const from = document.getElementById('fromEmail').value.trim();
    const subject = document.getElementById('subjectLine').value.trim();
    const body = document.getElementById('msgBody').value.trim();
    if (!from) { showToast('Please enter your email!'); return; }
    if (!body) { showToast('Message is empty!'); return; }
 
    const btn = document.getElementById('sendBtn');
    btn.textContent = 'Sending...';
    btn.disabled = true;
 
    try {
      const res = await fetch('https://formspree.io/f/mojpwdak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: from, subject: subject || '(no subject)', message: body })
      });
 
      if (res.ok) {
        btn.textContent = 'Sent! ✓';
        btn.classList.add('sent');
        showToast('Message sent! ✨');
        document.getElementById('fromEmail').value = '';
        document.getElementById('subjectLine').value = '';
        document.getElementById('msgBody').value = '';
        document.getElementById('charCount').textContent = '0 chars';
        setTimeout(() => {
          btn.textContent = 'Send ↗';
          btn.classList.remove('sent');
          btn.disabled = false;
        }, 3000);
      } else {
        throw new Error('Failed');
      }
    } catch {
      showToast('Failed to send. Try again!');
      btn.textContent = 'Send ↗';
      btn.disabled = false;
    }
  }


// ── Toast ──────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}


// ── Init ───────────────────────────────────
renderArt();
