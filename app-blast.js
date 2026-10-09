/* ==========================================================
   Fly Blaster — Complete WhatsApp Blast System
   Plain HTML/CSS/JS implementation (no build step required)
   ========================================================== */

/* ---------- Icons (inline SVG, stroke-based) ---------- */

const ICON = {
  plus: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  download: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>',
  userPlus: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6"/><path d="M19 8v6M22 11h-6"/></svg>',
  upload: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V9"/><path d="m7 14 5-5 5 5"/><path d="M5 21h14"/></svg>',
  pencil: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6M14 11v6"/></svg>',
  x: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m18 6-12 12M6 6l12 12"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  users: '<svg viewBox="0 0 24 24" width="12.5" height="12.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  fileText: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/></svg>',
  alert: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>',
  image: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>',
  messageSquare: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  send: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7Z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  checkCircle: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
  xCircle: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>',
  play: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  eye: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
  shield: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  info: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  mail: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
};

/* ---------- Pastel palette ---------- */

const PASTELS = [
  { bg: "#DFF6EC", text: "#0E8F60" },
  { bg: "#FFE6D6", text: "#C4692B" },
  { bg: "#DCEBFC", text: "#2B6DC4" },
  { bg: "#FBE1EE", text: "#C13A79" },
  { bg: "#EDE6FC", text: "#7350C4" },
];

function pastelFor(name) {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return PASTELS[sum % PASTELS.length];
}

function initialsFor(name) {
  return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?";
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-MY", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDateTime(d) {
  return new Date(d).toLocaleString("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/* ---------- CSV helpers ---------- */

function downloadTemplate() {
  const csv = "name,phone_number,email\nAhmad bin Ali,+60123456789,ahmad@email.com\nSiti Nurhaliza,+60129876543,siti@email.com\n";
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "contacts_template.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function cleanPhoneNumber(phone) {
  let cleaned = String(phone).replace(/[\s\-\(\)]/g, "");
  let digits = cleaned.replace(/\D/g, "");
  if (cleaned.startsWith("+")) {
    return "+" + digits;
  }
  if (digits.startsWith("0")) {
    return "+60" + digits.substring(1);
  }
  return "+" + digits;
}

function parseCsvText(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
  return lines.slice(1).map(line => {
    const cells = line.split(",");
    const row = {};
    headers.forEach((h, i) => { row[h] = (cells[i] || "").trim(); });
    return row;
  });
}

function extractPhoneNumbers(rows) {
  return rows
    .map(r => {
      const phone = r.phone_number || r.phone || r["phone number"];
      const name = r.name || '';
      const email = r.email || r["email address"] || '';
      if (!phone) return null;
      return { 
        name: String(name).trim(), 
        phone: String(phone).trim(),
        email: String(email).trim()
      };
    })
    .filter(Boolean);
}

function handleCsvFile(file, onDone) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const rows = parseCsvText(String(reader.result));
      const numbers = extractPhoneNumbers(rows);
      onDone(numbers, null);
    } catch (e) {
      onDone([], "Couldn't read that file. Please upload a .csv.");
    }
  };
  reader.onerror = () => onDone([], "Couldn't read that file. Please upload a .csv.");
  reader.readAsText(file);
}

function processCsvNumbers(numbers) {
  const group = groups.find(g => g.id === modal.groupId);
  const existingPhones = new Set(group ? group.contacts.map(c => cleanPhoneNumber(c.phone)) : []);
  
  let duplicatesInGroupCount = 0;
  let duplicatesInCsvCount = 0;
  const seenInCsv = new Set();
  const validNew = [];

  for (const c of numbers) {
    const cleaned = cleanPhoneNumber(c.phone);
    if (existingPhones.has(cleaned)) {
      duplicatesInGroupCount++;
    } else if (seenInCsv.has(cleaned)) {
      duplicatesInCsvCount++;
    } else {
      seenInCsv.add(cleaned);
      validNew.push(c);
    }
  }

  return {
    parsed: numbers,
    count: numbers.length,
    duplicatesInGroup: duplicatesInGroupCount,
    duplicatesInCsv: duplicatesInCsvCount,
    validNewCount: validNew.length,
    error: null
  };
}

/* ---------- App state ---------- */

/* Backend API client — replaces Supabase + n8n.
   The backend (backend/server.js) talks to the dedicated MySQL + WAHA. */
const API_BASE = "http://localhost:8091/api";

