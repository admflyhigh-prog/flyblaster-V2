# Fly Blaster

WhatsApp bulk-blast platform for schools — manage contacts and groups, build message templates, and run blast campaigns through a self-hosted WhatsApp gateway (WAHA).

---

## Architecture

```
Browser
  │
  ├── frontend/            static UI (nginx, :8090)
  │     index-blast.html · app-blast.js · style-blast.css
  │
  └── backend/             Node/Express API (:8091)
        │
        ├── flyblaster-db  MySQL 8.0 (docker volume: flyblaster_db_data)
        └── WAHA           external WhatsApp HTTP API (X-Api-Key auth)
```

- **No Supabase, no n8n.** The database is a local MySQL container and the campaign engine is built into the backend.
- **WAHA is external** — it is not started by this project's compose file in production.

---

## Repository layout

```
.
├── frontend/                  # Static single-page UI
│   ├── index-blast.html       # App shell (entry point)
│   ├── app-blast.js           # All UI logic
│   └── style-blast.css        # Styles
│
├── backend/                   # API server
│   ├── server.js              # Express app, DB pool, WAHA client + compat layer
│   ├── routes/
│   │   ├── auth.js            # Login / session (JWT + bcrypt)
│   │   ├── core.js            # Settings, groups, contacts, templates, campaigns
│   │   ├── waha.js            # Sender sessions, QR, group import, interactions
│   │   └── campaigns.js       # Campaign send engine
│   ├── schema.sql             # MySQL schema (runs once on a fresh volume)
│   ├── seed_demo.sh           # Seeds demo data via the API
│   ├── .env.example           # Copy to .env and fill in
│   └── Dockerfile             # API image
│
├── Dockerfile                 # Frontend (nginx) image
├── docker-compose.yml         # Local stack: db + waha + api + web
├── .dockerignore              # Keeps backend/ and secrets OUT of the web image
├── .gitignore
└── README.md
```

---

## Local development

### 1. Configure

```bash
cp backend/.env.example backend/.env
# edit backend/.env if you need to
```

> The root `docker-compose.yml` supplies its own environment variables, so `.env` is mainly for running the API outside Docker.

### 2. Start everything

```bash
docker compose up -d --build
```

This starts four services:

| Service | Purpose | Port |
|---|---|---|
| `flyblaster-db` | MySQL 8.0 | internal |
| `flyblaster-waha` | **Local, isolated** WAHA | 3000 |
| `flyblaster-api` | Node backend | 8091 |
| `flyblaster-web` | Static UI (nginx) | 8090 |

> The local WAHA container is intentionally separate from the production WAHA so local testing **cannot** send real WhatsApp messages.

### 3. Open the app

```
http://localhost:8090/index-blast.html
```

First-boot login (change immediately): `admin@flyblaster.local` / `admin123`

### 4. Connect a sender

Settings → **WhatsApp Senders** → **Add Sender** → **Scan** → scan the QR with WhatsApp (Linked Devices).

---

## Database notes

- `backend/schema.sql` is mounted into MySQL's init directory and **only runs when the volume is first created**.
- On an existing deployment, schema changes must be applied manually — there is no migration tooling yet.
- `docker compose down -v` **deletes all data**. Use `down` (no `-v`) to stop safely.
- Core tables: `users`, `groups`, `contacts`, `group_contacts`, `templates`, `campaigns`, `campaign_groups`, `message_logs`, `daily_message_count`, `contact_interactions`, `senders`, `system_settings`.

---

## Deployment

Production runs on a VPS under `/home/ubuntu/flyblaster-V2/` using its own `docker-compose.yml`:

- `flyblaster-web` (:8090), `flyblaster-api` (:8091), `flyblaster-db`
- WAHA is reached over HTTPS at an external host (see `WAHA_BASE_URL`)

### Deploy checklist

```bash
# 1. Back up first
docker exec flyblaster-db mysqldump -u root -p"$ROOT_PW" flyblaster > backup-$(date +%F).sql
cp docker-compose.yml docker-compose.yml.bak-$(date +%Y%m%d-%H%M%S)

# 2. Ship code, then rebuild only what changed
docker compose up -d --build flyblaster-api    # backend changes
docker compose up -d --build flyblaster-web    # frontend changes

# 3. Verify
curl http://localhost:8091/api/health          # {"ok":true,"db":"connected"}
docker logs flyblaster-api --tail 30
```

### Frontend cache-busting

`frontend/index-blast.html` loads `app-blast.js?v=N`. Nginx sends no cache headers, so **bump `N` and rebuild `flyblaster-web`** after editing JS — otherwise browsers keep the old bundle.

---

## Configuration reference

| Variable | Purpose |
|---|---|
| `PORT` | API port (default 8091) |
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | MySQL connection |
| `WAHA_BASE_URL` | WAHA base URL |
| `WAHA_API_KEY` | WAHA API key (sent as `X-Api-Key`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin account created on first boot |
| `JWT_SECRET` | Signs login tokens — **must be long and random** |
| `FRONTEND_ORIGIN` | Allowed CORS origins (comma-separated) |

The frontend derives its API URL at runtime from `window.location.hostname` + `:8091`, so the same image works locally and deployed. Override with `?api=https://host:port/api`.

---

## WAHA API compatibility

WAHA changed its URL layout between versions. `backend/server.js` provides helpers that try the modern path and fall back to the legacy one:

| Action | Modern (WAHA 2026.x) | Legacy |
|---|---|---|
| Session info | `GET /api/sessions/{name}` | `GET /api/sessions/{name}/status` |
| Groups | `GET /api/{session}/groups` | `GET /api/sessions/{name}/groups` |
| Chats | `GET /api/{session}/chats` | `GET /api/sessions/{name}/chats` |
| QR | `GET /api/{session}/auth/qr?format=image` | `GET /api/sessions/{name}/qr` |
| Send text | `POST /api/sendText` (session in body) | `POST /api/sessions/{name}/sendText` |
| Send image | `POST /api/sendImage` (session in body) | `POST /api/sessions/{name}/sendImage` |

---

## Security

**Never commit `.env`.** It holds the DB password, `JWT_SECRET`, and the WAHA API key.

`.dockerignore` deliberately excludes `backend/`, `.env`, `.git`, and docs. Without it, nginx serves those files publicly — e.g. `http://host:8090/backend/.env` would expose every secret.

Rotate `JWT_SECRET`, the admin password, and `WAHA_API_KEY` if they have ever been exposed.

---

## API overview

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/health` | Health + DB check |
| `POST` | `/api/auth/login` | Obtain JWT |
| `GET` | `/api/auth/me` | Current user |
| `GET` | `/api/sync` | Full data snapshot for the UI |
| `PUT` | `/api/settings` | Update session name / daily limit |
| `GET`/`POST`/`PATCH`/`DELETE` | `/api/groups…` | Group CRUD + contacts |
| `GET`/`POST`/`PATCH`/`DELETE` | `/api/templates…` | Template CRUD |
| `GET`/`POST`/`DELETE` | `/api/campaigns…` | Campaign CRUD |
| `POST` | `/api/campaigns/:id/start` | Run the send engine |
| `GET`/`POST`/`PATCH`/`DELETE` | `/api/senders…` | Sender sessions |
| `GET` | `/api/senders/:id/qr-image` | QR for a sender |
| `GET` | `/api/waha/groups` | List WhatsApp groups |
| `POST` | `/api/waha/groups/import` | Import a WhatsApp group |
| `POST` | `/api/waha/interactions/scan` | Detect prior interactions |

All routes except `/api/health` and `/api/auth/login` require `Authorization: Bearer <token>`.
