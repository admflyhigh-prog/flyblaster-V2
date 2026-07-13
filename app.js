/* ==========================================================
   Fly Blaster — Contacts
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
  xSmall: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m18 6-12 12M6 6l12 12"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  users: '<svg viewBox="0 0 24 24" width="12.5" height="12.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  fileText: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/></svg>',
  alert: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>',
  search: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
  copy: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
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

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/* ---------- App state ---------- */

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
      { name: "Amirul Hakim", phone: "+60176543210" },
      { name: "Fatimah binti Hassan", phone: "+60165432109" },
      { name: "Tan Choon Hwa", phone: "+60154321098" },
    ],
    created: "2026-06-28",
  },
  {
    id: uid(),
    name: "Form 4 Physics Batch",
    contacts: [
      { name: "Muhammad Azlan", phone: "+60111222333" },
      { name: "Priya Kumari", phone: "+60144556677" },
      { name: "Chen Wei Ming", phone: "+60133445566" },
      { name: "Nurul Aina", phone: "+60122334455" },
    ],
    created: "2026-07-02",
  },
];

let activeNav = "contacts";
let selectedGroupId = null;  // track which group's contacts are being viewed
let modal = null;        // { type: 'create'|'add'|'upload'|'edit'|'delete'|'delete-contact', groupId }
let modalState = {};      // scratch state for whichever modal is open
let searchQuery = "";     // search filter for contacts
let selectedContacts = new Set();  // indices of selected contacts for bulk actions in edit modal

/* ---------- CSV helpers ---------- */