let authToken = localStorage.getItem("fly_blaster_token") || null;

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (authToken) headers["Authorization"] = "Bearer " + authToken;
  const res = await fetch(API_BASE + path, { ...options, headers });
  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const body = isJson ? await res.json() : null;
  if (!res.ok) {
    const err = new Error((body && (body.error || body.message)) || `API error ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return body;
}

async function syncFromBackend() {
  if (!authToken) return;
  try {
    const data = await api("/sync");

    // 1. Settings
    if (data.settings) {
      if (data.settings.daily_group_limit) {
        dailyStats.limit = parseInt(data.settings.daily_group_limit, 10);
      }
      if (data.settings.waha_session) {
        settingsState.wahaSession = data.settings.waha_session;
      }
    }

    // 2. Groups (with contacts + interaction flags)
    if (data.groups) {
      groups = data.groups.map(g => ({
        id: g.id,
        name: g.name,
        wahaJid: g.wahaJid || null,
        isImported: !!g.isImported,
        contacts: (g.contacts || []).map(c => ({
          id: c.id,
          name: c.name,
          phone: c.phone,
          email: c.email || "",
          hasInteraction: !!c.hasInteraction,
          interactions: c.interactions || { inbound: 0, outbound: 0, group: 0 }
        })),
        created: g.created || ""
      }));
    }

    // 3. Templates
    if (data.templates) {
      templates = data.templates.map(t => ({
        id: t.id,
        name: t.name,
        message: t.message,
        hasMedia: !!t.hasMedia,
        mediaUrl: t.mediaUrl || "",
        channel: t.channel || "whatsapp",
        emailSubject: t.emailSubject || "",
        created: t.created || ""
      }));
    }

    // 4. Campaigns
    if (data.campaigns) {
      campaigns = data.campaigns.map(c => ({
        id: c.id,
        name: c.name,
        groupIds: c.groupIds || [],
        groupId: c.groupId || null,
        templateId: c.templateId,
        status: c.status || 'pending',
        sentCount: c.sentCount || 0,
        failedCount: c.failedCount || 0,
        channel: c.channel || 'whatsapp',
        onlyInteractions: !!c.onlyInteractions,
        totalRecipients: c.totalRecipients || 0,
        created: c.created || "",
        started: c.started || null,
        completed: c.completed || null
      }));
    }

    // 5. Stats
    if (data.dailyStats) {
      dailyStats.limit = data.dailyStats.limit;
      dailyStats.messagesSent = data.dailyStats.messagesSent;
    }
    if (data.totalStats) {
      dashboardStats = data.totalStats;
    }
  } catch (err) {
    console.error("Failed to sync from backend:", err);
  }
}

let dashboardStats = { messagesSent: 0, totalContacts: 0, totalCampaigns: 0, failedMessages: 0 };

let isEditingGroup = false;
let selectedContacts = new Set();
let editingContactIndex = null;

let settingsState = JSON.parse(localStorage.getItem('fly_blaster_settings')) || {
  testPhoneNumber: "",
  isSandboxMode: false,
  cloudinaryCloudName: "dcvdsjpfn",
  cloudinaryUploadPreset: ""
};


let groups = [
  {
    id: uid(),
    name: "SPM Trial 2026 — Parents",
    contacts: [
      { name: "Ahmad bin Ali", phone: "+60123456789" },
      { name: "Siti Nurhaliza", phone: "+60129876543" },
      { name: "Wong Wei Lun", phone: "+60134567890" },
      { name: "Rajeswari Devi", phone: "+60187654321" },
      { name: "Lim Mei Ling", phone: "+60198765432" },
    ],
    created: "2026-06-28",
  },
  {
    id: uid(),
    name: "Form 4 Physics Batch",
    contacts: [
      { name: "Muhammad Azlan", phone: "+60111222333" },
      { name: "Priya Kumari", phone: "+60144556677" },
    ],
    created: "2026-07-02",
  },
];

let templates = [
  {
    id: uid(),
    name: "SPM Exam Reminder",
    message: "Hello! This is a reminder about your SPM trial exam on 15th March. Please arrive 30 minutes early. Good luck! 📚",
    hasMedia: false,
    mediaUrl: "",
    created: "2026-06-25",
  },
  {
    id: uid(),
    name: "Class Announcement with Photo",
    message: "Check out our latest class achievements! 🎉",
    hasMedia: true,
    mediaUrl: "https://via.placeholder.com/400x300/7350C4/FFFFFF?text=Class+Photo",
    created: "2026-06-20",
  },
];

let campaigns = [
  {
    id: uid(),
    name: "SPM Reminder March 2026",
    groupId: groups[0].id,
    templateId: templates[0].id,
    status: "completed", // pending, sending, completed, stopped
    totalRecipients: 5,
    sentCount: 5,
    failedCount: 0,
    created: "2026-07-01",
    started: "2026-07-01 10:30",
    completed: "2026-07-01 10:35",
  },
  {
    id: uid(),
    name: "Physics Class Update",
    groupId: groups[1].id,
    templateId: templates[1].id,
    status: "pending",
    totalRecipients: 2,
    sentCount: 0,
    failedCount: 0,
    created: "2026-07-08",
  },
];

// Mock message logs for demo
let messageLogs = [];

// Daily limit tracking
let dailyStats = {
  date: new Date().toISOString().split('T')[0],
  messagesSent: 5,
  limit: 100,
};

let activeNav = "dashboard";
let activeTemplateFilter = "all";
let activeCampaignFilter = "all";
let activeGroupId = null;
let activeCampaignId = null;
let modal = null;
let modalState = {};
let selectedDate = new Date();
let calendarView = "month"; // month or week

/* ---------- Navigation ---------- */

function renderNav() {
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.nav === activeNav);
  });
}

/* ---------- Page: Groups ---------- */

function renderGroupsPage() {
  const rows = groups.map(g => {
    const p = pastelFor(g.name);
    const contactCount = g.contacts.length;
    return `
      <div class="table-row" style="cursor: pointer;" data-action="view-group" data-id="${g.id}">
        <div class="group-cell">
          <div class="avatar" style="background:${p.bg};color:${p.text}">${initialsFor(g.name)}</div>
          <span class="group-name">${escapeHtml(g.name)}</span>
        </div>
        <div>
          <span class="count-badge" style="background:${p.bg};color:${p.text}">
            ${ICON.users} ${contactCount}
          </span>
        </div>
        <div class="created-cell">${formatDate(g.created)}</div>
        <div class="actions-cell">
          <button class="icon-btn" title="Edit group" data-action="edit-group" data-id="${g.id}">${ICON.pencil}</button>
          <button class="icon-btn red" title="Delete group" data-action="delete-group" data-id="${g.id}">${ICON.trash}</button>
        </div>
      </div>`;
  }).join("");

  const html = `
    <div class="wrap">
      <div class="page-header">
        <div>
          <h1>Contact Groups</h1>
          <p>Organize your contacts into groups for targeted campaigns.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-ghost" data-action="scan-interactions">${ICON.shield} Scan Prior Interactions</button>
          <button class="btn btn-ghost" data-action="import-whatsapp-group">${ICON.download} Import WhatsApp Group</button>
          <button class="btn btn-primary" data-action="create-group">${ICON.plus} New Group</button>
        </div>
      </div>

      <div class="table-card">
        <div class="table-head">
          <div>Group Name</div>
          <div>Contacts</div>
          <div>Created</div>
          <div style="text-align:right">Actions</div>
        </div>
        ${groups.length ? rows : `<div class="empty-state">No groups yet. Create one to start organizing contacts.</div>`}
      </div>
    </div>`;

  document.getElementById("page-groups").innerHTML = html;
}

/* ---------- Page: Group Detail (View Contacts) ---------- */

function renderGroupDetailPage(groupId) {
  const group = groups.find(g => g.id === groupId);
  if (!group) return;

  const p = pastelFor(group.name);

  const contactRows = group.contacts.map((contact, idx) => {
    const isEditingThisRow = editingContactIndex === idx;
    const gridCols = isEditingGroup ? '50px 1.5fr 1.2fr 1.5fr 80px' : '1.5fr 1.2fr 1.5fr 80px';

    return `
      <div class="table-row" style="grid-template-columns: ${gridCols};">
        ${isEditingGroup ? `
          <div style="display: flex; align-items: center; justify-content: center;">
            <input type="checkbox" class="contact-checkbox" data-index="${idx}" ${selectedContacts.has(idx) ? 'checked' : ''} data-action="toggle-contact-checkbox" />
          </div>
        ` : ''}
        <div class="contact-name-cell">
          ${isEditingThisRow ? `
            <input type="text" id="inline-contact-name" class="text-input" style="height: 32px; border: 1px solid var(--border); border-radius: 6px; padding: 4px 8px; font-size:13px; width: 100%; max-width: 200px;" value="${escapeHtml(contact.name)}" />
          ` : `
            <div class="avatar" style="background:${p.bg};color:${p.text};font-size:11px;width:32px;height:32px;">
              ${initialsFor(contact.name)}
            </div>
            ${escapeHtml(contact.name)}
          `}
        </div>
        <div class="contact-phone-cell">
          ${isEditingThisRow ? `
            <input type="text" id="inline-contact-phone" class="text-input" style="height: 32px; border: 1px solid var(--border); border-radius: 6px; padding: 4px 8px; font-size:13px; width: 100%; max-width: 200px;" value="${escapeHtml(contact.phone)}" />
          ` : `
            ${escapeHtml(contact.phone)}
          `}
        </div>
        <div class="contact-email-cell">
          ${isEditingThisRow ? `
            <input type="text" id="inline-contact-email" class="text-input" style="height: 32px; border: 1px solid var(--border); border-radius: 6px; padding: 4px 8px; font-size:13px; width: 100%; max-width: 200px;" value="${escapeHtml(contact.email || '')}" placeholder="e.g. parent@email.com" />
          ` : `
            ${escapeHtml(contact.email || '—')}
          `}
        </div>
        <div class="actions-cell">
          ${isEditingThisRow ? `
            <button class="icon-btn" title="Save changes" data-action="save-contact-inline" data-group-id="${group.id}" data-index="${idx}">${ICON.check}</button>
            <button class="icon-btn red" title="Cancel" data-action="cancel-contact-inline">${ICON.x}</button>
          ` : `
            <button class="icon-btn" title="Edit contact" data-action="edit-contact-inline" data-group-id="${group.id}" data-index="${idx}">${ICON.pencil}</button>
          `}
        </div>
      </div>`;
  }).join("");

  const allSelected = group.contacts.length > 0 && selectedContacts.size === group.contacts.length;

  const html = `
    <div class="wrap">
      <button class="btn-back-icon" data-action="back-to-groups" title="Back to groups">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>

      <div class="detail-header">
        <div class="detail-header-left">
          <div class="avatar" style="background:${p.bg};color:${p.text};width:48px;height:48px;font-size:18px;">
            ${initialsFor(group.name)}
          </div>
          <div>
            ${isEditingGroup ? `
              <input type="text" id="edit-group-name" class="text-input" style="font-size: 20px; font-weight: 750; height: 38px; width: 100%; max-width: 320px; margin-bottom: 6px; padding: 6px 12px; border: 1px solid var(--violet-border); border-radius: 8px;" value="${escapeHtml(group.name)}" />
            ` : `
              <h1>${escapeHtml(group.name)}</h1>
            `}
            <div class="detail-stats">
              <div class="stat-item">
                ${ICON.users}
                <span class="stat-value">${group.contacts.length}</span> contact${group.contacts.length !== 1 ? 's' : ''}
              </div>
              <div class="stat-item">
                ${ICON.clock}
                Created ${formatDate(group.created)}
              </div>
            </div>
          </div>
        </div>
        <div class="header-actions">
          ${isEditingGroup ? `
            <button class="btn btn-primary" data-action="save-group-inline" data-id="${group.id}">${ICON.check} Save</button>
            <button class="btn btn-ghost" data-action="cancel-group-inline">Cancel</button>
          ` : `
            <button class="btn btn-ghost" data-action="edit-group" data-id="${group.id}">${ICON.pencil} Edit Group</button>
            <button class="btn btn-primary" data-action="add-contact-to-group-inline" data-id="${group.id}">${ICON.userPlus} Add Contact</button>
          `}
        </div>
      </div>

      <div class="table-card ${isEditingGroup ? 'edit-active' : ''}">
        <div class="table-head" style="grid-template-columns: ${isEditingGroup ? '50px 1.5fr 1.2fr 1.5fr 80px' : '1.5fr 1.2fr 1.5fr 80px'};">
          ${isEditingGroup ? `
            <div style="display: flex; align-items: center; justify-content: center;">
              <input type="checkbox" id="select-all-contacts" ${allSelected ? 'checked' : ''} data-action="toggle-select-all-contacts" />
            </div>
          ` : ''}
          <div>Name</div>
          <div>Phone Number</div>
          <div>Email</div>
          <div style="text-align:right; display: flex; justify-content: flex-end; align-items: center; gap: 12px;">
            ${isEditingGroup && selectedContacts.size > 0 ? `
              <button class="btn btn-danger-sm" data-action="delete-selected-contacts" style="background:var(--red); color:white; border:none; border-radius:6px; padding:5px 10px; font-size:11px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:4px; height: 26px;">${ICON.trash} Delete Checked (${selectedContacts.size})</button>
            ` : ''}
            <span>Actions</span>
          </div>
        </div>
        ${group.contacts.length ? contactRows : `<div class="empty-state">No contacts in this group yet. Add some to get started.</div>`}
      </div>
    </div>`;

  document.getElementById("page-group-detail").innerHTML = html;
}

/* ---------- Page: Dashboard ---------- */

function renderDashboardPage() {
  const totalCampaigns = campaigns.length;
  const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;
  const totalSent = campaigns.reduce((sum, c) => sum + c.sentCount, 0);
  const totalFailed = campaigns.reduce((sum, c) => sum + c.failedCount, 0);

  const remaining = dailyStats.limit - dailyStats.messagesSent;
  const percentage = (dailyStats.messagesSent / dailyStats.limit) * 100;

  const html = `
    <div class="wrap">
      <div class="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your WhatsApp blast activities.</p>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card-large">
          <div class="stat-card-icon stat-card-success">${ICON.send}</div>
          <div class="stat-card-content">
            <div class="stat-card-value">${totalSent}</div>
            <div class="stat-card-label">Total Messages Sent</div>
          </div>
        </div>
        <div class="stat-card-large">
          <div class="stat-card-icon stat-card-pending">${ICON.users}</div>
          <div class="stat-card-content">
            <div class="stat-card-value">${groups.reduce((sum, g) => sum + g.contacts.length, 0)}</div>
            <div class="stat-card-label">Total Contacts</div>
          </div>
        </div>
        <div class="stat-card-large">
          <div class="stat-card-icon" style="background: var(--sky-bg); color: var(--sky-text);">${ICON.fileText}</div>
          <div class="stat-card-content">
            <div class="stat-card-value">${totalCampaigns}</div>
            <div class="stat-card-label">Total Campaigns</div>
          </div>
        </div>
        <div class="stat-card-large">
          <div class="stat-card-icon stat-card-failed">${ICON.xCircle}</div>
          <div class="stat-card-content">
            <div class="stat-card-value">${totalFailed}</div>
            <div class="stat-card-label">Failed Messages</div>
          </div>
        </div>
      </div>

      <div class="dashboard-row">
        <div class="dashboard-panel">
          <div class="panel-header">
            <h2>Today's Sending Limit</h2>
          </div>
          <div class="panel-body">
            <div class="limit-progress">
              <div class="limit-bar">
                <div class="limit-fill ${percentage >= 80 ? 'limit-warning' : ''}" style="width: ${percentage}%"></div>
              </div>
              <div class="limit-stats">
                <div class="limit-stat">
                  <span class="limit-value">${dailyStats.messagesSent}</span>
                  <span class="limit-label">Sent</span>
                </div>
                <div class="limit-stat">
                  <span class="limit-value">${remaining}</span>
                  <span class="limit-label">Remaining</span>
                </div>
                <div class="limit-stat">
                  <span class="limit-value">${dailyStats.limit}</span>
                  <span class="limit-label">Limit</span>
                </div>
              </div>
            </div>
            ${percentage >= 80 ? `
              <div class="alert-inline ${percentage >= 100 ? 'alert-danger' : 'alert-warning'}">
                ${ICON.alert} ${percentage >= 100 ? 'Daily limit reached! Stop sending to avoid ban.' : `Warning: ${remaining} messages remaining today.`}
              </div>
            ` : ''}
          </div>
        </div>

        <div class="dashboard-panel">
          <div class="panel-header">
            <h2>Recent Campaigns</h2>
            <button class="btn-text" data-action="nav" data-nav="campaign">View all</button>
          </div>
          <div class="panel-body">
            ${campaigns.slice(0, 5).map(c => {
    const statusBadge = {
      pending: `<span class="status-badge status-pending">${ICON.clock} Pending</span>`,
      sending: `<span class="status-badge status-sending">${ICON.send} Sending</span>`,
      completed: `<span class="status-badge status-completed">${ICON.checkCircle} Completed</span>`,
      stopped: `<span class="status-badge status-stopped">${ICON.xCircle} Stopped</span>`,
    };
    return `
                <div class="campaign-item" data-action="view-campaign" data-id="${c.id}" style="cursor:pointer;">
                  <div class="campaign-item-info">
                    <div class="campaign-item-name">${escapeHtml(c.name)}</div>
                    <div class="campaign-item-meta">${c.sentCount}/${c.totalRecipients} sent</div>
                  </div>
                  ${statusBadge[c.status]}
                </div>
              `;
  }).join('')}
            ${campaigns.length === 0 ? '<div class="empty-state-small">No campaigns yet</div>' : ''}
          </div>
        </div>
      </div>
    </div>`;

  document.getElementById("page-dashboard").innerHTML = html;
}

/* ---------- Page: Templates ---------- */

function renderTemplatesPage() {
  const filteredTemplates = templates.filter(t => activeTemplateFilter === 'all' || t.channel === activeTemplateFilter);

  const rows = filteredTemplates.map(t => {
    const isEmail = t.channel === 'email';
    return `
      <div class="template-card-compact">
        <div class="template-compact-left">
          ${isEmail ? `<div class="template-thumb template-thumb-text" style="color:var(--blue); background:#e0f2fe;">${ICON.mail}</div>` : 
            (t.hasMedia ? `<div class="template-thumb"><img src="${t.mediaUrl}" alt="Preview" /></div>` :
              `<div class="template-thumb template-thumb-text">${ICON.messageSquare}</div>`)}
          <div class="template-compact-info">
            <div class="template-compact-name">${escapeHtml(t.name)}</div>
            <div class="template-compact-preview">
              ${isEmail && t.emailSubject ? `<div style="font-size: 11.5px; font-weight: 700; color: var(--text-muted); margin-bottom: 2px;">Subject: ${escapeHtml(t.emailSubject)}</div>` : ''}
              ${escapeHtml(t.message.substring(0, 80))}${t.message.length > 80 ? '...' : ''}
            </div>
            <div class="template-compact-meta" style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
              <span style="font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 12px; background: ${isEmail ? '#f0f9ff' : '#f0fdf4'}; color: ${isEmail ? '#0284c7' : '#16a34a'}; border: 1px solid ${isEmail ? '#e0f2fe' : '#dcfce7'}; display: inline-flex; align-items: center; justify-content: center; line-height: 1.2;">
                ${isEmail ? 'Email' : 'WhatsApp'}
              </span>
              <span>${isEmail ? 'Subject & Body' : (t.hasMedia ? 'With media' : 'Text only')} • Created ${formatDate(t.created)}</span>
            </div>
          </div>
        </div>
        <div class="template-compact-actions">
          <button class="btn btn-ghost-sm" data-action="edit-template" data-id="${t.id}">${ICON.pencil} Edit</button>
          <button class="icon-btn red" title="Delete" data-action="delete-template" data-id="${t.id}">${ICON.trash}</button>
        </div>
      </div>`;
  }).join("");

  const html = `
    <div class="wrap">
      <div class="page-header">
        <div>
          <h1>Message Templates</h1>
          <p>Create reusable message templates for your campaigns.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" data-action="create-template">${ICON.plus} New Template</button>
        </div>
      </div>

      <div class="filter-bar" style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid var(--border-soft); padding-bottom: 12px;">
        <button class="filter-pill ${activeTemplateFilter === 'all' ? 'active' : ''}" data-action="filter-templates" data-value="all" style="background: none; border: none; padding: 6px 14px; font-size: 13.5px; font-weight: 600; cursor: pointer; color: ${activeTemplateFilter === 'all' ? 'var(--violet)' : 'var(--text-muted)'}; border-bottom: 2px solid ${activeTemplateFilter === 'all' ? 'var(--violet)' : 'transparent'}; border-radius: 0;">All</button>
        <button class="filter-pill ${activeTemplateFilter === 'whatsapp' ? 'active' : ''}" data-action="filter-templates" data-value="whatsapp" style="background: none; border: none; padding: 6px 14px; font-size: 13.5px; font-weight: 600; cursor: pointer; color: ${activeTemplateFilter === 'whatsapp' ? 'var(--violet)' : 'var(--text-muted)'}; border-bottom: 2px solid ${activeTemplateFilter === 'whatsapp' ? 'var(--violet)' : 'transparent'}; border-radius: 0;">WhatsApp</button>
        <button class="filter-pill ${activeTemplateFilter === 'email' ? 'active' : ''}" data-action="filter-templates" data-value="email" style="background: none; border: none; padding: 6px 14px; font-size: 13.5px; font-weight: 600; cursor: pointer; color: ${activeTemplateFilter === 'email' ? 'var(--violet)' : 'var(--text-muted)'}; border-bottom: 2px solid ${activeTemplateFilter === 'email' ? 'var(--violet)' : 'transparent'}; border-radius: 0;">Email</button>
      </div>

      <div class="templates-list">
        ${filteredTemplates.length ? rows : `<div class="empty-state-card" style="border: 2px dashed var(--border); border-radius: 12px; padding: 40px; text-align: center; color: var(--text-muted);">No templates match the selected filter.</div>`}
      </div>
    </div>`;

  document.getElementById("page-templates").innerHTML = html;
}

/* ---------- Page: Campaigns ---------- */

function renderCampaignsPage() {
  const remaining = dailyStats.limit - dailyStats.messagesSent;
  const percentage = (dailyStats.messagesSent / dailyStats.limit) * 100;

  const statusBadge = (status) => {
    const badges = {
      pending: `<span class="status-badge status-pending">${ICON.clock} Pending</span>`,
      sending: `<span class="status-badge status-sending">${ICON.send} Sending</span>`,
      completed: `<span class="status-badge status-completed">${ICON.checkCircle} Completed</span>`,
      stopped: `<span class="status-badge status-stopped">${ICON.xCircle} Stopped</span>`,
    };
    return badges[status] || badges.pending;
  };

  const filteredCampaigns = campaigns.filter(c => activeCampaignFilter === 'all' || c.channel === activeCampaignFilter);

  const rows = filteredCampaigns.map(c => {
    const group = groups.find(g => g.id === c.groupId);
    const template = templates.find(t => t.id === c.templateId);
    const p = pastelFor(c.name);

    return `
      <div class="campaign-row">
        <div class="campaign-row-cell campaign-name-cell">
          <div class="avatar" style="background:${p.bg};color:${p.text}">${initialsFor(c.name)}</div>
          <div>
            <div class="campaign-title" style="font-size: 14.5px; font-weight: 650; color: var(--text); margin-bottom: 2px;">
              ${escapeHtml(c.name)}
            </div>
            <div class="campaign-meta" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 4px;">
              <span style="font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 12px; background: ${c.channel === 'email' ? '#f0f9ff' : '#f0fdf4'}; color: ${c.channel === 'email' ? '#0284c7' : '#16a34a'}; border: 1px solid ${c.channel === 'email' ? '#e0f2fe' : '#dcfce7'}; display: inline-flex; align-items: center; justify-content: center; line-height: 1.2;">
                ${c.channel === 'email' ? 'Email' : 'WhatsApp'}
              </span>
              <span style="color: var(--text-muted); font-size: 12.5px;">
                ${group?.name || 'Unknown Group'} • ${template?.name || 'Unknown Template'}
              </span>
            </div>
          </div>
        </div>
        <div class="campaign-row-cell campaign-status-cell">
          ${statusBadge(c.status)}
        </div>
        <div class="campaign-row-cell campaign-progress-cell">
          <span class="progress-text">${c.sentCount}/${c.totalRecipients} sent</span>
          ${c.failedCount > 0 ? `<span class="failed-text">${c.failedCount} failed</span>` : ''}
        </div>
        <div class="campaign-row-cell campaign-date-cell">
          <span class="date-text">${formatDate(c.created)}</span>
        </div>
        <div class="campaign-row-cell campaign-actions-cell">
          <button class="btn btn-ghost-sm" data-action="view-campaign" data-id="${c.id}">${ICON.eye} View</button>
          ${c.status === 'pending' ? `<button class="btn btn-primary-sm" data-action="start-campaign" data-id="${c.id}">${ICON.play} Start</button>` : ''}
          <button class="icon-btn red" title="Delete campaign" data-action="delete-campaign" data-id="${c.id}">${ICON.trash}</button>
        </div>
      </div>`;
  }).join("");

  const html = `
    <div class="wrap">
      <div class="page-header">
        <div>
          <h1>Campaigns</h1>
          <p>Create and manage your WhatsApp/Email blast campaigns.</p>
        </div>
        <div class="header-actions" style="display: flex; align-items: center; gap: 16px;">
          <div class="daily-counter">
            <span class="counter-label">Today:</span>
            <span class="counter-value ${percentage >= 80 ? 'counter-warning' : ''}">${dailyStats.messagesSent}/${dailyStats.limit}</span>
          </div>
          <button class="btn btn-primary" data-action="create-campaign">${ICON.plus} New Campaign</button>
        </div>
      </div>

      <div class="filter-bar" style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid var(--border-soft); padding-bottom: 12px;">
        <button class="filter-pill ${activeCampaignFilter === 'all' ? 'active' : ''}" data-action="filter-campaigns" data-value="all" style="background: none; border: none; padding: 6px 14px; font-size: 13.5px; font-weight: 600; cursor: pointer; color: ${activeCampaignFilter === 'all' ? 'var(--violet)' : 'var(--text-muted)'}; border-bottom: 2px solid ${activeCampaignFilter === 'all' ? 'var(--violet)' : 'transparent'}; border-radius: 0;">All</button>
        <button class="filter-pill ${activeCampaignFilter === 'whatsapp' ? 'active' : ''}" data-action="filter-campaigns" data-value="whatsapp" style="background: none; border: none; padding: 6px 14px; font-size: 13.5px; font-weight: 600; cursor: pointer; color: ${activeCampaignFilter === 'whatsapp' ? 'var(--violet)' : 'var(--text-muted)'}; border-bottom: 2px solid ${activeCampaignFilter === 'whatsapp' ? 'var(--violet)' : 'transparent'}; border-radius: 0;">WhatsApp</button>
        <button class="filter-pill ${activeCampaignFilter === 'email' ? 'active' : ''}" data-action="filter-campaigns" data-value="email" style="background: none; border: none; padding: 6px 14px; font-size: 13.5px; font-weight: 600; cursor: pointer; color: ${activeCampaignFilter === 'email' ? 'var(--violet)' : 'var(--text-muted)'}; border-bottom: 2px solid ${activeCampaignFilter === 'email' ? 'var(--violet)' : 'transparent'}; border-radius: 0;">Email</button>
      </div>

      <div class="campaigns-table">
        <div class="campaigns-table-header">
          <div class="campaign-row-cell campaign-name-cell">Campaign</div>
          <div class="campaign-row-cell campaign-status-cell">Status</div>
          <div class="campaign-row-cell campaign-progress-cell">Progress</div>
          <div class="campaign-row-cell campaign-date-cell">Created</div>
          <div class="campaign-row-cell campaign-actions-cell">Actions</div>
        </div>
        ${filteredCampaigns.length ? rows : `<div class="empty-state">No campaigns match the selected filter.</div>`}
      </div>
    </div>`;

  document.getElementById("page-campaigns").innerHTML = html;
}

/* ---------- Page: Campaign Detail (View Status) ---------- */

function renderCampaignDetailPage(campaignId) {
  const campaign = campaigns.find(c => c.id === campaignId);
  if (!campaign) return;

  const groupIds = campaign.groupIds || (campaign.groupId ? [campaign.groupId] : []);
  const campaignGroups = groups.filter(g => groupIds.includes(g.id));
  const groupNames = campaignGroups.map(g => g.name).join(", ") || "Unknown";
  const template = templates.find(t => t.id === campaign.templateId);

  const statusBadge = {
    pending: `<span class="status-badge status-pending">${ICON.clock} Pending</span>`,
    sending: `<span class="status-badge status-sending">${ICON.send} Sending</span>`,
    completed: `<span class="status-badge status-completed">${ICON.checkCircle} Completed</span>`,
    stopped: `<span class="status-badge status-stopped">${ICON.xCircle} Stopped</span>`,
  };


  // Generate unique contacts from all groups
  const uniqueContactsMap = {};
  campaignGroups.forEach(g => {
    g.contacts.forEach(c => {
      uniqueContactsMap[c.phone] = c;
    });
  });
  const campaignContacts = Object.values(uniqueContactsMap);

  const logs = campaignContacts.map((contact, idx) => ({
    name: contact.name,
    phone: contact.phone,
    status: campaign.status === 'completed' ? 'sent' : (campaign.status === 'sending' && idx < 2 ? 'sent' : 'pending'),
    sentAt: campaign.status === 'completed' ? campaign.completed : null,
  }));

  const logRows = logs.map(log => {
    const statusBadge = {
      pending: `<span class="status-badge status-pending">${ICON.clock} Pending</span>`,
      sent: `<span class="status-badge status-completed">${ICON.checkCircle} Sent</span>`,
      failed: `<span class="status-badge status-stopped">${ICON.xCircle} Failed</span>`,
    };

    return `
      <div class="table-row">
        <div class="contact-name-cell">${escapeHtml(log.name || '—')}</div>
        <div class="contact-phone-cell">${escapeHtml(log.phone)}</div>
        <div>${statusBadge[log.status]}</div>
        <div class="created-cell">${log.sentAt ? formatDateTime(log.sentAt) : '—'}</div>
      </div>`;
  }).join("");

  const html = `
    <div class="wrap">
      <button class="btn-back-icon" data-action="back-to-campaigns" title="Back to campaigns">${ICON.arrowLeft}</button>

      <div class="detail-header">
        <div class="detail-header-left">
          <h1>${escapeHtml(campaign.name)}</h1>
          <div class="detail-stats">
            <div class="stat-item">
              ${statusBadge[campaign.status]}
            </div>
            <div class="stat-item">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>
              <span class="stat-value">${campaign.totalRecipients}</span> recipients
            </div>
            <div class="stat-item">
              ${ICON.users}
              Groups: <strong>${escapeHtml(groupNames)}</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="campaign-stats-cards">
        <div class="stat-card">
          <div class="stat-card-icon stat-card-pending">${ICON.clock}</div>
          <div class="stat-card-content">
            <div class="stat-card-value">${campaign.totalRecipients - campaign.sentCount - campaign.failedCount}</div>
            <div class="stat-card-label">Pending</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon stat-card-success">${ICON.checkCircle}</div>
          <div class="stat-card-content">
            <div class="stat-card-value">${campaign.sentCount}</div>
            <div class="stat-card-label">Sent</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon stat-card-failed">${ICON.xCircle}</div>
          <div class="stat-card-content">
            <div class="stat-card-value">${campaign.failedCount}</div>
            <div class="stat-card-label">Failed</div>
          </div>
        </div>
      </div>

      <div class="table-card">
        <div class="table-head">
          <div>Name</div>
          <div>Phone Number</div>
          <div>Status</div>
          <div>Sent At</div>
        </div>
        ${logRows}
      </div>
    </div>`;

  document.getElementById("page-campaign-detail").innerHTML = html;
}

/* ---------- Page: Blasting ---------- */

function renderBlastingPage() {
  const html = `
    <div class="wrap">
      <div class="placeholder-card" style="text-align: center; padding: 48px 24px; background: var(--card-bg); border-radius: 16px; border: 1px dashed var(--border); max-width: 500px; margin: 60px auto; box-shadow: var(--shadow-sm);">
        <div style="font-size: 48px; margin-bottom: 16px;">🚀</div>
        <h2 style="margin-bottom: 12px; font-weight: 650; color: var(--text-main); font-size: 24px;">Coming Soon</h2>
        <p style="color: var(--text-muted); font-size: 14.5px; line-height: 1.6; margin: 0;">
          The <strong>Quick Blast</strong> feature is currently under development and will be available in a future update.
          <br><br>
          In the meantime, please navigate to the <strong>Campaigns</strong> tab to configure and launch your WhatsApp campaigns.
        </p>
      </div>
    </div>`;

  document.getElementById("page-blasting").innerHTML = html;
}

/* ---------- Page: Settings ---------- */

function renderSettingsPage() {
  const html = `
    <div class="wrap">
      <div class="header-row" style="margin-bottom: 24px;">
        <div>
          <h1>Settings</h1>
          <p>Manage your WhatsApp senders and blast configuration.</p>
        </div>
      </div>

      <div class="settings-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start;">
        <!-- Configuration Card -->
        <div class="table-card" style="padding: 24px; display: flex; flex-direction: column; gap: 20px;">
          <h3 style="font-size: 16px; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 8px; color: var(--text);">
            ${ICON.info} Blast Configuration
          </h3>

          <div class="field">
            <label class="field-label" style="font-weight: 600; font-size: 12px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; display: block;">Default WAHA Session</label>
            <input type="text" id="settings-waha-session" class="text-input" placeholder="e.g. Tester" value="${escapeHtml(settingsState.wahaSession || 'Tester')}" style="height: 38px; border-radius: 8px; border: 1px solid var(--border); padding: 8px 12px; font-size: 13.5px; width: 100%; max-width: 320px;" />
            <p style="font-size: 11px; color: var(--text-muted); margin-top: 4px; line-height: 1.4;">
              Must match the session name configured in the backend (WAHA).
            </p>
          </div>

          <div class="field" style="margin-top: 8px;">
            <label class="field-label" style="font-weight: 600; font-size: 12px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; display: block;">Daily Group Limit</label>
            <input type="number" id="settings-group-limit" class="text-input" placeholder="e.g. 5" value="${dailyStats.limit || 5}" style="height: 38px; border-radius: 8px; border: 1px solid var(--border); padding: 8px 12px; font-size: 13.5px; width: 100%; max-width: 320px;" />
            <p style="font-size: 11px; color: var(--text-muted); margin-top: 4px; line-height: 1.4;">
              Maximum number of unique contact groups targeted per day (default is <strong>5</strong>).
            </p>
          </div>

          <button class="btn btn-primary" id="save-settings-btn" style="align-self: flex-start; margin-top: 10px;">${ICON.check} Save Settings</button>
        </div>

        <!-- WhatsApp Senders Table (like WAHA session list) -->
        <div class="table-card" style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
            <h3 style="font-size: 16px; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 8px; color: var(--text);">
              ${ICON.messageSquare} WhatsApp Senders
            </h3>
            <button class="btn btn-primary" id="waha-add-sender-btn" style="display: inline-flex; align-items: center; gap: 6px;">${ICON.plus} Add Sender</button>
          </div>
          <p style="font-size: 12.5px; color: var(--text-muted); margin: 0; line-height: 1.5;">
            Each row is a WhatsApp number you can scan to connect as a sender. Scan the QR with WhatsApp, then save or delete.
          </p>
          <div id="senders-table-wrap">
            <div style="font-size: 13px; color: var(--text-muted); padding: 12px 0;">Loading senders...</div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById("page-settings").innerHTML = html;

  // Load senders table
  loadSendersTable();

  // Add sender
  document.getElementById("waha-add-sender-btn")?.addEventListener("click", () => renderAddSenderModal());

  const saveBtn = document.getElementById("save-settings-btn");
  saveBtn.addEventListener("click", async () => {
    const wahaSession = document.getElementById("settings-waha-session").value.trim() || "Tester";
    const groupLimit = parseInt(document.getElementById("settings-group-limit").value.trim(), 10) || 5;

    settingsState.wahaSession = wahaSession;
    localStorage.setItem("fly_blaster_settings", JSON.stringify(settingsState));

    try {
      await api("/settings", { method: "PUT", body: JSON.stringify({ waha_session: wahaSession, daily_group_limit: String(groupLimit) }) });
    } catch (err) {
      console.error("Failed to save settings to backend:", err);
    }

    alert("Settings saved successfully!");
    await syncFromBackend();
    renderPage();
  });
}

/* ---------- Senders table (WAHA-style) ---------- */

async function loadSendersTable() {
  const wrap = document.getElementById("senders-table-wrap");
  if (!wrap) return;
  let senders = [];
  try {
    senders = await api("/senders");
  } catch (err) {
    wrap.innerHTML = `<div style="font-size: 13px; color: var(--red); padding: 12px 0;">Failed to load senders: ${escapeHtml(err.message)}</div>`;
    return;
  }

  if (senders.length === 0) {
    wrap.innerHTML = `<div style="font-size: 13px; color: var(--text-muted); padding: 12px 0;">No senders yet. Click "Add Sender" to scan your first WhatsApp number.</div>`;
    return;
  }

  const rows = senders.map(s => {
    const dotColor = s.connected ? "#10B981" : (s.error ? "#EF4444" : "#F59E0B");
    const statusText = s.connected ? "Connected" : (s.error ? "Unreachable" : "Not connected");
    return `
      <div class="table-row" data-sender-id="${s.id}" style="display: grid; grid-template-columns: 1fr auto auto auto; gap: 12px; align-items: center; padding: 12px 14px; border-bottom: 1px solid var(--border-soft);">
        <div style="min-width: 0;">
          <div style="font-weight: 600; font-size: 13.5px; color: var(--text); display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            ${escapeHtml(s.name)}
            ${s.isDefault ? `<span style="font-size: 10px; background: var(--violet-light); color: var(--violet); padding: 2px 6px; border-radius: 6px; font-weight: 700;">DEFAULT</span>` : ''}
          </div>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px; word-break: break-all;">
            ${escapeHtml(s.phone || '— not scanned yet —')} · <code style="background:var(--bg); padding:1px 5px; border-radius:4px;">${escapeHtml(s.wahaSession)}</code>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--text-muted); white-space: nowrap;">
          <span style="display:inline-block; width:9px; height:9px; border-radius:50%; background:${dotColor};"></span>
          ${statusText}
        </div>
        <div style="display: flex; gap: 6px;">
          <button class="btn-chip" data-action="scan-sender" data-id="${s.id}" style="white-space: nowrap; padding: 4px 10px; font-size: 12px;">${ICON.messageSquare} Scan</button>
        </div>
        <div style="display: flex; gap: 6px;">
          <button class="icon-btn" title="Save / set default" data-action="save-sender" data-id="${s.id}" style="${s.isDefault ? 'opacity:0.4; pointer-events:none;' : ''}">${ICON.check}</button>
          <button class="icon-btn red" title="Delete sender" data-action="delete-sender" data-id="${s.id}">${ICON.trash}</button>
        </div>
      </div>`;
  }).join("");

  wrap.innerHTML = `<div style="border: 1px solid var(--border); border-radius: 10px; overflow: hidden;">
    <div class="table-head" style="display: grid; grid-template-columns: 1fr auto auto auto; gap: 12px; padding: 10px 14px; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.4px; background: var(--bg); border-bottom: 1px solid var(--border);">
      <div>Sender</div><div>Status</div><div>Action</div><div>Manage</div>
    </div>
    ${rows}
  </div>`;
}

/* ---------- Modal: Add Sender ---------- */

function renderAddSenderModal() {
  modal = { type: "add-sender" };
  const body = `
    <div style="display: flex; flex-direction: column; gap: 14px;">
      <div class="field">
        <label class="field-label">Sender Name <span class="req">*</span></label>
        <input id="add-sender-name" class="text-input" type="text" placeholder="e.g. Suffian Flyhigh" style="height: 38px; border-radius: 8px; border: 1px solid var(--border); padding: 8px 12px; font-size: 13.5px; width: 100%;" />
        <p style="font-size: 11px; color: var(--text-muted); margin-top: 4px; line-height: 1.4;">
          A label for this WhatsApp sender (also used as the WAHA session name).
        </p>
      </div>
      <div id="add-sender-result" style="font-size: 13px; color: var(--text-muted);"></div>
    </div>
  `;
  const footer = `
    <button class="btn btn-ghost" data-action="close-modal">Cancel</button>
    <button class="btn btn-primary" id="add-sender-confirm" data-action="add-sender-confirmed">${ICON.check} Create & Scan</button>
  `;
  document.getElementById("modal-root").innerHTML = modalShell({
    title: "Add WhatsApp Sender",
    bodyHtml: body,
    footerHtml: footer,
    narrow: true
  });
}

/* ---------- Modal: Scan Sender QR ---------- */

function renderScanSenderQrModal(senderId, senderName) {
  modal = { type: "scan-sender", senderId };
  const body = `
    <div style="display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; padding: 8px 0;">
      <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: var(--text);">${escapeHtml(senderName)}</h3>
      <p style="font-size: 13px; color: var(--text-muted); margin: 0; line-height: 1.5;">
        Open <strong>WhatsApp</strong> → <strong>Linked Devices</strong> → <strong>Link a Device</strong> and scan.
      </p>
      <div id="scan-qr-box" style="width: 260px; height: 260px; border: 1px solid var(--border); border-radius: 12px; background: white; display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 13px;">
        Connecting to WAHA...
      </div>
      <p style="font-size: 11.5px; color: var(--text-faint); margin: 0;">
        QR refreshes automatically. Once connected, click Save to keep this sender.
      </p>
    </div>
  `;
  const footer = `
    <button class="btn btn-ghost" data-action="close-modal">Close</button>
    <button class="btn btn-primary" id="scan-qr-save" data-action="save-scanned-sender" data-id="${senderId}">${ICON.check} Save Sender</button>
  `;
  document.getElementById("modal-root").innerHTML = modalShell({
    title: "Scan QR to Connect Sender",
    bodyHtml: body,
    footerHtml: footer,
    narrow: true
  });

  const box = document.getElementById("scan-qr-box");
  let tries = 0;
  let unreachableStreak = 0;
  const timer = setInterval(async () => {
    // Stop if the modal was closed/replaced
    if (!document.getElementById("scan-qr-box")) { clearInterval(timer); return; }
    tries++;
    try {
      // Quick status check first (short timeout) — avoids buffering
      const st = await api(`/senders/${senderId}/status`);
      if (st.connected) {
        box.innerHTML = `<div style="color: #10B981; font-weight: 600; font-size: 14px;">✅ Connected<br><span style="font-size:12px; color:var(--text-muted);">${escapeHtml(st.phone || st.name)}</span></div>`;
        clearInterval(timer);
        return;
      }
      unreachableStreak = 0;
      const qr = await api(`/senders/${senderId}/qr-image`);
      if (qr && qr.qr) {
        box.innerHTML = `<img src="${qr.qr}" alt="WhatsApp QR" style="width: 240px; height: 240px; border-radius: 8px;" />`;
      } else {
        box.innerHTML = `<div style="color: var(--text-muted); font-size: 12.5px; padding: 12px;">Waiting for QR...</div>`;
      }
    } catch (err) {
      // If WAHA is unreachable, don't spam — show once and slow down
      unreachableStreak++;
      box.innerHTML = `<div style="color: var(--red); font-size: 12px; padding: 12px;">${escapeHtml(err.message)}</div>`;
      if (unreachableStreak >= 3) clearInterval(timer);
    }
    if (tries > 45) { box.innerHTML = `<div style="color: var(--text-muted); font-size: 12.5px;">Timed out. Close and try again.</div>`; clearInterval(timer); }
  }, 2000);
}

/* ---------- Page: Calendar ---------- */

function renderCalendarPage() {
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Generate calendar days
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Mock data: campaigns sent on specific dates
  const campaignDates = {};
  campaigns.forEach(c => {
    const dateStr = c.created; // Formatted as YYYY-MM-DD
    if (!campaignDates[dateStr]) {
      campaignDates[dateStr] = { campaigns: 0, messages: 0 };
    }
    campaignDates[dateStr].campaigns += 1;
    campaignDates[dateStr].messages += (c.sentCount || 0);
  });

  let calendarHtml = '<div class="calendar-grid-compact">';

  // Day headers
  ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].forEach(day => {
    calendarHtml += `<div class="calendar-day-header-compact">${day}</div>`;
  });

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    calendarHtml += '<div class="calendar-day-compact calendar-day-empty"></div>';
  }

  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const hasData = campaignDates[dateStr];
    const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();

    calendarHtml += `
      <div class="calendar-day-compact ${hasData ? 'has-activity' : ''} ${isToday ? 'is-today' : ''}" data-date="${dateStr}">
        <div class="calendar-day-number-compact">${day}</div>
        ${hasData ? `<div class="calendar-event">${hasData.campaigns} campaign${hasData.campaigns > 1 ? 's' : ''}<br><span>${hasData.messages} msg</span></div>` : ''}
      </div>`;
  }

  calendarHtml += '</div>';

  const html = `
    <div class="wrap wrap-full">
      <div class="calendar-header-row">
        <div>
          <h1>Campaign Calendar</h1>
          <p>View your message sending history by date.</p>
        </div>
        <div class="calendar-nav">
          <button class="btn-icon" data-action="prev-month">${ICON.arrowLeft}</button>
          <h2>${monthNames[currentMonth]} ${currentYear}</h2>
          <button class="btn-icon" data-action="next-month">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      <div class="calendar-card-compact">
        ${calendarHtml}
      </div>
    </div>`;

  document.getElementById("page-calendar").innerHTML = html;
}

