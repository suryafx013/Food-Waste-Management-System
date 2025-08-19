// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('navMenu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.setAttribute('aria-expanded', String(!expanded));
  });
}

// ----- Admin Easy Password Gate (client-side; demo only) -----
const ADMIN_PASSWORD = 'admin123'; // change this to your own password
const adminPanel = document.getElementById('adminPanel');
const adminLogin = document.getElementById('adminLogin');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminPass = document.getElementById('adminPass');
const adminLogout = document.getElementById('adminLogout');

function isAdmin() {
  return localStorage.getItem('isAdmin') === 'true';
}
function updateAdminUI() {
  if (!adminPanel || !adminLogin) return;
  const unlocked = isAdmin();
  adminPanel.style.display = unlocked ? '' : 'none';
  adminLogin.style.display = unlocked ? 'none' : '';
  if (adminLogout) adminLogout.style.display = unlocked ? '' : 'none';
}
adminLoginBtn?.addEventListener('click', () => {
  if ((adminPass?.value || '') === ADMIN_PASSWORD) {
    localStorage.setItem('isAdmin', 'true');
    updateAdminUI();
    alert('Admin unlocked!');
  } else {
    alert('Incorrect password');
  }
});
adminLogout?.addEventListener('click', () => {
  localStorage.removeItem('isAdmin');
  updateAdminUI();
});
updateAdminUI();

// ----- Donation demo storage (no backend) -----
const donationForm = document.getElementById('donationForm');
const historyTable = document.getElementById('historyTable')?.querySelector('tbody');
const adminTable = document.getElementById('adminTable')?.querySelector('tbody');
const deliveryTable = document.getElementById('deliveryTable')?.querySelector('tbody');

function getDonations() {
  return JSON.parse(localStorage.getItem('donations') || '[]');
}
function setDonations(data) {
  localStorage.setItem('donations', JSON.stringify(data));
}
function addDonation(d) {
  const data = getDonations();
  data.unshift(d);
  setDonations(data);
  renderAll();
}
function updateDonation(id, patch) {
  const data = getDonations();
  const i = data.findIndex(x => x.id === id);
  if (i !== -1) {
    data[i] = { ...data[i], ...patch };
    setDonations(data);
    renderAll();
  }
}

function renderHistory() {
  if (!historyTable) return;
  const data = getDonations().slice(0, 10);
  historyTable.innerHTML = data.map(d => (
    `<tr>
      <td>${d.foodType}</td>
      <td>${d.quantity}</td>
      <td>${d.status}</td>
      <td>${new Date(d.createdAt).toLocaleString()}</td>
    </tr>`
  )).join('') || '<tr><td colspan="4">No donations yet.</td></tr>';
}

function renderAdmin() {
  if (!adminTable) return;
  const data = getDonations().filter(d => d.status === 'Pending');
  adminTable.innerHTML = data.map(d => (
    `<tr>
      <td>${d.donorName}</td>
      <td>${d.foodType}</td>
      <td>${d.quantity}</td>
      <td>${d.pickupAddress}</td>
      <td>${d.readyBy}</td>
      <td>
        <button class="btn btn--primary" data-approve="${d.id}">Approve & Assign</button>
      </td>
    </tr>`
  )).join('') || '<tr><td colspan="6">No pending donations.</td></tr>';
}

function renderDelivery() {
  if (!deliveryTable) return;
  const data = getDonations().filter(d => d.status === 'Assigned' || d.status === 'Picked' || d.status === 'Delivered');
  deliveryTable.innerHTML = data.map(d => (
    `<tr>
      <td>${d.donorName}</td>
      <td>${d.foodType}</td>
      <td>${d.quantity}</td>
      <td>${d.pickupAddress}</td>
      <td>${d.status}</td>
      <td>
        ${d.status === 'Assigned' ? `<button class="btn btn--primary" data-pick="${d.id}">Pick Up</button>` : ''}
        ${d.status === 'Picked' ? `<button class="btn btn--primary" data-deliver="${d.id}">Mark Delivered</button>` : ''}
      </td>
    </tr>`
  )).join('') || '<tr><td colspan="6">No assigned orders.</td></tr>';
}

function renderAll() {
  renderHistory();
  renderAdmin();
  renderDelivery();
}

if (donationForm) {
  donationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(donationForm).entries());
    const donation = {
      id: 'd_' + Math.random().toString(36).slice(2),
      ...data,
      status: 'Pending',
      createdAt: Date.now()
    };
    addDonation(donation);
    alert('Donation submitted! (This demo saves to your browser only.)');
    donationForm.reset();
  });
}

document.addEventListener('click', (e) => {
  // Block admin actions unless unlocked
  const isActionBtn = e.target?.hasAttribute?.('data-approve') || e.target?.hasAttribute?.('data-pick') || e.target?.hasAttribute?.('data-deliver');
  if (isActionBtn && !isAdmin()) {
    e.preventDefault();
    alert('Admin only. Please unlock the admin panel first.');
    return;
  }
  const approveId = e.target?.getAttribute?.('data-approve');
  if (approveId) {
    updateDonation(approveId, { status: 'Assigned' });
    alert('Approved & assigned to delivery.');
  }
  const pickId = e.target?.getAttribute?.('data-pick');
  if (pickId) {
    updateDonation(pickId, { status: 'Picked' });
  }
  const deliverId = e.target?.getAttribute?.('data-deliver');
  if (deliverId) {
    updateDonation(deliverId, { status: 'Delivered' });
  }
});

renderAll();

// ----- Contact form (demo) -----
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thanks for contacting us! (Demo only)');
    contactForm.reset();
  });
}

// ----- Simple Chatbot -----
const chat = document.getElementById('chat');
const chatFab = document.getElementById('chatFab');
const chatClose = document.getElementById('chatClose');
const chatForm = document.getElementById('chatForm');
const chatLog = document.getElementById('chatLog');
const chatInput = document.getElementById('chatInput');

function botSay(text) {
  const el = document.createElement('div');
  el.className = 'chat__msg chat__msg--bot';
  el.textContent = text;
  chatLog.appendChild(el);
  chatLog.scrollTop = chatLog.scrollHeight;
}
function userSay(text) {
  const el = document.createElement('div');
  el.className = 'chat__msg chat__msg--user';
  el.textContent = text;
  chatLog.appendChild(el);
  chatLog.scrollTop = chatLog.scrollHeight;
}

const responses = [
  { k: /donate|how.*donate|food/i, a: 'Go to the Donate section, fill the form, and submit. Admin will approve and assign delivery.' },
  { k: /login|register/i, a: 'This demo skips real accounts. A full version would use PHP + MySQL for secure login.' },
  { k: /admin|ngo/i, a: 'Admins review incoming donations and assign pickups to delivery volunteers.' },
  { k: /deliver|pickup|map/i, a: 'Delivery sees assigned orders, picks up from donor location, and marks delivered.' },
  { k: /contact/i, a: 'Use the Contact section form at the bottom of the page.' },
  { k: /backend|php|mysql/i, a: 'A real backend can be built with PHP + MySQL + Apache (XAMPP). This demo runs entirely in your browser.' }
];

chatFab?.addEventListener('click', () => { chat.style.display = 'flex'; chatInput?.focus(); });
chatClose?.addEventListener('click', () => { chat.style.display = 'none'; });

chatForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  userSay(text);
  const found = responses.find(r => r.k.test(text));
  botSay(found ? found.a : 'Sorry, I can help with donating, admin, delivery, or contact. Try: "how to donate".');
  chatInput.value = '';
});
