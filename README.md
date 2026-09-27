# EventHub – College Event Management System (Frontend)

Modern, responsive frontend application for **EventHub**, built with React 18, Vite, Tailwind CSS, Lucide Icons, and Supabase client SDK.

## 🚀 Live Services
- **Backend API**: [https://collenge-managment-backend.onrender.com/api](https://collenge-managment-backend.onrender.com/api)
- **Database & Auth**: Supabase PostgreSQL

---

## 🛠️ Tech Stack
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **Client Auth**: [Supabase JS Client](https://supabase.com/docs/reference/javascript)

---

## ✨ Features
- 🎓 **Student Portal**:
  - Secure registration & login (bypasses email rate-limits via backend admin-auth).
  - Priority college selector (Apex Institute of Technology Main Campus ranked #1).
  - Department selection & profile management.
  - Browse, filter by category (Technical, Cultural, Sports, Workshop, Hackathon, Seminar, Competition, Club Activity), and search events.
  - One-click event registration & cancellation.
  - View personal event passes with QR badges.
- 🛡️ **Administrator Portal**:
  - Dedicated admin login & registration with authorization passcode.
  - Comprehensive metrics dashboard (total events, registrations, capacity fill rates).
  - Event management: Create, edit, and delete events with custom banners and deadlines.
  - Real-time attendee roster inspection.
- 🤖 **AI Event Assistant**:
  - Powered by Google Gemini through backend integration.

---

## ⚙️ Environment Variables

When deploying to **Vercel**, **Netlify**, or **Render**, set the following environment variables:

| Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | Live backend API URL | `https://collenge-managment-backend.onrender.com/api` |
| `VITE_SUPABASE_URL` | Supabase Project URL | `https://xrzpwndwkxdnwkaektnj.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase Publishable / Anon Key | `sb_publishable_QlRhvmFoTFnkfqFd1Xzfcw_BYkC-1Tk` |

---

## 💻 Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```