/* ---------- Rendering router ---------- */

function renderPage() {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');

  if (activeNav === 'dashboard') {
    document.getElementById('page-dashboard').style.display = '';
    renderDashboardPage();
  } else if (activeNav === 'contacts') {
    if (activeGroupId) {
      document.getElementById('page-group-detail').style.display = '';
      renderGroupDetailPage(activeGroupId);
    } else {
      document.getElementById('page-groups').style.display = '';
      renderGroupsPage();
    }
  } else if (activeNav === 'templates') {
    document.getElementById('page-templates').style.display = '';
    renderTemplatesPage();
  } else if (activeNav === 'campaign') {
    if (activeCampaignId) {
      document.getElementById('page-campaign-detail').style.display = '';
      renderCampaignDetailPage(activeCampaignId);
    } else {
      document.getElementById('page-campaigns').style.display = '';
      renderCampaignsPage();
    }
  } else if (activeNav === 'calendar') {
    document.getElementById('page-calendar').style.display = '';
    renderCalendarPage();
  } else if (activeNav === 'blasting') {
    document.getElementById('page-blasting').style.display = '';
    renderBlastingPage();
  } else if (activeNav === 'settings') {
    document.getElementById('page-settings').style.display = '';
    renderSettingsPage();
  } else {
    document.getElementById('page-placeholder').style.display = '';
    const labels = {};
    const descriptions = {};
    document.getElementById('placeholder-title').textContent = labels[activeNav] || "Coming soon";
    document.getElementById('placeholder-desc').textContent = descriptions[activeNav] || "This section hasn't been built yet.";
  }

  renderNav();
}