function downloadTemplate() {
  const csv = "name,phone_number\nAhmad bin Ali,+60123456789\nSiti Nurhaliza,+60129876543\n";
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

function downloadGroupContacts(groupId) {
  const group = groups.find(g => g.id === groupId);
  if (!group) return;

  const rows = group.contacts.map(c => {
    const name = typeof c === 'string' ? '' : (c.name || '');
    const phone = typeof c === 'string' ? c : c.phone;
    return `${name},${phone}`;
  });

  const csv = "name,phone_number\n" + rows.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${group.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_contacts.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function copyGroupNumbers(groupId) {
  const group = groups.find(g => g.id === groupId);
  if (!group) return;

  const phones = group.contacts.map(c => typeof c === 'string' ? c : c.phone).join('\n');

  try {
    await navigator.clipboard.writeText(phones);
    // Show temporary success feedback
    const btn = document.querySelector(`[data-action="copy-numbers"][data-id="${groupId}"]`);
    if (btn) {
      const original = btn.innerHTML;
      btn.innerHTML = `${ICON.check} Copied!`;
      setTimeout(() => { btn.innerHTML = original; }, 2000);
    }
  } catch (err) {
    alert('Failed to copy to clipboard');
  }
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
      if (!phone) return null;
      return name ? { name: String(name).trim(), phone: String(phone).trim() } : { phone: String(phone).trim() };
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

/* ---------- Rendering: sidebar ---------- */

function renderNav() {
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.nav === activeNav);
  });
}

/* ---------- Rendering: contacts page ---------- */

function renderContactsPage() {
  const rows = groups.map(g => {
    const p = pastelFor(g.name);
    const contactCount = Array.isArray(g.contacts) ? g.contacts.length : 0;
    return `
      <div class="table-row" data-action="view-group" data-id="${g.id}" style="cursor: pointer;">
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
          <button class="icon-btn violet" title="Add contacts" data-action="open-add" data-id="${g.id}">${ICON.userPlus}</button>
          <button class="icon-btn violet" title="Upload CSV" data-action="open-upload" data-id="${g.id}">${ICON.upload}</button>
          <button class="icon-btn" title="Edit group" data-action="open-edit" data-id="${g.id}">${ICON.pencil}</button>
          <button class="icon-btn red" title="Delete group" data-action="open-delete" data-id="${g.id}">${ICON.trash}</button>
        </div>
      </div>`;
  }).join("");

  const html = `
    <div class="wrap">
      <div class="page-header">
        <div>
          <h1>Contact groups</h1>
          <p>Name a group first, then attach the numbers it should reach.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-ghost" data-action="download-template">${ICON.download} Download CSV template</button>
          <button class="btn btn-primary" data-action="open-create">${ICON.plus} New group</button>
        </div>
      </div>

      <div class="table-card">
        <div class="table-head">
          <div>Group name</div>
          <div>Contacts</div>
          <div>Created</div>
          <div style="text-align:right">Actions</div>
        </div>
        ${groups.length ? rows : `<div class="empty-state">No groups yet. Create one to start adding contacts.</div>`}
      </div>
    </div>`;

  document.getElementById("page-contacts").innerHTML = html;
}

function renderContactsDetailPage() {
  const group = groups.find(g => g.id === selectedGroupId);
  if (!group) return;

  const p = pastelFor(group.name);

  // Filter contacts based on search query
  const filteredContacts = group.contacts
    .map((contact, idx) => ({ contact, originalIdx: idx }))
    .filter(({ contact }) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      const phone = typeof contact === 'string' ? contact : contact.phone;
      const name = typeof contact === 'string' ? '' : (contact.name || '');
      return phone.toLowerCase().includes(query) || name.toLowerCase().includes(query);
    });

  const contactRows = filteredContacts.map(({ contact, originalIdx }) => {
    const phone = typeof contact === 'string' ? contact : contact.phone;
    const name = typeof contact === 'string' ? '' : (contact.name || '');
    const displayName = name || phone;

    return `
    <div class="contact-row">
      <div class="contact-avatar" style="background:${p.bg};color:${p.text}">${initialsFor(displayName)}</div>
      <div class="contact-name-cell">${name ? escapeHtml(name) : '—'}</div>
      <div class="contact-phone-cell">${escapeHtml(phone)}</div>
      <div class="contact-actions">
        <button class="icon-btn red" title="Remove contact" data-action="remove-contact" data-index="${originalIdx}">${ICON.trash}</button>
      </div>
    </div>
  `;
  }).join("");

  const showEmpty = group.contacts.length === 0;
  const showNoResults = group.contacts.length > 0 && filteredContacts.length === 0;

  const html = `
    <div class="wrap">
      <button class="btn-back" data-action="back-to-groups">${ICON.arrowLeft} Back to groups</button>

      <div class="detail-header">
        <div class="detail-header-left">
          <h1>${escapeHtml(group.name)}</h1>
          <div class="detail-stats">
            <div class="stat-item">
              ${ICON.users}
              <span class="stat-value">${group.contacts.length}</span>
              contact${group.contacts.length === 1 ? "" : "s"}
            </div>
            <div class="stat-item">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              Created ${formatDate(group.created)}
            </div>
          </div>
        </div>
        <div class="detail-actions">
          <button class="btn btn-primary" title="Add contacts" data-action="open-add" data-id="${group.id}">${ICON.userPlus} Add contacts</button>
          <button class="btn btn-ghost" title="Edit group" data-action="open-edit" data-id="${group.id}">${ICON.pencil} Edit</button>
        </div>
      </div>

      ${group.contacts.length > 0 ? `
        <div class="info-card">
          <div class="info-card-icon">${ICON.fileText}</div>
          <div class="info-card-content">
            <div class="info-card-title">Ready to blast</div>
            <p class="info-card-text">This group has ${group.contacts.length} contact${group.contacts.length === 1 ? '' : 's'} ready for your next campaign. ${searchQuery ? `Showing ${filteredContacts.length} result${filteredContacts.length === 1 ? '' : 's'}.` : 'Use the search to quickly find specific contacts.'}</p>
          </div>
        </div>

        <div class="toolbar-row">
          <div class="search-bar">
            <div class="search-icon">${ICON.search}</div>
            <input
              type="text"
              class="search-input"
              placeholder="Search by name or phone number..."
              value="${escapeHtml(searchQuery)}"
              data-action="search-contacts"
            />
          </div>
          <div class="toolbar-actions">
            <button class="btn btn-ghost" title="Upload CSV" data-action="open-upload" data-id="${group.id}">${ICON.upload} Upload CSV</button>
            <button class="btn btn-ghost" title="Export contacts" data-action="export-contacts" data-id="${group.id}">${ICON.download} Export CSV</button>
          </div>
        </div>
      ` : ''}

      <div class="contacts-list-card">
        ${!showEmpty && !showNoResults ? `
          <div class="contacts-list-header">
            <div></div>
            <div>Name</div>
            <div>Phone Number</div>
            <div style="text-align:right">Actions</div>
          </div>
        ` : ''}
        ${showEmpty ? `
          <div class="empty-state">
            <div class="empty-state-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="empty-state-title">No contacts yet</div>
            <p class="empty-state-desc">This group is empty. Add contacts manually or upload a CSV file to get started.</p>
            <div class="empty-state-action">
              <button class="btn btn-primary" data-action="open-add" data-id="${group.id}">${ICON.userPlus} Add your first contact</button>
            </div>
          </div>
        ` : ''}
        ${showNoResults ? `
          <div class="no-results">
            <div class="no-results-icon">${ICON.search}</div>
            <div class="no-results-title">No matches found</div>
            <p class="no-results-desc">Try adjusting your search query</p>
          </div>
        ` : contactRows}
      </div>
    </div>`;

  document.getElementById("page-contacts-detail").innerHTML = html;
}

