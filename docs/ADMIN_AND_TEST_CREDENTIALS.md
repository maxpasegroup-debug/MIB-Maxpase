# Admin and Test Login Credentials

## 1. Admin login

Admin credentials are **not stored in code**. They are read from environment variables.

| Variable | Purpose |
|----------|--------|
| `ADMIN_EMAIL` | Email used to log in at **/whats-next/admin/login** |
| `ADMIN_PASSWORD` | Password for that admin user |

**How to set your admin credentials**

- In **.env** (local):
  ```
  ADMIN_EMAIL="admin@mib2.in"
  ADMIN_PASSWORD="your_secure_password"
  ```
- In **Railway** (or any host): add `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the service Variables.

Use whatever email and strong password you want. The app does not ship with default admin credentials.

---

## 2. Test account (bypass payments, see all reports)

A dedicated test user bypasses the Career Intelligence paywall and can see all reports (full report + PDF) without paying.

| Field | Value |
|-------|--------|
| **Email** | `nafi@mib2.in` |
| **Password** | `makeitbeautiful` |

**Create the user in the database (one-time)**

```bash
npm run user:test
```

(or `npx tsx scripts/create-test-user.ts`)

**Behaviour when logged in as this user**

- Viewing any career result page: full report is shown even if the report is locked (no paywall).
- Download PDF: allowed even when the report is locked.

**Where to log in**

- Use the normal **user** login (e.g. **/whats-next/login**), not the admin login.  
- After login, open any career result URL (e.g. `/whats-next/career-results/<sessionId>`) to see the full report and download PDF without payment.