/* ---------- Modal: Create/Edit Group ---------- */

function renderGroupModal(isEdit = false) {
  const { name } = modalState;

  const body = `
    <div class="field">
      <label class="field-label">Group Name <span class="req">*</span></label>
      <input id="m-name" class="text-input" type="text" value="${escapeHtml(name || '')}" data-field="name" placeholder="e.g. SPM Parents 2026" />
    </div>
  `;

  const footer = `
    <button class="btn btn-ghost" data-action="close-modal">Cancel</button>
    <button class="btn btn-primary" data-action="save-group">${ICON.check} ${isEdit ? 'Update' : 'Create'} Group</button>
  `;

  document.getElementById("modal-root").innerHTML = modalShell({
    title: isEdit ? "Edit Group" : "Create New Group",
    bodyHtml: body,
    footerHtml: footer,
  });
}

/* ---------- Modal: Delete Group Confirmation ---------- */

function renderDeleteGroupModal(groupId, groupName) {
  modal = { type: "delete-group", groupId: groupId };
  
  const body = `
    <div style="font-size: 14.5px; line-height: 1.6; color: var(--text-muted);">
      Are you sure you want to delete the group <strong>"${escapeHtml(groupName)}"</strong> and all its associated contacts?
      <br><br>
      <div class="alert-banner alert-danger" style="margin-top: 12px; padding: 12px; border-radius: 8px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #EF4444;">
        <div style="font-size: 13px; line-height: 1.5;">
          ⚠️ <strong>Warning:</strong> This action is permanent and cannot be undone. Any campaigns linked to this group will lose their target contacts.
        </div>
      </div>
    </div>
  `;

  const footer = `
    <button class="btn btn-ghost" data-action="close-modal">Cancel</button>
    <button class="btn btn-danger" data-action="delete-group-confirmed" data-id="${groupId}" style="background: var(--red); color: white; border: none; font-weight: 700; height: 38px; padding: 0 16px; border-radius: 8px; cursor: pointer;">Delete Permanently</button>
  `;

  document.getElementById("modal-root").innerHTML = modalShell({
    title: "Delete Group",
    bodyHtml: body,
    footerHtml: footer,
    narrow: true
  });
}

/* ---------- Modal: Delete Campaign Confirmation ---------- */

function renderDeleteCampaignModal(campaignId, campaignName) {
  modal = { type: "delete-campaign", campaignId: campaignId };
  
  const body = `
    <div style="font-size: 14.5px; line-height: 1.6; color: var(--text-muted);">
      Are you sure you want to delete the campaign <strong>"${escapeHtml(campaignName)}"</strong>?
      <br><br>
      <div class="alert-banner alert-danger" style="margin-top: 12px; padding: 12px; border-radius: 8px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #EF4444;">
        <div style="font-size: 13px; line-height: 1.5;">
          ⚠️ <strong>Warning:</strong> This action is permanent. All historical logs and report charts for this campaign will be permanently deleted from the database.
        </div>
      </div>
    </div>
  `;

  const footer = `
    <button class="btn btn-ghost" data-action="close-modal">Cancel</button>
    <button class="btn btn-danger" data-action="delete-campaign-confirmed" data-id="${campaignId}" style="background: var(--red); color: white; border: none; font-weight: 700; height: 38px; padding: 0 16px; border-radius: 8px; cursor: pointer;">Delete Permanently</button>
  `;

  document.getElementById("modal-root").innerHTML = modalShell({
    title: "Delete Campaign",
    bodyHtml: body,
    footerHtml: footer,
    narrow: true
  });
}

/* ---------- Modal: Delete Contacts Confirmation ---------- */

function renderDeleteContactsModal(count, contactIdsToDelete, groupId) {
  modal = { type: "delete-contacts", contactIds: contactIdsToDelete, groupId: groupId };

  const body = `
    <div style="font-size: 14.5px; line-height: 1.6; color: var(--text-muted);">
      Are you sure you want to remove the <strong>${count} selected contact${count !== 1 ? 's' : ''}</strong> from this group?
      <br><br>
      <div class="alert-banner alert-danger" style="margin-top: 12px; padding: 12px; border-radius: 8px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #EF4444;">
        <div style="font-size: 13px; line-height: 1.5;">
          ⚠️ <strong>Warning:</strong> This action will remove the selected contacts from this group.
        </div>
      </div>
    </div>
  `;

  const footer = `
    <button class="btn btn-ghost" data-action="close-modal">Cancel</button>
    <button class="btn btn-danger" data-action="delete-contacts-confirmed" data-id="${groupId}" style="background: var(--red); color: white; border: none; font-weight: 700; height: 38px; padding: 0 16px; border-radius: 8px; cursor: pointer;">Remove Permanently</button>
  `;

  document.getElementById("modal-root").innerHTML = modalShell({
    title: "Remove Contacts",
    bodyHtml: body,
    footerHtml: footer,
    narrow: true
  });
}

/* ---------- Modal: Create/Edit Template ---------- */

