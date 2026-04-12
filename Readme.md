<div align="center">

# Campus Mart 🛒

### Campus marketplace · full-stack monorepo

**React · Vite · Express · MongoDB**

<br />

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

<br />

[Overview](#overview) ·
[Architecture](#architecture) ·
[Stack](#tech-stack) ·
[Setup](#getting-started) ·
[API](#http-api) ·
[Frontend routes](#frontend-routes) ·
[Scripts](#npm-scripts)

<br />

</div>

---

## Overview

**Campus Mart** is a monorepo for a campus-oriented marketplace: a **React (Vite)** web client and a **Node.js (Express)** API backed by **MongoDB**.

| Package | Path | Role |
|:--------|:-----|:-----|
| **Web client** | [`frontend/`](frontend/) | React SPA, Tailwind CSS, client-side routing (`react-router-dom`) |
| **API** | [`backend/`](backend/) | REST API under `/api`, MongoDB via Mongoose, JWT (`accessToken` cookie or `Authorization` bearer) |

The backend implements **authentication** (register, login, email verification, logout, forgot / reset password, resend verification) with transactional email via [Resend](https://resend.com/), **user profile** and **account deletion**, and **product** listing: create (authenticated), list with filters / pagination, and fetch by id.

---

## Architecture

```mermaid
flowchart LR
  subgraph Client["Frontend (Vite + React)"]
    UI[Pages & Components]
  end

  subgraph Server["Backend (Express)"]
    API["/api · /health"]
  end

  subgraph Data["Persistence"]
    DB[(MongoDB)]
  end

  Ext["Resend · email"]

  UI <-->|HTTP · cookies| API
  API --> DB
  API --> Ext
```

---

## Tech stack

<details>
<summary><strong>Frontend</strong> — see <code>frontend/package.json</code></summary>

<br />

| Category | Packages |
|:---------|:---------|
| **Core** | React 18, Vite 6, `react-router-dom` 7 |
| **Styling** | Tailwind CSS 3, PostCSS, Autoprefixer |
| **HTTP** | Axios — instance in [`src/Utils/Axios.jsx`](frontend/src/Utils/Axios.jsx), base URL in [`src/Common/SummaryApi.js`](frontend/src/Common/SummaryApi.js) |
| **UI & motion** | Framer Motion, Swiper (e.g. [`Pages/Home.jsx`](frontend/src/Pages/Home.jsx)), Radix UI (`@radix-ui/colors`, `@radix-ui/react-alert-dialog`, `radix-ui`), Heroicons, Lucide React, React Icons, `react-burger-menu` |
| **Forms & inputs** | react-datepicker, react-select, react-slider |
| **Feedback & UX** | react-hot-toast, react-toastify, react-spinners |
| **Utilities** | `clsx`, `date-fns` |
| **Other** | `firebase` (listed in dependencies), **EmailJS** (`@emailjs/browser`) for the Contact page ([`ContactUs.jsx`](frontend/src/Pages/ContactUs.jsx)) |
| **Tooling** | ESLint 9, React TS types |

</details>

<details>
<summary><strong>Backend</strong> — see <code>backend/package.json</code></summary>

<br />

| Category | Packages |
|:---------|:---------|
| **Runtime** | Node.js (ES modules), Express 5 |
| **Data** | Mongoose 9 → MongoDB |
| **Auth** | jsonwebtoken, bcrypt |
| **Validation** | Zod ([`src/validations/product.validation.js`](backend/src/validations/product.validation.js), [`validation.middleware.js`](backend/src/middlewares/validation.middleware.js)) |
| **Email** | Resend ([`src/config/sendEmail.js`](backend/src/config/sendEmail.js)) |
| **HTTP & security** | Helmet, CORS, cookie-parser, morgan, dotenv, **xss**, **express-rate-limit** (dependency; not wired in [`app.js`](backend/src/app.js)), **slugify** (used in [`Product.model.js`](backend/src/models/Product.model.js)), **imagekit** (package present; [`src/utils/imagekit.js`](backend/src/utils/imagekit.js) is empty) |

</details>

---

## Prerequisites

- **Node.js** 18+ (recommended)
- **MongoDB** (local or hosted URI)
- **Resend** API key for verification and password-reset emails

---

## Environment variables

### Backend

Copy [`backend/.env.sample`](backend/.env.sample) → `backend/.env`. Variables **read in** `backend/src/` (via `process.env`):

| Variable | Purpose |
|:---------|:--------|
| `PORT` | HTTP port (defaults to `5000` in [`server.js`](backend/server.js) if unset) |
| `FRONTEND_URL` | CORS origin; links in verification and reset emails |
| `MONGO_URL` | MongoDB connection string ([`config/db.js`](backend/src/config/db.js)) |
| `SECRET_KEY_ACCESS_TOKEN` | Sign / verify JWTs ([`auth.middleware.js`](backend/src/middlewares/auth.middleware.js), [`generatedAccessToken.js`](backend/src/utils/generatedAccessToken.js), [`generatedRefreshToken.js`](backend/src/utils/generatedRefreshToken.js)) |
| `RESEND_API_KEY` | Required for [`sendEmail.js`](backend/src/config/sendEmail.js) |
| `NODE_ENV` | e.g. `development` / `production` (cookies, logging) |

[`backend/.env.sample`](backend/.env.sample) also lists `JWT_SECRET`, `SECRET_KEY_REFERECE_TOKEN`, and `CLOUDINARY_*` — these are **not** referenced under `backend/src/` in the current code.

### Frontend

Copy [`frontend/.env.sample`](frontend/.env.sample) → `frontend/.env`.

The Contact form uses **EmailJS** env vars as in [`ContactUs.jsx`](frontend/src/Pages/ContactUs.jsx):

| Variable | Purpose |
|:---------|:--------|
| `VITE_SERVICE_ID` | EmailJS service |
| `VITE_TEMPLATE_ID` | EmailJS template |
| `VITE_PUBLIC_KEY` | EmailJS public key |

[`frontend/.env.sample`](frontend/.env.sample) lists `VITE_FIREBASE_*`, `VITE_ENABLE_ANALYTICS`, `VITE_API_URL`, and `TEMPLATE_ID` / `PUBLIC_KEY` / `SERVICE_ID` without the `VITE_` prefix — align with the variables above for EmailJS. Auth-related API calls use the base URL in [`SummaryApi.js`](frontend/src/Common/SummaryApi.js) (`http://localhost:5000`).

---

## Getting started

<table>
<tr>
<td width="50%" valign="top">

**1 · Install**

```bash
cd backend && npm install
cd ../frontend && npm install
```

**2 · Env**

Copy and fill `backend/.env` and `frontend/.env` (see above).

</td>
<td width="50%" valign="top">

**3 · API**

```bash
cd backend
npm run dev
```

`GET /health` → status, uptime, timestamp.

**4 · Client**

```bash
cd frontend
npm run dev
```

Default Vite port **5173**; [`vite.config.js`](frontend/vite.config.js) sets `server.host: true`.

</td>
</tr>
</table>

---

## HTTP API

Application routes are under **`/api`**.

| Prefix | File | Scope |
|:-------|:-----|:------|
| [`/api/auth`](backend/src/routes/auth.routes.js) | `auth.routes.js` | Register, login, verify email, logout, forgot / reset password, resend verification |
| [`/api/user`](backend/src/routes/user.routes.js) | `user.routes.js` | Profile, delete account (authenticated) |
| [`/api/product`](backend/src/routes/product.routes.js) | `product.routes.js` | Create product (authenticated); list and get by id (public) |

### Auth — [`/api/auth`](backend/src/routes/auth.routes.js)

| Method | Path | Purpose |
|:-------|:-----|:--------|
| `POST` | `/register` | Register; sends verification email |
| `POST` | `/login` | Login; sets cookies |
| `POST` | `/verify-email` | Complete verification |
| `GET` | `/logoutUser` | Logout |
| `POST` | `/forgot-password` | Start reset |
| `GET` | `/reset-password/:token` | Validate token |
| `POST` | `/reset-password/:token` | Set new password |
| `POST` | `/resend-verification` | Resend verification email |

### User — [`/api/user`](backend/src/routes/user.routes.js)

| Method | Path | Auth | Purpose |
|:-------|:-----|:----:|:--------|
| `GET` | `/userProfile` | Yes | Current user |
| `DELETE` | `/deleteAccount` | Yes | Delete account |

### Product — [`/api/product`](backend/src/routes/product.routes.js)

| Method | Path | Auth | Purpose |
|:-------|:-----|:----:|:--------|
| `POST` | `/` | Yes | Create product (body validated with Zod) |
| `GET` | `/` | No | List products; query params supported in [`product.service.js`](backend/src/services/product.service.js): `page`, `limit`, `search`, `category`, `min_price`, `max_price`, `sort` |
| `GET` | `/:id` | No | Single product (increments `views_count`) |

Protected routes: JWT from **`accessToken` cookie** or **`Authorization: Bearer <token>`** ([`auth.middleware.js`](backend/src/middlewares/auth.middleware.js)).

---

## Frontend routes

Defined in [`src/App.jsx`](frontend/src/App.jsx).

**Public:** `/`, `/login`, `/signup`, `/checkEmail`, `/forgot-password`, `/reset-password/:token`, `/verify-email`

**Protected** (`ProtectedRoute`): `/profile`, `/notification`, `/myorders`, `/wishlist`, `/productlisted`, `/termscondition`, `/contact`, `/product`, `/upload`, `/price`, `/chat`, `/category/:categoryName`

Catch-all → redirect to `/`.

---

## NPM scripts

| | Frontend | Backend |
|:--|:---------|:--------|
| **Dev** | `npm run dev` | `npm run dev` → `nodemon server.js` |
| **Prod** | `npm run build` · `npm run preview` | `npm start` → `node server.js` |
| **Quality** | `npm run lint` | `npm test` — placeholder (exits with error if run) |

---

## Security (as implemented)

| Measure | Detail |
|:--------|:-------|
| Passwords | **bcrypt** on register / reset |
| Transport & headers | **Helmet** (with `crossOriginResourcePolicy: false`); JSON body limit **10kb** in [`app.js`](backend/src/app.js) |
| Input | **xss** on string `body` / `params`; middleware removes `$` / `.` keys from `body` / `params` to mitigate NoSQL injection |
| Origin | **CORS** to `FRONTEND_URL`, `credentials: true` |
| Sessions / tokens | JWT verified from cookie or bearer header |

---

## Project structure

```
Campus Mart/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── Common/          # API paths & base URL (SummaryApi.js)
│   │   ├── Components/
│   │   ├── Pages/
│   │   ├── Utils/           # Axios instance (Axios.jsx)
│   │   └── assets/
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/          # User, Product
│       ├── routes/          # auth, user, product
│       ├── services/        # product.service.js
│       ├── validations/     # product.validation.js (Zod)
│       └── utils/
│
└── Readme.md
```

---

## License

Backend [`package.json`](backend/package.json) declares **ISC**. There is no root `LICENSE` file; confirm terms with your team or legal policy.

---

<div align="center">

**Campus Mart** · Built for campus communities

<br />

</div>
