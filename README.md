

## Detailed Project Specs (for builders)

### Goal
Create a polished prototype for **Delight Homes Limited**: a mini real-estate web application with a public site and secure admin panel. It is a proof-of-concept intended for demos, onboarding, and early user testing.

### Features (functional)
- Public website:
  - Eye-catching landing page with rotating hero slides.
  - Responsive grid of property listings with images, titles, descriptions, and prices.
  - Contact form that sends email (SMTP or SendGrid) or falls back to local storage.
- Admin panel:
  - Secure login with session cookie (httpOnly). Two roles: `admin` (full CRUD) and `demo` (read-only).
  - Dashboard showing properties with image preview.
  - Modal forms for create/edit supporting image URL or file upload.
  - Delete with confirmation (admin only).
- Persistence:
  - File-based storage under `/data`:
    - `properties.json` — property records
    - `users.json` — user accounts (passwords are hashed on first run)
    - `sessions.json` — active sessions (tokens)
    - `contacts.json` — fallback contact messages
  - Uploaded images saved in `data/uploads/` and served via `/uploads/<file>`

### Security & Validation
- Passwords are hashed with bcrypt.
- Session cookie is `httpOnly` and `sameSite=lax`. Set `COOKIE_SECURE=true` in production to enable secure cookies.
- Server-side validation enforces title, description and price on create/update.
- Inputs are trimmed and length-limited to prevent abuse.

### Email (Contact Form)
- The contact API supports:
  - SMTP (configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`)
  - SendGrid API (`SENDGRID_API_KEY`)
  - Fallback: stores messages in `data/contacts.json` when no mail service is configured.

### How image uploads work
- Uploads are handled via `multer` to `data/uploads/`.
- When a file is uploaded, the property `image` field stores `/uploads/<filename>` which is served by the app.
- Alternatively, admins can supply an image URL; the public site will use that directly.

### Environment variables (recommended)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — SMTP mail settings (optional)
- `SENDGRID_API_KEY` — SendGrid API key (optional)
- `CONTACT_TO` — Email address to receive contact messages (default `info@delighthomes.example`)
- `COOKIE_SECURE` — set to `true` on production to make cookies `Secure`

## Deploying to Vercel
1. Push this repository to GitHub.
2. In Vercel, create a new project and import the GitHub repo.
3. Set these Environment Variables in Vercel (if you plan to use email):
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` **or** `SENDGRID_API_KEY`
   - `CONTACT_TO`
   - `COOKIE_SECURE=true` (recommended)
4. Build & Deploy. Note: Vercel's serverless functions have ephemeral file systems — `data/` will persist between requests during a function's warm life, but NOT across deployments. For production persistence, use a managed DB and cloud object storage (S3 or similar).

## Developer notes
- The demo accounts are created in `data/users.json`. On first run, plaintext passwords are hashed automatically.
- Sessions are written to `data/sessions.json` — consider replacing with a more robust session store for production.
- To reset sample data, delete files under `/data` and restart.