function renderTemplateModal(isEdit = false) {
  const { name, message, hasMedia, mediaUrl, channel = "whatsapp", emailSubject = "" } = modalState;

  const isEmail = channel === "email";

  function processSpintaxPreview(text) {
    if (!text) return '';
    return text.replace(/\{([^{}]+)\}/g, (match, content) => {
      const options = content.split('|');
      return options[Math.floor(Math.random() * options.length)];
    });
  }
  
  const rawMessage = message || (isEmail ? 'Type your HTML message text to see preview...' : 'Your message preview will appear here...');
  const parsedMessage = processSpintaxPreview(rawMessage);

  const body = `
    <div class="template-modal-grid" style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; align-items: start;">
      <div class="template-form-column" style="display: flex; flex-direction: column; gap: 16px;">
        <div class="field">
          <label class="field-label">Template Name <span class="req">*</span></label>
          <input id="m-name" class="text-input" type="text" value="${escapeHtml(name || '')}" data-field="name" placeholder="e.g. Exam Reminder" />
        </div>
        <div class="field">
          <label class="field-label">Channel <span class="req">*</span></label>
          <select id="m-channel" class="text-input" data-field="channel">
            <option value="whatsapp" ${channel === 'whatsapp' ? 'selected' : ''}>WhatsApp</option>
            <option value="email" ${channel === 'email' ? 'selected' : ''}>Email</option>
          </select>
        </div>
        ${isEmail ? `
          <div class="field">
            <label class="field-label">Email Subject <span class="req">*</span></label>
            <input id="m-email-subject" class="text-input" type="text" value="${escapeHtml(emailSubject || '')}" data-field="emailSubject" placeholder="e.g. Important Exam Update" />
          </div>
        ` : ''}
        <div class="field">
          <label class="field-label">Message <span class="req">*</span></label>
          ${isEmail ? `
            <div style="border: 1px solid var(--border); border-radius: 8px; overflow: hidden; background: white; margin-bottom: 8px;">
              <div id="editor-container" style="min-height: 150px; font-size: 14px;">${message || ''}</div>
            </div>
            
            <div class="field" style="margin-top: 16px;">
              <label class="field-label">Attachments</label>
              <div id="attachment-list" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px;">
                ${(modalState.attachments || []).map((att, i) => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #f9f9f9; border: 1px solid var(--border); border-radius: 6px; font-size: 13px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span>📎</span>
                      <span style="font-weight: 500; color: var(--text);">${escapeHtml(att.name)}</span>
                    </div>
                    <button type="button" class="remove-attachment-btn" data-action="remove-attachment" data-index="${i}" style="background: none; border: none; color: var(--danger); cursor: pointer; padding: 4px;">${ICON.x}</button>
                  </div>
                `).join('')}
              </div>
              <input id="template-attachment-file" type="file" multiple accept=".pdf,image/*" hidden data-action="upload-attachment" />
              <button type="button" class="btn btn-secondary" onclick="document.getElementById('template-attachment-file').click()" style="width: 100%; display: flex; justify-content: center; align-items: center; gap: 6px; border: 1px dashed var(--border); background: #fafafa; color: var(--text-muted);">
                📎 Add Attachment (PDF / Image)
              </button>
            </div>
          ` : `
            <textarea id="m-message" class="text-input" rows="5" data-field="message" placeholder="Type your message here...">${escapeHtml(message || '')}</textarea>
          `}
        </div>
        ${!isEmail ? `
          <div class="field">
            <label class="checkbox-label">
              <input type="checkbox" id="m-has-media" data-action="toggle-media" ${hasMedia ? 'checked' : ''} />
              <span>Include media (image)</span>
            </label>
          </div>
          ${hasMedia ? `
            <div class="field">
              <label class="field-label">Media Image</label>
              ${mediaUrl ? `
                <div class="media-preview-container" style="position: relative; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; max-width: 200px; margin-top: 8px;">
                  <img src="${mediaUrl}" style="width: 100%; height: auto; display: block;" />
                  <button type="button" data-action="remove-template-media" style="position: absolute; top: 8px; right: 8px; background: rgba(30,27,58,0.6); color: white; border: none; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; padding: 0;">
                    ${ICON.x}
                  </button>
                </div>
              ` : `
                <input id="template-media-file" type="file" accept="image/*" hidden />
                <div class="dropzone" id="template-media-dropzone" data-action="trigger-template-media-select" style="border: 2px dashed var(--violet-border); border-radius: 12px; padding: 24px 20px; text-align: center; cursor: pointer; transition: all 0.2s; background: var(--bg);">
                  <div class="dropzone-icon" style="color: var(--violet); margin-bottom: 8px;">
                    ${ICON.image}
                  </div>
                  <div class="dropzone-title" style="font-size: 13.5px; font-weight: 600; color: var(--text);">
                    Click to upload, or drag an image here
                  </div>
                  <div class="dropzone-sub" style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">
                    Supports PNG, JPG, JPEG, GIF
                  </div>
                </div>
              `}
            </div>
          ` : ''}
        ` : ''}
      </div>

      <div class="template-preview-column" style="width: 100%;">
        ${isEmail ? `
          <div style="display: flex; flex-direction: column; background: #ffffff; border-radius: 12px; padding: 20px; border: 1px solid var(--border); min-height: 250px; justify-content: flex-start; position: relative;">
            <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">Live Email Preview</div>
            <div style="width: 100%; border: 1px solid var(--border-soft); border-radius: 8px; overflow: hidden; font-size: 13px; text-align: left;">
              <div style="background: #F3F4F6; padding: 10px 14px; border-bottom: 1px solid var(--border-soft); color: var(--text-muted); line-height: 1.4;">
                <div><strong>Subject:</strong> <span id="email-preview-subject" style="color: var(--text);">${escapeHtml(emailSubject || '(No Subject)')}</span></div>
                <div style="margin-top: 4px;"><strong>From:</strong> flyblast@yourdomain.com</div>
                <div style="margin-top: 4px;"><strong>To:</strong> recipient@email.com</div>
              </div>
              <div id="email-preview-body" style="padding: 14px; min-height: 120px; background: white; color: var(--text); white-space: pre-wrap; line-height: 1.5; word-break: break-word; font-family: inherit;">${parsedMessage}</div>
            </div>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; align-items: center; background: #efeae2; border-radius: 12px; padding: 24px 20px; border: 1px solid var(--border); min-height: 300px; justify-content: center; position: relative;">
            <div style="position: absolute; top: 12px; left: 16px; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Live WhatsApp Preview</div>
            <div class="whatsapp-bubble" style="background: white; border-radius: 8px; box-shadow: 0 1px 1px rgba(30,27,58,0.12); padding: 8px 8px 4px; width: 100%; max-width: 250px; font-size: 13px; color: #303030; position: relative; margin-top: 12px; align-self: flex-start;">
              ${hasMedia && mediaUrl ? `
                <div style="border-radius: 6px; overflow: hidden; margin-bottom: 6px;">
                  <img src="${mediaUrl}" style="width: 100%; height: auto; display: block;" />
                </div>
              ` : ''}
              <div id="whatsapp-preview-text" style="white-space: pre-wrap; line-height: 1.4; word-break: break-word; font-family: inherit;">${escapeHtml(parsedMessage)}</div>
              <div style="display: flex; justify-content: flex-end; align-items: center; gap: 2px; font-size: 10px; color: #909090; margin-top: 4px;">
                <span>10:00 AM</span>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#25D366" stroke-width="2.5"><path d="m3 12 5 5L20 4"/><path d="m11 17 2.5 2.5L20 11" stroke-linecap="round"/></svg>
              </div>
            </div>
          </div>
        `}
      </div>
    </div>
  `;

  const footer = `
    <button class="btn btn-ghost" data-action="close-modal">Cancel</button>
    <button class="btn btn-primary" data-action="save-template">${ICON.check} ${isEdit ? 'Update' : 'Create'} Template</button>
  `;

  document.getElementById("modal-root").innerHTML = modalShell({
    title: isEdit ? "Edit Template" : "Create New Template",
    bodyHtml: body,
    footerHtml: footer,
    wide: true
  });

  if (isEmail && window.Quill) {
    const quill = new Quill('#editor-container', {
      theme: 'snow',
      placeholder: 'Type your email message here...',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link', 'image'],
          ['clean']
        ]
      }
    });
    
    quill.on('text-change', function() {
      const html = quill.root.innerHTML;
      modalState.message = html;
      
      const processSpintax = (text) => text.replace(/\{([^{}]+)\}/g, (match, content) => {
        const options = content.split('|');
        return options[Math.floor(Math.random() * options.length)];
      });
      const parsedVal = processSpintax(html);
      
      const emailBodyEl = document.getElementById("email-preview-body");
      if (emailBodyEl) {
        emailBodyEl.innerHTML = parsedVal;
      }
    });

    quill.root.addEventListener('click', (ev) => {
      if (ev.target.tagName === 'IMG') {
        showConfirmModal(
          "Remove Image", 
          "Would you like to delete this image from your message?", 
          () => {
            const blot = Quill.find(ev.target);
            if (blot) {
              blot.deleteAt(0, 1);
            } else {
              ev.target.remove();
              // Force text-change emit so state and preview update
              quill.emitter.emit('text-change');
            }
          }
        );
      }
    });
  }
}

/* ---------- Modal: Create Campaign ---------- */

function renderCampaignModal() {
  const { name, groupIds = [], templateId } = modalState;

  const templateOptions = templates.map(t =>
    `<option value="${t.id}" ${templateId === t.id ? 'selected' : ''}>${escapeHtml(t.name)} (${t.channel === 'email' ? 'Email' : 'WhatsApp'})</option>`
  ).join('');

  const body = `
    <div class="field">
      <label class="field-label">Campaign Name <span class="req">*</span></label>
      <input id="m-name" class="text-input" type="text" value="${escapeHtml(name || '')}" data-field="name" placeholder="e.g. March SPM Blast" />
    </div>
    <div class="field">
      <label class="field-label">Target Type <span class="req">*</span></label>
      <div style="display: flex; gap: 16px; margin-top: 6px; margin-bottom: 12px;">
        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13.5px; font-weight: 500;">
          <input type="radio" name="m-targetType" value="individual" checked />
          Individual Blast (DMs)
        </label>
        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13.5px; font-weight: 500;">
          <input type="radio" name="m-targetType" value="group" />
          WhatsApp Group Chat
        </label>
      </div>
    </div>
    <div class="field">
      <label class="field-label">Delay Response <span class="req">*</span></label>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 6px; margin-bottom: 12px;">
        <style>
          .delay-label { cursor: pointer; display: block; }
          .delay-radio { display: none; }
          .delay-card { border: 1px solid var(--border); border-radius: 8px; padding: 16px; text-align: center; background: white; transition: all 0.2s; height: 100%; }
          .delay-radio:checked + .delay-card { border: 2px solid var(--violet); background: rgba(108, 92, 231, 0.05); box-shadow: 0 2px 8px rgba(108, 92, 231, 0.1); }
          .delay-icon { font-size: 20px; color: var(--violet); margin-bottom: 8px; }
          .delay-title { font-weight: 600; font-size: 14px; color: var(--text); }
          .delay-sub { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
        </style>
        <label class="delay-label">
          <input type="radio" name="m-delay" value="5" class="delay-radio" />
          <div class="delay-card">
            <div class="delay-icon">⚡</div>
            <div class="delay-title">Fast</div>
            <div class="delay-sub">5s delay</div>
          </div>
        </label>
        <label class="delay-label">
          <input type="radio" name="m-delay" value="15" class="delay-radio" checked />
          <div class="delay-card">
            <div class="delay-icon">⏱️</div>
            <div class="delay-title">Normal</div>
            <div class="delay-sub">15s delay</div>
          </div>
        </label>
        <label class="delay-label">
          <input type="radio" name="m-delay" value="30" class="delay-radio" />
          <div class="delay-card">
            <div class="delay-icon">🐢</div>
            <div class="delay-title">Safe</div>
            <div class="delay-sub">30s delay</div>
          </div>
        </label>
      </div>
    </div>
    <div class="field">
      <label class="field-label">Select Target Groups <span class="req">*</span></label>
      <div class="multi-select-container" style="position: relative; font-family: inherit;">
        
        <!-- Multi-select trigger box -->
        <div id="group-select-trigger" class="text-input" style="min-height: 38px; height: auto; display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 6px 12px; cursor: pointer; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); position: relative; padding-right: 32px; box-sizing: border-box;">
          ${groupIds.length === 0 ? `
            <span style="color: var(--text-muted); font-size: 13.5px;">Choose target groups...</span>
          ` : groupIds.map(gId => {
              const g = groups.find(x => x.id === gId);
              if (!g) return '';
              return `
                <span class="group-select-chip" style="background: var(--violet-light); color: var(--violet); padding: 2px 8px; border-radius: 6px; font-size: 12.0px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; z-index: 2;">
                  ${escapeHtml(g.name)}
                  <button type="button" class="chip-remove-btn" data-action="deselect-group-chip" data-id="${g.id}" style="background: none; border: none; padding: 0; color: var(--violet); cursor: pointer; font-size: 11px; display: flex; align-items: center; justify-content: center; width: 14px; height: 14px;">${ICON.x}</button>
                </span>
              `;
            }).join('')}
          <div style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--text-muted);">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>

        <!-- Dropdown menu popup -->
        <div id="group-select-dropdown" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: var(--card); border: 1px solid var(--border); border-radius: 8px; box-shadow: 0 10px 25px rgba(30,27,58,0.15); margin-top: 4px; z-index: 1000; max-height: 200px; overflow-y: auto;">
          ${groups.length === 0 ? `
            <div style="padding: 10px 14px; font-size: 13px; color: var(--text-faint);">No groups found. Please create a group first.</div>
          ` : groups.map(g => {
              const isSelected = groupIds.includes(g.id);
              return `
                <div class="group-dropdown-item" data-action="toggle-group-selection" data-id="${g.id}" style="padding: 10px 14px; font-size: 13.5px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: background 0.15s; background: ${isSelected ? 'var(--bg-light)' : 'transparent'};">
                  <span style="color: var(--text);">${escapeHtml(g.name)} (${g.contacts.length} contacts)</span>
                  ${isSelected ? `<span style="color: var(--violet); display: flex; align-items: center;">${ICON.check}</span>` : ''}
                </div>
              `;
            }).join('')}
        </div>

      </div>
    </div>
    <div class="field">
      <label class="field-label">Select Template <span class="req">*</span></label>
      <select id="m-template" class="text-input" data-field="templateId">
        <option value="">Choose a template...</option>
        ${templateOptions}
      </select>
    </div>
    <div class="field" style="margin-top: 4px;">
      <label class="checkbox-label" style="display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none;">
        <input type="checkbox" id="m-only-interactions" ${modalState.onlyInteractions ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;" />
        <span style="font-weight: 600; font-size: 13.5px; color: var(--text);">Only contacts with prior interaction</span>
      </label>
      <p style="font-size: 11.5px; color: var(--text-muted); margin: 4px 0 0; line-height: 1.4;">
        Only blast to numbers you've received from or replied to before (individual & group chats).
      </p>
    </div>
    <div class="hint-note">
      ${ICON.alert} Campaign will be created in "Pending" status. You can start it from the campaigns page.
    </div>
  `;

  const footer = `
    <button class="btn btn-ghost" data-action="close-modal">Cancel</button>
    <button class="btn btn-primary" data-action="save-campaign">${ICON.check} Create Campaign</button>
  `;

  document.getElementById("modal-root").innerHTML = modalShell({
    title: "Create New Campaign",
    bodyHtml: body,
    footerHtml: footer,
  });
}

/* ---------- Modal: Import WhatsApp Group ---------- */

function renderImportGroupModal() {
  modal = { type: "import-group" };
  const body = `
    <div style="display: flex; flex-direction: column; gap: 14px;">
      <p style="font-size: 13px; color: var(--text-muted); margin: 0; line-height: 1.5;">
        Pull a WhatsApp group's members directly from your connected sender session. This creates a new group with all its members.
      </p>
      <div class="field">
        <label class="field-label">WhatsApp Group</label>
        <select id="import-group-select" class="text-input">
          <option value="">Loading groups...</option>
        </select>
      </div>
      <div id="import-group-info" style="font-size: 12.5px; color: var(--text-muted);"></div>
    </div>
  `;
  const footer = `
    <button class="btn btn-ghost" data-action="close-modal">Cancel</button>
    <button class="btn btn-primary" id="import-group-confirm" data-action="import-group-confirmed">${ICON.download} Import Group</button>
  `;
  document.getElementById("modal-root").innerHTML = modalShell({
    title: "Import WhatsApp Group",
    bodyHtml: body,
    footerHtml: footer,
    narrow: true
  });

  const sel = document.getElementById("import-group-select");
  const info = document.getElementById("import-group-info");
  api("/waha/groups").then(list => {
    if (sel) {
      if (list.length === 0) {
        sel.innerHTML = `<option value="">No groups found on this session</option>`;
        if (info) info.textContent = "Make sure the sender session is connected and has groups.";
      } else {
        sel.innerHTML = `<option value="">Choose a group...</option>` + list.map(g =>
          `<option value="${escapeHtml(g.id)}">${escapeHtml(g.name)} (${g.participants} members)</option>`
        ).join('');
      }
    }
  }).catch(err => {
    if (sel) sel.innerHTML = `<option value="">Could not load groups</option>`;
    if (info) info.textContent = err.message;
  });
}

function renderAddContactModal() {
  const group = groups.find(g => g.id === modal.groupId);
  if (!group) return;

  const { tab = "manual", contacts = [], parsed = [], fileName = null, count = null, error = null, contactType = "individual" } = modalState;

  const tabsHtml = `
    <div class="modal-tabs" style="display: flex; border-bottom: 1px solid var(--border); margin: -10px -20px 20px; padding: 0 20px;">
      <button class="modal-tab ${tab === 'manual' ? 'active' : ''}" style="background: none; border: none; padding: 12px 16px; font-size: 13.5px; font-weight: 600; color: ${tab === 'manual' ? 'var(--violet)' : 'var(--text-muted)'}; border-bottom: 2px solid ${tab === 'manual' ? 'var(--violet)' : 'transparent'}; cursor: pointer;" data-action="toggle-add-tab" data-tab="manual">
        Add Individually
      </button>
      <button class="modal-tab ${tab === 'csv' ? 'active' : ''}" style="background: none; border: none; padding: 12px 16px; font-size: 13.5px; font-weight: 600; color: ${tab === 'csv' ? 'var(--violet)' : 'var(--text-muted)'}; border-bottom: 2px solid ${tab === 'csv' ? 'var(--violet)' : 'transparent'}; cursor: pointer;" data-action="toggle-add-tab" data-tab="csv">
        Upload CSV
      </button>
    </div>
  `;

  let bodyHtml = "";
  if (tab === "manual") {
    const isGroup = contactType === 'group';
    bodyHtml = `
      <div class="field">
        <label class="field-label">Contact Type</label>
        <div style="display: flex; gap: 16px; margin-bottom: 12px; margin-top: 4px;">
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13.5px; font-weight: 500;">
            <input type="radio" name="m-addType" value="individual" ${!isGroup ? 'checked' : ''} />
            Individual Person
          </label>
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13.5px; font-weight: 500;">
            <input type="radio" name="m-addType" value="group" ${isGroup ? 'checked' : ''} />
            WhatsApp Group Chat
          </label>
        </div>

        <label class="field-label">Add ${isGroup ? 'Group Chat' : 'Contact'}</label>
        <div class="input-row" style="display: flex; gap: 8px; margin-bottom: 6px;">
          <input id="m-contact-name" class="text-input" type="text" placeholder="${isGroup ? 'WhatsApp Group Name' : 'Name'}" data-field="contactName" style="flex:1; height: 38px; border: 1px solid var(--border); border-radius: 8px; padding: 6px 12px;" value="${escapeHtml(modalState.contactName || '')}" />
          <input id="m-contact-phone" class="text-input" type="text" placeholder="${isGroup ? 'Group ID (e.g. 120363027...)' : 'Phone Number'}" data-field="contactPhone" style="flex:1; height: 38px; border: 1px solid var(--border); border-radius: 8px; padding: 6px 12px;" value="${escapeHtml(modalState.contactPhone || '')}" />
          ${!isGroup ? `<input id="m-contact-email" class="text-input" type="text" placeholder="Email (optional)" data-field="contactEmail" style="flex:1.2; height: 38px; border: 1px solid var(--border); border-radius: 8px; padding: 6px 12px;" value="${escapeHtml(modalState.contactEmail || '')}" />` : ''}
          <button class="btn-chip" data-action="add-contact-to-temp-list" style="height: 38px; border-radius: 8px; border: 1px solid var(--violet-border); background: var(--violet-light); color: var(--violet); padding: 0 16px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px;">${ICON.plus} Add</button>
        </div>
        <div id="m-phone-validation-message" style="font-size: 12.5px; margin-top: 4px; display: none;"></div>
      </div>
      ${contacts.length > 0 ? `
        <div class="field" style="margin-top: 16px;">
          <label class="field-label">Contacts to Add (${contacts.length})</label>
          <div class="contacts-mini-list" style="max-height: 150px; overflow-y: auto; border: 1px solid var(--border); border-radius: 8px; padding: 8px; background: var(--bg); display: flex; flex-direction: column; gap: 6px;">
            ${contacts.map((c, i) => `
              <div class="contact-mini-item" style="display: flex; justify-content: space-between; align-items: center; background: var(--card); padding: 6px 10px; border-radius: 6px; border: 1px solid var(--border-soft); font-size: 13px;">
                <span>${escapeHtml(c.name || '')} (${escapeHtml(c.phone)}) ${c.email ? `<code style="background:var(--bg); padding:2px 4px; border-radius:4px; font-size:11px;">${escapeHtml(c.email)}</code>` : ''}</span>
                <button class="icon-btn-mini red" data-action="remove-temp-contact" data-index="${i}" style="background: none; border: none; color: var(--red); cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 2px;">${ICON.x}</button>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  } else {
    // CSV tab
    let resultHtml = "";
    if (count !== null && count !== undefined) {
      const dupInGroup = modalState.duplicatesInGroup || 0;
      const dupInCsv = modalState.duplicatesInCsv || 0;
      const validNewCount = modalState.validNewCount || 0;

      let detailText = "";
      if (dupInGroup > 0 || dupInCsv > 0) {
        detailText = `<span style="color: var(--text-muted); font-weight: normal; font-size: 12px; display: block; margin-top: 6px; line-height: 1.4;">
          (${validNewCount} new contacts will be added, ${dupInGroup} already in group skipped, ${dupInCsv} duplicates in CSV file skipped)
        </span>`;
      }

      resultHtml = `
        <div class="dropzone-result success" style="margin-top: 12px; padding: 12px; border-radius: 8px; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); font-size: 13.5px; font-weight: 600; color: var(--green);">
          <div style="display: flex; align-items: center; gap: 6px;">
            ${ICON.check} ${count} contact${count === 1 ? "" : "s"} found in CSV
          </div>
          ${detailText}
        </div>
      `;
    } else if (error) {
      resultHtml = `<div class="dropzone-result error" style="margin-top: 12px; font-size: 13px; font-weight: 600; color: var(--red); display: flex; align-items: center; gap: 6px;">${ICON.alert} ${error}</div>`;
    }

    bodyHtml = `
      <div class="template-hint" style="margin-bottom: 16px; font-size: 13px; color: var(--text-muted); display: flex; align-items: center; gap: 8px;">
        ${ICON.fileText} Need the template? 
        <button class="btn-text" data-action="download-template-inline" style="background:none; border:none; color:var(--violet); font-weight:600; cursor:pointer; text-decoration:underline; padding:0;">Download CSV template</button>
      </div>
      <input id="csv-file-inline" type="file" accept=".csv" hidden />
      <div class="dropzone" id="csv-dropzone" data-action="trigger-file-select" style="border: 2px dashed var(--violet-border); border-radius: 12px; padding: 32px 20px; text-align: center; cursor: pointer; transition: all 0.2s; background: var(--bg);">
        <div class="dropzone-icon" style="color: var(--violet); margin-bottom: 12px;">
          ${ICON.upload}
        </div>
        <div class="dropzone-title" style="font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 4px;">
          ${fileName ? escapeHtml(fileName) : "Click to upload, or drag a CSV here"}
        </div>
        <div class="dropzone-sub" style="font-size: 12px; color: var(--text-muted);">
          Columns must match: name, phone_number
        </div>
      </div>
      ${resultHtml}
    `;
  }

  const countToAdd = tab === 'manual' ? contacts.length : (modalState.validNewCount !== undefined ? modalState.validNewCount : parsed.length);
  const hasItemsToAdd = countToAdd > 0;

  const footerHtml = `
    <button class="btn btn-ghost" data-action="close-modal">Cancel</button>
    <button class="btn btn-primary" data-action="save-added-contacts" ${!hasItemsToAdd ? 'disabled' : ''}>
      ${ICON.check} Add ${countToAdd > 0 ? countToAdd + ' ' : ''}Contact${countToAdd === 1 ? '' : 's'}
    </button>
  `;

  document.getElementById("modal-root").innerHTML = modalShell({
    title: "Add Contacts",
    subtitle: `Adding to "${escapeHtml(group.name)}"`,
    bodyHtml: tabsHtml + bodyHtml,
    footerHtml: footerHtml,
  });
}

/* ---------- Modal Shell ---------- */

function modalShell({ title, subtitle, bodyHtml, footerHtml, narrow, wide }) {
  return `
    <div class="overlay" data-action="close-on-backdrop">
      <div class="modal ${narrow ? "narrow" : ""} ${wide ? "wide" : ""}" data-stop>
        <div class="modal-head">
          <div>
            <h2>${title}</h2>
            ${subtitle ? `<p>${subtitle}</p>` : ""}
          </div>
          <button class="modal-close" data-action="close-modal">${ICON.x}</button>
        </div>
        <div class="modal-body">${bodyHtml}</div>
        ${footerHtml ? `<div class="modal-foot">${footerHtml}</div>` : ""}
      </div>
    </div>`;
}

function closeModal() {
  modal = null;
  modalState = {};
  isEditingGroup = false;
  document.getElementById("modal-root").innerHTML = "";
}

function closeConfirmModal() {
  document.getElementById("confirm-modal-root").innerHTML = "";
}

let pendingConfirmAction = null;

function showConfirmModal(title, message, onConfirm) {
  pendingConfirmAction = onConfirm;
  const footerHtml = `
    <button class="btn btn-ghost" data-action="close-confirm-modal">Cancel</button>
    <button class="btn btn-primary" data-action="confirm-modal-ok">${ICON.check} Remove</button>
  `;
  const html = modalShell({
    title: title,
    bodyHtml: `<p style="margin: 0; font-size: 14px; color: var(--text);">${message}</p>`,
    footerHtml: footerHtml,
    narrow: true
  });
  // Change z-index slightly so it stacks above
  document.getElementById("confirm-modal-root").innerHTML = html.replace('class="overlay"', 'class="overlay" style="z-index: 2000;"');
}

/* ---------- Event delegation ---------- */

document.addEventListener("click", (e) => {
  // Close group select dropdown if clicking outside
  const selectDropdown = document.getElementById("group-select-dropdown");
  const selectTrigger = document.getElementById("group-select-trigger");
  if (selectDropdown && selectTrigger) {
    if (selectTrigger.contains(e.target)) {
      selectDropdown.style.display = selectDropdown.style.display === "block" ? "none" : "block";
    } else if (!selectDropdown.contains(e.target)) {
      selectDropdown.style.display = "none";
    }
  }

  const overlay = e.target.closest(".overlay");
  const stopEl = e.target.closest("[data-stop]");
  if (overlay && !stopEl) {
    if (overlay.parentElement && overlay.parentElement.id === "confirm-modal-root") {
      closeConfirmModal();
    } else {
      closeModal();
    }
    return;
  }

  const actionEl = e.target.closest("[data-action]");
  if (!actionEl) return;

  // Safeguard: Ignore row transitions if click lands inside the actions-cell
  if (e.target.closest(".actions-cell") && actionEl.dataset.action === "view-group") {
    return;
  }

  const action = actionEl.dataset.action;

  switch (action) {
    case "nav": {
      activeNav = actionEl.dataset.nav;
      modal = null;
      activeGroupId = null;
      activeCampaignId = null;
      isEditingGroup = false;

      // Auto-close sidebar on mobile
      document.querySelector(".sidebar")?.classList.remove("open");
      document.getElementById("sidebar-overlay")?.classList.remove("visible");

      renderPage();
      break;
    }
    case "close-modal": {
      closeModal();
      break;
    }
    case "close-confirm-modal": {
      closeConfirmModal();
      pendingConfirmAction = null;
      break;
    }
    case "confirm-modal-ok": {
      if (pendingConfirmAction) pendingConfirmAction();
      pendingConfirmAction = null;
      closeConfirmModal();
      break;
    }

    // Groups
    case "view-group": {
      activeGroupId = actionEl.dataset.id;
      modal = { type: "view-group", groupId: actionEl.dataset.id };
      isEditingGroup = false;
      renderPage();
      break;
    }
    case "back-to-groups": {
      activeGroupId = null;
      modal = null;
      isEditingGroup = false;
      renderPage();
      break;
    }
    case "create-group": {
      modalState = { name: "", contacts: [], contactName: "", contactPhone: "" };
      modal = { type: "create-group" };
      isEditingGroup = false;
      renderGroupModal();
      break;
    }
    case "import-whatsapp-group": {
      modalState = {};
      modal = { type: "import-group" };
      renderImportGroupModal();
      break;
    }
    case "import-group-confirmed": {
      const sel = document.getElementById("import-group-select");
      const wahaGroupId = sel ? sel.value : "";
      const info = document.getElementById("import-group-info");
      if (!wahaGroupId) {
        if (info) info.textContent = "Please choose a group to import.";
        return;
      }
      if (info) info.textContent = "Importing members...";
      (async () => {
        try {
          const result = await api("/waha/groups/import", {
            method: "POST",
            body: JSON.stringify({ wahaGroupId })
          });
          alert(`Imported "${result.groupName}" — ${result.added} added, ${result.skipped} already present.`);
          await syncFromBackend();
          closeModal();
          renderPage();
        } catch (err) {
          if (info) info.textContent = err.message;
        }
      })();
      break;
    }
    case "scan-interactions": {
      (async () => {
        try {
          const result = await api("/waha/interactions/scan", { method: "POST" });
          alert(result.message || "Scan complete.");
          await syncFromBackend();
          renderPage();
        } catch (err) {
          alert("Scan failed: " + err.message);
        }
      })();
      break;
    }
    // Senders (settings)
    case "add-sender-confirmed": {
      const nameInput = document.getElementById("add-sender-name");
      const resultEl = document.getElementById("add-sender-result");
      const name = nameInput ? nameInput.value.trim() : "";
      if (!name) {
        if (resultEl) resultEl.textContent = "Please enter a sender name.";
        return;
      }
      (async () => {
        try {
          const created = await api("/senders", { method: "POST", body: JSON.stringify({ name }) });
          closeModal();
          // Open the scan modal for the newly created sender
          renderScanSenderQrModal(created.id, created.name);
        } catch (err) {
          if (resultEl) resultEl.textContent = err.message;
        }
      })();
      break;
    }
    case "scan-sender": {
      const id = actionEl.dataset.id;
      (async () => {
        try {
          const senders = await api("/senders");
          const sender = senders.find(s => s.id === Number(id));
          renderScanSenderQrModal(id, sender ? sender.name : "Sender");
        } catch (err) {
          alert("Failed to load sender: " + err.message);
        }
      })();
      break;
    }
    case "save-scanned-sender": {
      const id = actionEl.dataset.id;
      (async () => {
        try {
          // Mark as default (keeps it saved & makes it the active sender)
          await api("/senders/" + id, { method: "PATCH", body: JSON.stringify({ isDefault: true }) });
          closeModal();
          alert("Sender saved as default.");
          renderSettingsPage();
        } catch (err) {
          alert("Failed to save sender: " + err.message);
        }
      })();
      break;
    }
    case "save-sender": {
      const id = actionEl.dataset.id;
      (async () => {
        try {
          await api("/senders/" + id, { method: "PATCH", body: JSON.stringify({ isDefault: true }) });
          alert("Sender set as default.");
          renderSettingsPage();
        } catch (err) {
          alert("Failed to save sender: " + err.message);
        }
      })();
      break;
    }
    case "delete-sender": {
      const id = actionEl.dataset.id;
      if (confirm("Delete this sender? This disconnects the WhatsApp session too.")) {
        (async () => {
          try {
            await api("/senders/" + id, { method: "DELETE" });
            renderSettingsPage();
          } catch (err) {
            alert("Failed to delete sender: " + err.message);
          }
        })();
      }
      break;
    }
    case "edit-group": {
      e.stopPropagation();
      const groupId = actionEl.dataset.id;
      activeGroupId = groupId;
      modal = { type: "view-group", groupId: groupId };
      isEditingGroup = true;
      selectedContacts.clear();
      renderPage();
      break;
    }
    case "add-contact-to-group-inline": {
      const groupId = actionEl.dataset.id;
      activeGroupId = groupId;
      modal = { type: "add-contact-inline", groupId: groupId };
      modalState = { tab: "manual", contacts: [], parsed: [], fileName: null, count: null, error: null };
      renderAddContactModal();
      break;
    }
    case "save-group-inline": {
      const newName = document.getElementById("edit-group-name").value.trim();
      if (!newName) {
        alert("Group name cannot be empty");
        return;
      }
      (async () => {
        const groupId = actionEl.dataset.id;
        await api("/groups/" + groupId, { method: "PATCH", body: JSON.stringify({ name: newName }) });
        await syncFromBackend();
        isEditingGroup = false;
        selectedContacts.clear();
        renderPage();
      })();
      break;
    }
    case "cancel-group-inline": {
      isEditingGroup = false;
      selectedContacts.clear();
      renderPage();
      break;
    }
    case "edit-contact-inline": {
      editingContactIndex = Number(actionEl.dataset.index);
      renderPage();
      break;
    }
    case "cancel-contact-inline": {
      editingContactIndex = null;
      renderPage();
      break;
    }
    case "save-contact-inline": {
      const groupId = actionEl.dataset.groupId;
      const idx = Number(actionEl.dataset.index);
      const group = groups.find(g => g.id === groupId);
      const nameVal = document.getElementById("inline-contact-name").value.trim();
      const phoneVal = document.getElementById("inline-contact-phone").value.trim();
      const emailVal = document.getElementById("inline-contact-email").value.trim();
      if (!phoneVal) {
        alert("Phone number is required");
        return;
      }
      (async () => {
        if (group && group.contacts[idx]) {
          const contactId = group.contacts[idx].id;
          try {
            await api("/contacts/" + contactId, { method: "PATCH", body: JSON.stringify({ name: nameVal, phone: phoneVal, email: emailVal }) });
          } catch (err) {
            alert("Database Error updating contact: " + err.message);
            console.error(err);
          }
        }
        await syncFromBackend();
        editingContactIndex = null;
        renderPage();
      })();
      break;
    }
    case "toggle-select-all-contacts": {
      const g = groups.find(x => x.id === activeGroupId);
      if (g) {
        if (selectedContacts.size === g.contacts.length) {
          selectedContacts.clear();
        } else {
          selectedContacts = new Set(g.contacts.map((_, i) => i));
        }
        renderPage();
      }
      break;
    }
    case "toggle-contact-checkbox": {
      const idx = Number(actionEl.dataset.index);
      if (selectedContacts.has(idx)) {
        selectedContacts.delete(idx);
      } else {
        selectedContacts.add(idx);
      }
      renderPage();
      break;
    }
    case "delete-selected-contacts": {
      const g = groups.find(x => x.id === activeGroupId);
      if (g && selectedContacts.size > 0) {
        const indices = Array.from(selectedContacts);
        const contactIdsToDelete = indices.map(idx => g.contacts[idx]?.id).filter(Boolean);
        if (contactIdsToDelete.length > 0) {
          renderDeleteContactsModal(selectedContacts.size, contactIdsToDelete, g.id);
        }
      }
      break;
    }
    case "delete-contacts-confirmed": {
      const groupId = actionEl.dataset.id;
      const contactIds = modal.contactIds;
      if (groupId && contactIds && contactIds.length > 0) {
        (async () => {
          try {
            for (const cid of contactIds) {
              await api("/groups/" + groupId + "/contacts/" + cid, { method: "DELETE" });
            }
          } catch (err) {
            alert("Database Error deleting contacts: " + err.message);
            console.error(err);
          }
          await syncFromBackend();
          selectedContacts.clear();
          closeModal();
          renderPage();
        })();
      }
      break;
    }
    case "toggle-add-tab": {
      modalState.tab = actionEl.dataset.tab;
      renderAddContactModal();
      break;
    }
    case "add-contact-to-temp-list": {
      const nameInput = document.getElementById("m-contact-name");
      const phoneInput = document.getElementById("m-contact-phone");
      const emailInput = document.getElementById("m-contact-email");
      const name = nameInput.value.trim();
      const rawPhone = phoneInput.value.trim();
      const email = emailInput ? emailInput.value.trim() : "";
      if (!rawPhone) {
        alert("Phone number is required");
        return;
      }
      const cleanedPhone = cleanPhoneNumber(rawPhone);

      const g = groups.find(x => x.id === modal.groupId);
      const existsInGroup = g ? g.contacts.some(c => cleanPhoneNumber(c.phone) === cleanedPhone) : false;
      const existsInTemp = (modalState.contacts || []).some(c => cleanPhoneNumber(c.phone) === cleanedPhone);

      if (existsInGroup) {
        alert("This contact is already in the group.");
        return;
      }
      if (existsInTemp) {
        alert("This contact is already in the queue to be added.");
        return;
      }

      if (!modalState.contacts) modalState.contacts = [];
      modalState.contacts.push({ name: name || 'No Name', phone: cleanedPhone, email: email });
      modalState.contactName = "";
      modalState.contactPhone = "";
      modalState.contactEmail = "";
      renderAddContactModal();
      break;
    }
    case "remove-temp-contact": {
      const idx = Number(actionEl.dataset.index);
      modalState.contacts.splice(idx, 1);
      renderAddContactModal();
      break;
    }
    case "trigger-file-select": {
      document.getElementById("csv-file-inline").click();
      break;
    }
    case "download-template-inline": {
      downloadTemplate();
      break;
    }
    case "save-added-contacts": {
      const g = groups.find(x => x.id === modal.groupId);
      (async () => {
        if (g) {
          const list = modalState.tab === 'manual' ? modalState.contacts : modalState.parsed;

          const uniqueNewContacts = [];
          const seenInList = new Set();
          const existingPhones = new Set(g.contacts.map(c => cleanPhoneNumber(c.phone)));

          for (const c of (list || [])) {
            const cleanedPhone = cleanPhoneNumber(c.phone);
            if (cleanedPhone.length > 5 && !existingPhones.has(cleanedPhone) && !seenInList.has(cleanedPhone)) {
              seenInList.add(cleanedPhone);
              uniqueNewContacts.push({
                name: c.name ? String(c.name).trim() : 'No Name',
                phone: cleanedPhone,
                email: c.email ? String(c.email).trim() : ''
              });
            }
          }

          // Write new contacts to DB and map them to the group (bulk upsert via backend)
          if (uniqueNewContacts.length > 0) {
            try {
              await api("/groups/" + g.id + "/contacts", { method: "POST", body: JSON.stringify({ contacts: uniqueNewContacts }) });
            } catch (err) {
              console.error("Database Error inserting contacts: ", err);
            }
          }
        }
        await syncFromBackend();
        closeModal();
        renderPage();
      })();
      break;
    }
    case "remove-contact-inline": {
      const groupId = actionEl.dataset.groupId;
      const idx = Number(actionEl.dataset.index);
      const group = groups.find(g => g.id === groupId);
      if (group && confirm(`Remove ${group.contacts[idx].name} from this group?`)) {
        (async () => {
          const contactId = group.contacts[idx].id;
          try {
            await api("/groups/" + groupId + "/contacts/" + contactId, { method: "DELETE" });
          } catch (err) {
            alert("Database Error removing contact: " + err.message);
            console.error(err);
          }
          await syncFromBackend();
          renderPage();
        })();
      }
      break;
    }
    case "add-contact-to-group": {
      const name = modalState.contactName.trim();
      const rawPhone = modalState.contactPhone.trim();
      if (name && rawPhone) {
        const cleanedPhone = cleanPhoneNumber(rawPhone);

        const existsInTemp = modalState.contacts.some(c => cleanPhoneNumber(c.phone) === cleanedPhone);
        if (existsInTemp) {
          alert("This contact is already in the list.");
          return;
        }

        modalState.contacts.push({
          name: name,
          phone: cleanedPhone
        });
        modalState.contactName = "";
        modalState.contactPhone = "";
        renderGroupModal(modal.type === 'edit-group');
      }
      break;
    }
    case "remove-contact-from-modal": {
      const idx = Number(actionEl.dataset.index);
      modalState.contacts.splice(idx, 1);
      renderGroupModal(modal.type === 'edit-group');
      break;
    }
    case "save-group": {
      if (!modalState.name.trim()) return;

      (async () => {
        try {
          if (modal.type === 'edit-group') {
            const groupId = modalState.id;
            await api("/groups/" + groupId, { method: "PATCH", body: JSON.stringify({ name: modalState.name.trim() }) });
          } else {
            await api("/groups", { method: "POST", body: JSON.stringify({ name: modalState.name.trim() }) });
          }
        } catch (err) {
          alert("Error saving group: " + err.message);
          return;
        }
        await syncFromBackend();
        closeModal();
        isEditingGroup = false;
        renderPage();
      })();
      break;
    }
    case "delete-group": {
      e.stopPropagation();
      const groupId = actionEl.dataset.id;
      const group = groups.find(g => g.id === groupId);
      if (group) {
        renderDeleteGroupModal(groupId, group.name);
      }
      break;
    }
    case "delete-group-confirmed": {
      const groupId = actionEl.dataset.id;
      (async () => {
        try {
          await api("/groups/" + groupId, { method: "DELETE" });
        } catch (err) {
          alert("Database Error: " + err.message);
          console.error(err);
        }
        await syncFromBackend();
        closeModal();
        renderPage();
      })();
      break;
    }

    // Templates
    case "create-template": {
      modalState = { name: "", message: "", channel: "whatsapp", emailSubject: "", hasMedia: false, mediaUrl: "" };
      modal = { type: "create-template" };
      renderTemplateModal();
      break;
    }
    case "edit-template": {
      const t = templates.find(x => x.id === actionEl.dataset.id);
      modalState = { ...t };
      modal = { type: "edit-template" };
      renderTemplateModal(true);
      break;
    }
    case "toggle-media": {
      modalState.hasMedia = !modalState.hasMedia;
      renderTemplateModal(modal.type === 'edit-template');
      break;
    }
    case "trigger-template-media-select": {
      document.getElementById("template-media-file").click();
      break;
    }
    case "remove-template-media": {
      modalState.mediaUrl = "";
      renderTemplateModal(modal.type === 'edit-template');
      break;
    }
    case "remove-attachment": {
      const idx = actionEl.dataset.index;
      if (modalState.attachments && idx !== undefined) {
        modalState.attachments.splice(parseInt(idx, 10), 1);
        renderTemplateModal(modal.type === 'edit-template');
      }
      break;
    }
    case "save-template": {
      const channel = modalState.channel || "whatsapp";
      if (!modalState.name.trim() || !modalState.message.trim()) return;
      if (channel === "email" && !modalState.emailSubject.trim()) {
        alert("Email Subject is required for email templates.");
        return;
      }

      (async () => {
        const isEmail = channel === "email";
        const hasMedia = !isEmail && modalState.hasMedia;

        const payload = {
          name: modalState.name.trim(),
          message_text: modalState.message.trim(),
          channel: channel,
          email_subject: isEmail ? modalState.emailSubject.trim() : null,
          media_url: hasMedia ? modalState.mediaUrl : null,
          media_type: hasMedia ? 'image' : null,
          attachments: isEmail ? (modalState.attachments || []) : []
        };

        try {
          if (modal.type === 'edit-template') {
            const templateId = modalState.id;
            await api("/templates/" + templateId, { method: "PATCH", body: JSON.stringify(payload) });
          } else {
            await api("/templates", { method: "POST", body: JSON.stringify(payload) });
          }
        } catch (err) {
          alert("Error saving template: " + err.message);
          return;
        }
        await syncFromBackend();
        closeModal();
        renderPage();
      })();
      break;
    }
    case "delete-template": {
      if (confirm("Delete this template?")) {
        (async () => {
          await api("/templates/" + actionEl.dataset.id, { method: "DELETE" });
          await syncFromBackend();
          renderPage();
        })();
      }
      break;
    }

    // Campaigns
    case "create-campaign": {
      modalState = { name: "", groupIds: [], templateId: "" };
      modal = { type: "create-campaign" };
      renderCampaignModal();
      break;
    }
    case "toggle-group-selection": {
      const gId = actionEl.dataset.id;
      if (!modalState.groupIds) modalState.groupIds = [];
      const index = modalState.groupIds.indexOf(gId);
      if (index > -1) {
        modalState.groupIds.splice(index, 1);
      } else {
        modalState.groupIds.push(gId);
      }
      renderCampaignModal();
      // Keep dropdown menu open when selecting
      const dropdown = document.getElementById("group-select-dropdown");
      if (dropdown) dropdown.style.display = "block";
      break;
    }
    case "deselect-group-chip": {
      const gId = actionEl.dataset.id;
      if (modalState.groupIds) {
        modalState.groupIds = modalState.groupIds.filter(id => id !== gId);
      }
      renderCampaignModal();
      break;
    }
    case "filter-templates": {
      activeTemplateFilter = actionEl.dataset.value;
      renderTemplatesPage();
      break;
    }
    case "filter-campaigns": {
      activeCampaignFilter = actionEl.dataset.value;
      renderCampaignsPage();
      break;
    }
    case "save-campaign": {
      if (!modalState.name.trim() || !modalState.groupIds || modalState.groupIds.length === 0 || !modalState.templateId) {
        alert("Please fill all required fields and select at least one group.");
        return;
      }

      const targetTypeEl = document.querySelector('input[name="m-targetType"]:checked');
      const isGroupTarget = targetTypeEl && targetTypeEl.value === 'group';
      const finalCampaignName = modalState.name.trim() + (isGroupTarget ? ' [GROUP TARGET]' : '');
      const delayEl = document.querySelector('input[name="m-delay"]:checked');
      const delaySeconds = delayEl ? parseInt(delayEl.value, 10) : 15;

      (async () => {
        // Calculate total recipient count from all selected groups
        let totalCount = 0;
        modalState.groupIds.forEach(gId => {
          const group = groups.find(g => g.id === gId);
          if (group) {
            totalCount += group.contacts.length;
          }
        });

        const template = templates.find(t => t.id === modalState.templateId);
        const onlyInteractions = !!(document.getElementById("m-only-interactions")?.checked);

        try {
          const created = await api("/campaigns", {
            method: "POST",
            body: JSON.stringify({
              name: finalCampaignName,
              groupIds: modalState.groupIds,
              templateId: modalState.templateId,
              channel: template?.channel || 'whatsapp',
              delaySeconds: delaySeconds,
              onlyInteractions: onlyInteractions
            })
          });
          void created;
        } catch (err) {
          alert("Error creating campaign: " + err.message);
          return;
        }

        await syncFromBackend();
        closeModal();
        renderPage();
      })();
      break;
    }
    case "start-campaign": {
      console.log("=== START CAMPAIGN CLICKED ===");
      console.log("Button dataset ID:", actionEl.dataset.id);

      const c = campaigns.find(x => x.id === actionEl.dataset.id);
      console.log("Campaign object found in memory:", c);

      if (!c) {
        alert("Error: Campaign not found in UI list!");
        return;
      }

      console.log("Messages sent today:", dailyStats.messagesSent, "Limit:", dailyStats.limit);
      if (dailyStats.messagesSent >= dailyStats.limit) {
        alert("⚠️ Daily limit reached! Cannot start campaign.");
        return;
      }

      // 1. Immediately update status in UI to 'sending'
      console.log("Starting campaign. Setting status to 'sending'...");
      c.status = "sending";
      renderPage();

      (async () => {
        try {
          // Trigger the backend campaign engine (replaces n8n webhook)
          const payload = {
            waha_session: settingsState.wahaSession || "Tester"
          };
          if (settingsState.isSandboxMode && settingsState.testPhoneNumber) {
            payload.is_test = true;
            payload.test_phone = settingsState.testPhoneNumber;
          }

          console.log("Sending campaign start to backend:", c.id, payload);
          await api("/campaigns/" + c.id + "/start", {
            method: "POST",
            body: JSON.stringify(payload)
          });

          // Sync from backend and render page (status becomes 'sending')
          await syncFromBackend();
          renderPage();
        } catch (err) {
          console.error("Error launching campaign:", err);
          alert("Failed to start campaign: " + err.message);
          c.status = "failed";
          await syncFromBackend();
          renderPage();
        }
      })();
      break;
    }

    case "view-campaign": {
      activeCampaignId = actionEl.dataset.id;
      modal = { type: "view-campaign", campaignId: actionEl.dataset.id };
      renderPage();
      break;
    }
    case "back-to-campaigns": {
      activeCampaignId = null;
      modal = null;
      renderPage();
      break;
    }
    case "delete-campaign": {
      e.stopPropagation();
      const campaignId = actionEl.dataset.id;
      const campaign = campaigns.find(c => c.id === campaignId);
      if (campaign) {
        renderDeleteCampaignModal(campaignId, campaign.name);
      }
      break;
    }
    case "delete-campaign-confirmed": {
      const campaignId = actionEl.dataset.id;
      (async () => {
        try {
          await api("/campaigns/" + campaignId, { method: "DELETE" });
        } catch (err) {
          alert("Database Error deleting campaign: " + err.message);
          console.error(err);
        }
        await syncFromBackend();
        closeModal();
        renderPage();
      })();
      break;
    }

    // Calendar
    case "prev-month": {
      selectedDate.setMonth(selectedDate.getMonth() - 1);
      renderCalendarPage();
      break;
    }
    case "next-month": {
      selectedDate.setMonth(selectedDate.getMonth() + 1);
      renderCalendarPage();
      break;
    }
  }
});

document.addEventListener("input", (e) => {
  const field = e.target.dataset.field;
  if (!field) return;
  modalState[field] = e.target.value;

  if (modal && (modal.type === 'create-template' || modal.type === 'edit-template')) {
    if (field === 'message') {
      const processSpintax = (text) => text.replace(/\{([^{}]+)\}/g, (match, content) => {
        const options = content.split('|');
        return options[Math.floor(Math.random() * options.length)];
      });
      const rawVal = e.target.value || "Your message preview will appear here...";
      const parsedVal = processSpintax(rawVal);

      const previewTextEl = document.getElementById("whatsapp-preview-text");
      if (previewTextEl) {
        previewTextEl.innerHTML = escapeHtml(parsedVal);
      }
      const emailBodyEl = document.getElementById("email-preview-body");
      if (emailBodyEl) {
        emailBodyEl.innerHTML = parsedVal;
      }
    }
    if (field === 'emailSubject') {
      const emailSubjectEl = document.getElementById("email-preview-subject");
      if (emailSubjectEl) {
        emailSubjectEl.textContent = e.target.value || "(No Subject)";
      }
    }
  }
});

document.addEventListener("change", (e) => {
  if (e.target.name === "m-addType") {
    modalState.contactType = e.target.value;
    renderAddContactModal();
    return;
  }

  if (e.target.dataset.field === "channel") {
    modalState.channel = e.target.value;
    renderTemplateModal(modal.type === 'edit-template');
    return;
  }

  if (e.target.id === "template-media-file") {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        modalState.mediaUrl = reader.result;
        renderTemplateModal(modal.type === 'edit-template');
      };
      reader.readAsDataURL(file);
    }
    return;
  }

  if (e.target.id === "template-attachment-file") {
    const files = Array.from(e.target.files);
    if (!modalState.attachments) modalState.attachments = [];
    
    let loadedCount = 0;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        modalState.attachments.push({
          name: file.name,
          type: file.type,
          data: reader.result
        });
        loadedCount++;
        if (loadedCount === files.length) {
          renderTemplateModal(modal.type === 'edit-template');
        }
      };
      reader.readAsDataURL(file);
    });
    return;
  }

  if (e.target.id === "csv-file-inline") {
    const file = e.target.files[0];
    if (file) {
      modalState.fileName = file.name;
      handleCsvFile(file, (numbers, err) => {
        if (err) {
          modalState.error = err;
          modalState.parsed = [];
          modalState.count = null;
        } else {
          Object.assign(modalState, processCsvNumbers(numbers));
        }
        renderAddContactModal();
      });
    }
    return;
  }

  if (e.target.classList.contains("campaign-group-checkbox")) {
    if (!modalState.groupIds) {
      modalState.groupIds = [];
    }
    const val = e.target.value;
    if (e.target.checked) {
      if (!modalState.groupIds.includes(val)) {
        modalState.groupIds.push(val);
      }
    } else {
      modalState.groupIds = modalState.groupIds.filter(id => id !== val);
    }
    modalState.groupId = modalState.groupIds[0] || "";
    return;
  }

  const field = e.target.dataset.field;
  if (!field) return;
  modalState[field] = e.target.value;
});