const PLACEHOLDER_LABELS = {
  dashboard: "Dashboard",
  templates: "Templates",
  campaign: "Campaign",
  blasting: "Blasting",
  reports: "Reports",
  activity: "Activity Logs",
  settings: "Settings",
};

function renderPage() {
  const contactsPage = document.getElementById("page-contacts");
  const contactsDetailPage = document.getElementById("page-contacts-detail");
  const placeholderPage = document.getElementById("page-placeholder");

  if (activeNav === "contacts") {
    if (selectedGroupId) {
      contactsPage.style.display = "none";
      contactsDetailPage.style.display = "";
      placeholderPage.style.display = "none";
      renderContactsDetailPage();
    } else {
      contactsPage.style.display = "";
      contactsDetailPage.style.display = "none";
      placeholderPage.style.display = "none";
      renderContactsPage();
    }
  } else {
    contactsPage.style.display = "none";
    contactsDetailPage.style.display = "none";
    placeholderPage.style.display = "";
    document.getElementById("placeholder-title").textContent = PLACEHOLDER_LABELS[activeNav] || "";
  }
  renderNav();
}

/* ---------- Rendering: modal shell ---------- */

function modalShell({ title, subtitle, bodyHtml, footerHtml, narrow }) {
  return `
    <div class="overlay" data-action="close-on-backdrop">
      <div class="modal ${narrow ? "narrow" : ""}" data-stop>
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

function chipsHtml(contacts) {
  if (!contacts.length) return "";
  return `<div class="chips">${contacts.map((c, i) => {
    const display = typeof c === 'string' ? c : (c.name ? `${c.name} (${c.phone})` : c.phone);
    return `
    <span class="chip">${escapeHtml(display)}
      <button data-action="remove-chip" data-index="${i}">${ICON.xSmall}</button>
    </span>`;
  }).join("")}</div>`;
}

/* ---------- Modal: Create group ---------- */

function renderCreateModal() {
  const { name, contacts, mode, touched } = modalState;
  const nameValid = name.trim().length > 0;

  const body = `
    <div class="field">
      <label class="field-label">Group name <span class="req">*</span></label>
      <input id="m-name" class="text-input ${touched && !nameValid ? "error" : ""}" type="text"
        value="${escapeHtml(name)}" placeholder="e.g. SPM Trial 2026 — Parents" data-field="name" />
      ${touched && !nameValid ? `<div class="error-text">Name the group before adding contacts.</div>` : ""}
    </div>

    <div class="section-fade ${nameValid ? "enabled" : ""}">
      <label class="field-label">Contacts</label>
      <div class="mode-toggle">
        <button class="mode-btn ${mode === "manual" ? "active" : ""}" data-action="toggle-mode" data-mode="manual">Add manually</button>
        <button class="mode-btn ${mode === "upload" ? "active" : ""}" data-action="toggle-mode" data-mode="upload">Upload CSV</button>
      </div>
      ${mode === "manual" ? `
        <div class="input-row">
          <input id="m-contact" class="text-input" type="text" placeholder="Name, +60123456789 (or just phone)" data-field="contactInput" />
          <button class="btn-chip" data-action="add-manual-contact">${ICON.plus} Add</button>
        </div>
        ${chipsHtml(contacts)}
      ` : renderDropzone()}
    </div>`;

  const footer = `
    <button class="btn btn-ghost" data-action="close-modal">Cancel</button>
    <button class="btn btn-primary" data-action="save-create" ${!nameValid ? "disabled" : ""}>${ICON.check} Save group</button>`;

  document.getElementById("modal-root").innerHTML = modalShell({
    title: "Create new group",
    subtitle: "Name the group before contacts can be added.",
    bodyHtml: body,
    footerHtml: footer,
  });

  focusField("m-name");
}

/* ---------- Modal: Add contacts (existing group) ---------- */

function renderAddModal() {
  const group = groups.find(g => g.id === modal.groupId);
  const { contacts } = modalState;

  const body = `
    <label class="field-label">New contacts</label>
    <div class="input-row">
      <input id="m-contact" class="text-input" type="text" placeholder="Name, +60123456789 (or just phone)" data-field="contactInput" />
      <button class="btn-chip" data-action="add-manual-contact">${ICON.plus} Add</button>
    </div>
    ${chipsHtml(contacts)}
    <div class="hint-note">This group currently has ${group.contacts.length} contact${group.contacts.length === 1 ? "" : "s"}.</div>`;

  const footer = `
    <button class="btn btn-ghost" data-action="close-modal">Cancel</button>
    <button class="btn btn-primary" data-action="save-add" ${contacts.length === 0 ? "disabled" : ""}>
      ${ICON.check} Add ${contacts.length > 0 ? contacts.length + " " : ""}contact${contacts.length === 1 ? "" : "s"}
    </button>`;

  document.getElementById("modal-root").innerHTML = modalShell({
    title: "Add contacts",
    subtitle: `Adding to "${escapeHtml(group.name)}"`,
    bodyHtml: body,
    footerHtml: footer,
  });

  focusField("m-contact");
}

/* ---------- Modal: Upload CSV (existing group) ---------- */

function renderDropzone() {
  const { fileName, count, error } = modalState;
  let resultHtml = "";
  if (count !== null && count !== undefined) {
    resultHtml = `<div class="dropzone-result success">${ICON.check} ${count} contact${count === 1 ? "" : "s"} found</div>`;
  } else if (error) {
    resultHtml = `<div class="dropzone-result error">${ICON.alert} ${error}</div>`;
  }
  return `
    <input id="csv-file" type="file" accept=".csv" hidden />
    <div class="dropzone" data-action="dropzone-click">
      <div class="dropzone-icon">${ICON.upload}</div>
      <div class="dropzone-title">${fileName ? escapeHtml(fileName) : "Click to upload, or drag a CSV here"}</div>
      <div class="dropzone-sub">Use the template columns: name, phone_number</div>
    </div>
    ${resultHtml}`;
}

function renderUploadModal() {
  const group = groups.find(g => g.id === modal.groupId);
  const parsedCount = modalState.parsed.length;

  const body = `
    <div class="template-hint">
      ${ICON.fileText} Don't have the template yet?
      <button data-action="download-template">Download it here</button>
    </div>
    ${renderDropzone()}`;

  const footer = `
    <button class="btn btn-ghost" data-action="close-modal">Cancel</button>
    <button class="btn btn-primary" data-action="save-upload" ${parsedCount === 0 ? "disabled" : ""}>
      ${ICON.check} Add ${parsedCount > 0 ? parsedCount + " " : ""}contact${parsedCount === 1 ? "" : "s"}
    </button>`;

  document.getElementById("modal-root").innerHTML = modalShell({
    title: "Upload contacts in bulk",
    subtitle: `Adding to "${escapeHtml(group.name)}" from a CSV file`,
    bodyHtml: body,
    footerHtml: footer,
  });
}

/* ---------- Modal: Edit group ---------- */

function renderEditModal() {
  const { name, contacts, selectedForDeletion } = modalState;
  const nameValid = name.trim().length > 0;
  const allSelected = contacts.length > 0 && selectedForDeletion.size === contacts.length;
  const hasSelection = selectedForDeletion.size > 0;

  const contactsList = contacts.map((c, idx) => {
    const phone = typeof c === 'string' ? c : c.phone;
    const cName = typeof c === 'string' ? '' : (c.name || '');
    const displayText = cName ? `${cName} (${phone})` : phone;
    const isSelected = selectedForDeletion.has(idx);

    return `
      <div class="edit-contact-row ${isSelected ? 'selected' : ''}">
        <label class="checkbox-label">
          <input type="checkbox" class="contact-checkbox-edit"
            data-action="toggle-contact-selection"
            data-index="${idx}"
            ${isSelected ? 'checked' : ''} />
          <span class="contact-text">${escapeHtml(displayText)}</span>
        </label>
      </div>
    `;
  }).join("");

  const body = `
    <div class="field">
      <label class="field-label">Group name <span class="req">*</span></label>
      <input id="m-name" class="text-input ${!nameValid ? "error" : ""}" type="text"
        value="${escapeHtml(name)}" data-field="name" />
    </div>

    <div class="field">
      <label class="field-label">Add new contact</label>
      <div class="input-row">
        <input id="m-contact" class="text-input" type="text" placeholder="Name, +60123456789 (or just phone)" data-field="contactInput" />
        <button class="btn-chip" data-action="add-manual-contact">${ICON.plus} Add</button>
      </div>
    </div>

    <div class="field">
      <div class="contacts-header">
        <label class="field-label">Contacts (${contacts.length})</label>
        ${contacts.length > 0 ? `
          <div class="bulk-select-actions">
            <label class="checkbox-label-small">
              <input type="checkbox" class="contact-checkbox-edit"
                data-action="toggle-select-all"
                ${allSelected ? 'checked' : ''} />
              <span>Select all</span>
            </label>
            ${hasSelection ? `
              <button class="btn-delete-selected" data-action="delete-selected-contacts">
                ${ICON.trash} Delete selected (${selectedForDeletion.size})
              </button>
            ` : ''}
          </div>
        ` : ''}
      </div>

      <div class="edit-contacts-list">
        ${contacts.length > 0 ? contactsList : '<div class="empty-state-small">No contacts yet. Add one above.</div>'}
      </div>
    </div>`;

  const footer = `
    <button class="btn btn-ghost" data-action="close-modal">Cancel</button>
    <button class="btn btn-primary" data-action="save-edit" ${!nameValid ? "disabled" : ""}>${ICON.check} Save changes</button>`;

  document.getElementById("modal-root").innerHTML = modalShell({
    title: "Edit group",
    bodyHtml: body,
    footerHtml: footer,
  });

  focusField("m-name");
}

/* ---------- Modal: Delete confirm ---------- */

function renderDeleteModal() {
  const group = groups.find(g => g.id === modal.groupId);
  const body = `<p style="margin:0;font-size:14px;color:#4A4666;line-height:1.6;">
    "${escapeHtml(group.name)}" and its ${group.contacts.length} contact${group.contacts.length === 1 ? "" : "s"} will be removed. This can't be undone.
  </p>`;
  const footer = `
    <button class="btn btn-ghost" data-action="close-modal">Cancel</button>
    <button class="btn btn-danger" data-action="confirm-delete">Delete group</button>`;

  document.getElementById("modal-root").innerHTML = modalShell({
    title: "Delete group?",
    bodyHtml: body,
    footerHtml: footer,
    narrow: true,
  });
}

/* ---------- Modal: Delete contact confirm ---------- */

function renderDeleteContactModal() {
  const group = groups.find(g => g.id === selectedGroupId);
  const contact = group.contacts[modal.contactIndex];
  const phone = typeof contact === 'string' ? contact : contact.phone;
  const name = typeof contact === 'string' ? '' : (contact.name || '');
  const displayText = name ? `${name} (${phone})` : phone;

  const body = `<p style="margin:0;font-size:14px;color:#4A4666;line-height:1.6;">
    "${escapeHtml(displayText)}" will be removed from this group. This can't be undone.
  </p>`;
  const footer = `
    <button class="btn btn-ghost" data-action="close-modal">Cancel</button>
    <button class="btn btn-danger" data-action="confirm-delete-contact">Remove contact</button>`;

  document.getElementById("modal-root").innerHTML = modalShell({
    title: "Remove contact?",
    bodyHtml: body,
    footerHtml: footer,
    narrow: true,
  });
}

function renderModal() {
  if (!modal) {
    document.getElementById("modal-root").innerHTML = "";
    return;
  }
  if (modal.type === "create") renderCreateModal();
  else if (modal.type === "add") renderAddModal();
  else if (modal.type === "upload") renderUploadModal();
  else if (modal.type === "edit") renderEditModal();
  else if (modal.type === "delete") renderDeleteModal();
  else if (modal.type === "delete-contact") renderDeleteContactModal();
}

function focusField(id) {
  requestAnimationFrame(() => {
    const el = document.getElementById(id);
    if (el) el.focus();
  });
}

function closeModal() {
  modal = null;
  modalState = {};
  renderModal();
}

/* ---------- Event delegation ---------- */

document.addEventListener("click", (e) => {
  const overlay = e.target.closest(".overlay");
  const stopEl = e.target.closest("[data-stop]");
  if (overlay && !stopEl) { closeModal(); return; }

  const actionEl = e.target.closest("[data-action]");
  if (!actionEl) return;
  const action = actionEl.dataset.action;

  switch (action) {
    case "nav": {
      activeNav = actionEl.dataset.nav;
      selectedGroupId = null;
      searchQuery = "";
      selectedContacts.clear();
      renderPage();
      break;
    }
    case "view-group": {
      selectedGroupId = actionEl.dataset.id;
      searchQuery = "";
      selectedContacts.clear();
      renderPage();
      break;
    }
    case "back-to-groups": {
      selectedGroupId = null;
      searchQuery = "";
      selectedContacts.clear();
      renderPage();
      break;
    }
    case "download-template": {
      downloadTemplate();
      break;
    }
    case "export-contacts": {
      downloadGroupContacts(actionEl.dataset.id);
      break;
    }
    case "copy-numbers": {
      copyGroupNumbers(actionEl.dataset.id);
      break;
    }
    case "open-create": {
      modalState = { name: "", contacts: [], mode: "manual", touched: false };
      modal = { type: "create" };
      renderModal();
      break;
    }
    case "open-add": {
      modalState = { contacts: [] };
      modal = { type: "add", groupId: actionEl.dataset.id };
      renderModal();
      break;
    }
    case "open-upload": {
      modalState = { parsed: [], fileName: null, count: null, error: null };
      modal = { type: "upload", groupId: actionEl.dataset.id };
      renderModal();
      break;
    }
    case "open-edit": {
      const g = groups.find(x => x.id === actionEl.dataset.id);
      modalState = { name: g.name, contacts: [...g.contacts], selectedForDeletion: new Set(), contactInput: "" };
      modal = { type: "edit", groupId: actionEl.dataset.id };
      renderModal();
      break;
    }
    case "open-delete": {
      modal = { type: "delete", groupId: actionEl.dataset.id };
      renderModal();
      break;
    }
    case "close-modal": {
      closeModal();
      break;
    }
    case "toggle-mode": {
      modalState.mode = actionEl.dataset.mode;
      renderModal();
      break;
    }
    case "add-manual-contact": {
      const input = document.getElementById("m-contact");
      const val = (modalState.contactInput || "").trim();
      if (!val) break;

      // Support format: "Name, +60123456789" or just "+60123456789"
      if (val.includes(',')) {
        const parts = val.split(',').map(p => p.trim());
        if (parts.length >= 2 && parts[1]) {
          modalState.contacts.push({ name: parts[0], phone: parts[1] });
        } else if (parts[0]) {
          modalState.contacts.push({ phone: parts[0] });
        }
      } else {
        modalState.contacts.push({ phone: val });
      }

      modalState.contactInput = "";
      renderModal();
      if (modal.type !== "create" || modalState.mode === "manual") focusField("m-contact");
      break;
    }
    case "remove-chip": {
      const idx = Number(actionEl.dataset.index);
      modalState.contacts.splice(idx, 1);
      renderModal();
      break;
    }
    case "remove-contact": {
      const idx = Number(actionEl.dataset.index);
      modal = { type: "delete-contact", contactIndex: idx };
      renderModal();
      break;
    }
    case "confirm-delete-contact": {
      const group = groups.find(g => g.id === selectedGroupId);
      if (group) {
        group.contacts.splice(modal.contactIndex, 1);
        closeModal();
        renderPage();
      }
      break;
    }
    case "toggle-contact-selection": {
      const idx = Number(actionEl.dataset.index);
      if (modalState.selectedForDeletion.has(idx)) {
        modalState.selectedForDeletion.delete(idx);
      } else {
        modalState.selectedForDeletion.add(idx);
      }
      renderModal();
      break;
    }
    case "toggle-select-all": {
      if (modalState.selectedForDeletion.size === modalState.contacts.length) {
        modalState.selectedForDeletion.clear();
      } else {
        modalState.selectedForDeletion = new Set(modalState.contacts.map((_, i) => i));
      }
      renderModal();
      break;
    }
    case "delete-selected-contacts": {
      const indices = Array.from(modalState.selectedForDeletion).sort((a, b) => b - a);
      indices.forEach(idx => modalState.contacts.splice(idx, 1));
      modalState.selectedForDeletion.clear();
      renderModal();
      break;
    }
    case "dropzone-click": {
      document.getElementById("csv-file")?.click();
      break;
    }
    case "save-create": {
      const nameValid = modalState.name.trim().length > 0;
      if (!nameValid) {
        modalState.touched = true;
        renderModal();
        break;
      }
      groups.unshift({
        id: uid(),
        name: modalState.name.trim(),
        contacts: modalState.contacts,
        created: new Date().toISOString().slice(0, 10),
      });
      closeModal();
      renderPage();
      break;
    }
    case "save-add": {
      const group = groups.find(g => g.id === modal.groupId);
      group.contacts.push(...modalState.contacts);
      closeModal();
      renderPage();
      break;
    }
    case "save-upload": {
      const group = groups.find(g => g.id === modal.groupId);
      group.contacts.push(...modalState.parsed);
      closeModal();
      renderPage();
      break;
    }
    case "save-edit": {
      const nameValid = modalState.name.trim().length > 0;
      if (!nameValid) { renderModal(); break; }
      const group = groups.find(g => g.id === modal.groupId);
      group.name = modalState.name.trim();
      group.contacts = modalState.contacts;
      closeModal();
      renderPage();
      break;
    }
    case "confirm-delete": {
      groups = groups.filter(g => g.id !== modal.groupId);
      closeModal();
      renderPage();
      break;
    }
  }
});

/* input typing — update state without a full re-render (keeps focus/cursor) */
document.addEventListener("input", (e) => {
  // Handle search input
  if (e.target.dataset.action === "search-contacts") {
    searchQuery = e.target.value;
    renderContactsDetailPage();
    return;
  }

  const field = e.target.dataset.field;
  if (!field) return;
  modalState[field] = e.target.value;

  // live-toggle the primary button / fade section for name field without full rerender
  if (field === "name" && modal && (modal.type === "create" || modal.type === "edit")) {
    const nameValid = modalState.name.trim().length > 0;
    const saveBtn = document.querySelector(
      modal.type === "create" ? '[data-action="save-create"]' : '[data-action="save-edit"]'
    );
    if (saveBtn) saveBtn.disabled = !nameValid;
    const fadeSection = document.querySelector(".section-fade");
    if (fadeSection) fadeSection.classList.toggle("enabled", nameValid);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.target.id === "m-contact" && (e.key === "Enter" || e.key === ",")) {
    e.preventDefault();
    document.querySelector('[data-action="add-manual-contact"]')?.click();
  }
});

document.addEventListener("change", (e) => {
  if (e.target.id === "csv-file") {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    modalState.fileName = file.name;
    handleCsvFile(file, (numbers, error) => {
      if (error || numbers.length === 0) {
        modalState.error = error || "No phone_number column found — check the template format.";
        modalState.count = null;
      } else {
        modalState.count = numbers.length;
        modalState.error = null;
        if (modal.type === "create") {
          modalState.contacts = [...modalState.contacts, ...numbers];
        } else if (modal.type === "upload") {
          modalState.parsed = numbers;
        }
      }
      renderModal();
    });
  }
});

document.addEventListener("dragover", (e) => {
  if (e.target.closest(".dropzone")) e.preventDefault();
});
document.addEventListener("drop", (e) => {
  const zone = e.target.closest(".dropzone");
  if (!zone) return;
  e.preventDefault();
  const file = e.dataTransfer.files && e.dataTransfer.files[0];
  if (!file) return;
  modalState.fileName = file.name;
  handleCsvFile(file, (numbers, error) => {
    if (error || numbers.length === 0) {
      modalState.error = error || "No phone_number column found — check the template format.";
      modalState.count = null;
    } else {
      modalState.count = numbers.length;
      modalState.error = null;
      if (modal.type === "create") {
        modalState.contacts = [...modalState.contacts, ...numbers];
      } else if (modal.type === "upload") {
        modalState.parsed = numbers;
      }
    }
    renderModal();
  });
});

/* ---------- Init ---------- */

renderPage();
