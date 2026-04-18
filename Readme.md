# Campus Mart

Campus Mart is a full-stack monorepo with:

- a React + Vite frontend in `frontend/`
- an Express + MongoDB backend API in `backend/`

## Repository Layout

```text
Campus Mart/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       └── validations/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── Common/
│       ├── Components/
│       ├── Pages/
│       ├── Utils/
│       └── main.jsx
└── Readme.md
```

## Tech Stack

### Frontend (`frontend/package.json`)

- React 18
- Vite 6
- React Router (`react-router-dom`)
- Axios
- Tailwind CSS + PostCSS + Autoprefixer
- `@emailjs/browser`
- `@imagekit/javascript`

### Backend (`backend/package.json`)

- Node.js (ES modules)
- Express 5
- MongoDB via Mongoose
- JWT (`jsonwebtoken`) + `bcrypt`
- Zod validation
- `resend` for email sending
- `google-auth-library` for Google OAuth flow
- Security and middleware packages: `helmet`, `cors`, `cookie-parser`, `morgan`, `xss`, `express-rate-limit`

## Prerequisites

- Node.js 18 or higher
- MongoDB instance

## Environment Variables

### Backend (`backend/.env`)

Sample file: `backend/.env.sample`

```env
PORT=
FRONTEND_URL=
MONGO_URL=
SECRET_KEY_ACCESS_TOKEN=
SECRET_KEY_REFRESH_TOKEN=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
NODE_ENV=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
```

### Frontend (`frontend/.env`)

Sample file: `frontend/.env.sample`

```env
VITE_IMAGEKIT_PUBLIC_KEY=
VITE_IMAGEKIT_URL_ENDPOINT=
VITE_API_BASE_URL=
```

Additionally, `frontend/src/Pages/ContactUs.jsx` uses:

- `VITE_SERVICE_ID`
- `VITE_TEMPLATE_ID`
- `VITE_PUBLIC_KEY`

## Getting Started

### 1) Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2) Start backend

```bash
cd backend
npm run dev
```

Backend starts from `server.js` and exposes:

- `GET /health`
- API base routes under `/api/*`

### 3) Start frontend

```bash
cd frontend
npm run dev
```

## Backend API

Base routes are mounted in `backend/src/app.js`.

### Health

- `GET /health`

### Auth (`/api/auth`)

Defined in `backend/src/routes/auth.routes.js`:

- `POST /register`
- `POST /login`
- `GET /google`
- `GET /google/callback`
- `POST /verify-email`
- `GET /check-verification`
- `GET /logoutUser`
- `POST /forgot-password`
- `GET /reset-password/:token`
- `POST /reset-password/:token`
- `POST /resend-verification`
- `POST /refresh-token`

### User (`/api/user`)

Defined in `backend/src/routes/user.routes.js`:

- `GET /userProfile` (auth required)
- `PUT /updateProfile` (auth required)
- `DELETE /deleteAccount` (auth required)

### Product (`/api/product`)

Defined in `backend/src/routes/product.routes.js`:

- `POST /` (auth required, rate-limited, Zod validation)
- `GET /`
- `GET /:id`

`GET /api/product` supports query parameters from `backend/src/services/product.service.js`:

- `page`
- `limit`
- `search`
- `category`
- `min_price`
- `max_price`
- `sort` (`latest`, `price_low`, `price_high`)

### Report (`/api/report`)

Defined in `backend/src/routes/report.routes.js`:

- `POST /product/:productId` (auth required, Zod validation)

### Address (`/api/address`)

Defined in `backend/src/routes/address.routes.js`:

- `POST /` (auth required)
- `GET /` (auth required)
- `GET /:addressId` (auth required)
- `PUT /:addressId` (auth required)
- `DELETE /:addressId` (auth required)
- `PATCH /:addressId/default` (auth required)

### ImageKit (`/api/imagekit`)

Defined in `backend/src/routes/imagekit.routes.js`:

- `GET /auth` (auth required)

## Frontend Routes

Defined in `frontend/src/App.jsx`.

### Public routes

- `/`
- `/login`
- `/signup`
- `/checkEmail`
- `/forgot-password`
- `/reset-password/:token`
- `/verify-email`

### Protected routes (wrapped with `ProtectedRoute`)

- `/profile`
- `/notification`
- `/myorders`
- `/wishlist`
- `/productlisted`
- `/termscondition`
- `/contact`
- `/product`
- `/upload`
- `/price`
- `/chat`
- `/category/:categoryName`

Fallback route redirects unknown paths to `/`.

## Authentication and Security Notes

From backend middleware and controllers:

- auth accepts `accessToken` cookie or `Authorization: Bearer <token>`
- JWT secrets: `SECRET_KEY_ACCESS_TOKEN` and `SECRET_KEY_REFRESH_TOKEN`
- cookies are `httpOnly`, with `secure`/`sameSite` based on `NODE_ENV`
- `helmet`, CORS, body sanitization and XSS filtering are enabled in `app.js`
- product create endpoint uses `express-rate-limit`

## Available Scripts

### Backend (`backend/package.json`)

- `npm run dev` - run with nodemon
- `npm start` - run with node
- `npm run prod` - run with `NODE_ENV=production`
- `npm run lint` - placeholder echo command
- `npm run format` - placeholder echo command

### Frontend (`frontend/package.json`)

- `npm run dev` - start Vite dev server
- `npm run build` - build production bundle
- `npm run preview` - preview built app
- `npm run lint` - run ESLint
- `npm run format` - placeholder echo command