/* ---------- Drag and Drop support for CSV & Media ---------- */

document.addEventListener("dragover", (e) => {
  const dropzone = e.target.closest("#csv-dropzone") || e.target.closest("#template-media-dropzone");
  if (dropzone) {
    e.preventDefault();
    dropzone.style.borderColor = "var(--violet)";
    dropzone.style.background = "var(--violet-light)";
  }
});

document.addEventListener("dragleave", (e) => {
  const dropzone = e.target.closest("#csv-dropzone") || e.target.closest("#template-media-dropzone");
  if (dropzone) {
    dropzone.style.borderColor = "var(--violet-border)";
    dropzone.style.background = "var(--bg)";
  }
});

document.addEventListener("drop", (e) => {
  const csvDropzone = e.target.closest("#csv-dropzone");
  const mediaDropzone = e.target.closest("#template-media-dropzone");

  if (csvDropzone) {
    e.preventDefault();
    csvDropzone.style.borderColor = "var(--violet-border)";
    csvDropzone.style.background = "var(--bg)";
    const file = e.dataTransfer.files[0];
    if (file) {
      modalState.fileName = file.name;
      handleCsvFile(file, (numbers, err) => {
        if (err) {
          modalState.error = err;
          modalState.parsed = [];
          modalState.count = null;
        } else {
          Object.assign(modalState, processCsvNumbers(numbers));
        }
        renderAddContactModal();
      });
    }
  } else if (mediaDropzone) {
    e.preventDefault();
    mediaDropzone.style.borderColor = "var(--violet-border)";
    mediaDropzone.style.background = "var(--bg)";
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        modalState.mediaUrl = reader.result;
        renderTemplateModal(modal.type === 'edit-template');
      };
      reader.readAsDataURL(file);
    }
  }
});

/* ---------- Real-time Validation for Duplicate Numbers ---------- */

document.addEventListener("input", (e) => {
  if (e.target.id === "m-contact-phone") {
    const rawPhone = e.target.value.trim();
    const msgEl = document.getElementById("m-phone-validation-message");
    const addBtn = document.querySelector("[data-action='add-contact-to-temp-list']");
    if (!msgEl) return;

    if (!rawPhone) {
      msgEl.style.display = "none";
      if (addBtn) addBtn.disabled = false;
      return;
    }

    const cleaned = cleanPhoneNumber(rawPhone);
    const group = groups.find(g => g.id === modal.groupId);
    const existsInGroup = group ? group.contacts.some(c => cleanPhoneNumber(c.phone) === cleaned) : false;
    const existsInTemp = (modalState.contacts || []).some(c => cleanPhoneNumber(c.phone) === cleaned);

    if (existsInGroup) {
      msgEl.innerHTML = `<span style="color: var(--red); font-weight: 500; display: block; padding-top: 2px;">⚠️ This contact number is already in this group.</span>`;
      msgEl.style.display = "block";
      if (addBtn) addBtn.disabled = true;
    } else if (existsInTemp) {
      msgEl.innerHTML = `<span style="color: var(--violet); font-weight: 500; display: block; padding-top: 2px;">💡 This contact number is already in the queue below.</span>`;
      msgEl.style.display = "block";
      if (addBtn) addBtn.disabled = true;
    } else {
      msgEl.style.display = "none";
      if (addBtn) addBtn.disabled = false;
    }
  }
});

let currentUser = null;
let syncInterval = null;

// Restore session on load (backend JWT)
let lastDataSignature = "";

// Compute a lightweight signature of the app state so we can detect real changes
function dataSignature() {
  const sig = {
    g: groups.map(g => g.id + ':' + g.contacts.length).join(','),
    t: templates.map(t => t.id + ':' + t.channel).join(','),
    c: campaigns.map(c => c.id + ':' + c.status + ':' + c.sentCount + ':' + c.failedCount).join(','),
    d: dailyStats.messagesSent + '/' + dailyStats.limit
  };
  return JSON.stringify(sig);
}

async function initAuth() {
  const loginOverlay = document.getElementById("login-overlay");
  const appContainer = document.querySelector(".app");

  if (authToken) {
    try {
      const me = await api("/auth/me");
      currentUser = { id: me.id, email: me.email };
      if (loginOverlay) loginOverlay.style.display = "none";
      if (appContainer) appContainer.style.display = "flex";
      await syncFromBackend();
      lastDataSignature = dataSignature();
      renderPage();
      if (!syncInterval) {
        syncInterval = setInterval(async () => {
          // Never disturb the user while they're in a modal, editing, or typing
          if (modal || isEditingGroup || editingContactIndex !== null || currentUser === null) return;
          // Don't re-render if nothing meaningful changed
          const before = dataSignature();
          try { await syncFromBackend(); } catch (e) { console.error("Interval sync error:", e); return; }
          const after = dataSignature();
          if (before !== after) {
            lastDataSignature = after;
            renderPage();
          }
        }, 15000); // slower: every 15s, and only re-renders on real change
      }
      return;
    } catch (err) {
      // Token invalid/expired
      authToken = null;
      localStorage.removeItem("fly_blaster_token");
    }
  }
  currentUser = null;
  if (loginOverlay) loginOverlay.style.display = "flex";
  if (appContainer) appContainer.style.display = "flex";
  renderPage();
}

// Boot auth on page load
initAuth();

// Handle login form submission
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const errorEl = document.getElementById("login-error");
  const submitBtn = e.target.querySelector("button[type='submit']");

  if (errorEl) errorEl.style.display = "none";
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Signing In...";
  }

  try {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    authToken = data.token;
    localStorage.setItem("fly_blaster_token", data.token);
    currentUser = { id: data.user.id, email: data.user.email };
    const loginOverlay = document.getElementById("login-overlay");
    if (loginOverlay) loginOverlay.style.display = "none";
    document.querySelector(".app").style.display = "flex";
    await syncFromBackend();
    renderPage();
  } catch (err) {
    if (errorEl) {
      errorEl.textContent = err.message || "Invalid login credentials";
      errorEl.style.display = "block";
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign In";
    }
  }
});

// Handle logout button click
document.getElementById("logout-btn")?.addEventListener("click", async () => {
  if (confirm("Are you sure you want to logout?")) {
    authToken = null;
    localStorage.removeItem("fly_blaster_token");
    currentUser = null;
    const loginOverlay = document.getElementById("login-overlay");
    if (loginOverlay) loginOverlay.style.display = "flex";
    location.reload();
  }
});

// Mobile menu toggle logic
document.getElementById("menu-toggle-btn")?.addEventListener("click", () => {
  document.querySelector(".sidebar")?.classList.add("open");
  document.getElementById("sidebar-overlay")?.classList.add("visible");
});

document.getElementById("sidebar-overlay")?.addEventListener("click", () => {
  document.querySelector(".sidebar")?.classList.remove("open");
  document.getElementById("sidebar-overlay")?.classList.remove("visible");
});
