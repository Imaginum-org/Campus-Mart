# Campus Mart 🛒

A full-stack marketplace platform for campus communities, enabling students to buy, sell, and exchange products with real-time chat, wishlist management, and secure authentication.

## ✨ Features

- **Authentication**: Firebase Auth with Google OAuth and Email/Password
- **Product Management**: Create, browse, and manage listings with categories, images, and detailed specifications
- **Real-time Chat**: Socket.io powered messaging between buyers and sellers
- **Wishlist & Orders**: Save favorites and track purchases
- **Deal Negotiations**: Real-time deal offers and counter-offers
- **Reviews & Ratings**: Product feedback system
- **Subscriptions & Boosts**: Premium features for enhanced visibility
- **Notifications**: Real-time activity alerts
- **Support System**: Ticket-based customer support
- **Address Management**: Multiple shipping addresses
- **Dark Mode**: Theme support with smooth transitions

## 🛠️ Tech Stack

### Frontend

- **React 18** + **Vite 6** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **React Router DOM 7** - Client-side routing
- **Firebase SDK 11** - Auth, Firestore, Storage
- **Framer Motion** - Animations
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **Radix UI** - Accessible components

### Backend

- **Node.js** + **Express 5** - RESTful API
- **MongoDB** + **Mongoose 9** - Database
- **Socket.io** - WebSocket server
- **Firebase Admin SDK** - Server-side auth
- **Cloudinary** - Image storage
- **JWT** + **bcrypt** - Security
- **express-validator** - Input validation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Firebase project with Auth, Firestore, and Storage enabled

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Campus-Mart
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   ```

   Create `.env`:

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   FIREBASE_SERVICE_ACCOUNT=your_service_account_json
   ```

3. **Frontend Setup**

   ```bash
   cd ../frontend
   npm install
   ```

   Create `.env`:

   ```env
   VITE_API_URL=http://localhost:5000
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the application**

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:5173`

## 📁 Project Structure

```
Campus-Mart/
├── frontend/
│   ├── src/
│   │   ├── Components/      # Reusable components
│   │   ├── Pages/           # Route pages
│   │   ├── assets/          # Static assets
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/          # Database & constants
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Auth, validation, error handling
│   │   ├── services/        # Business logic
│   │   ├── sockets/         # Socket.io handlers
│   │   ├── utils/           # Utilities (Cloudinary, JWT, etc.)
│   │   ├── jobs/            # Scheduled tasks
│   │   ├── seeds/           # Database seeds
│   │   └── app.js           # Express app
│   │      
│   └── package-lock.json
│   └── package.json
│   └── .env
│   └── .env.sample
│   └── server.js            # Server entry
│
└── README.md
```

## 📡 API Overview

### Core Endpoints

- **Auth**: `/api/auth/*` - Signup, login, Google OAuth
- **Products**: `/api/products/*` - CRUD operations, search, filters
- **Chat**: `/api/chat/*` - Rooms, messages (Socket.io)
- **Orders**: `/api/orders/*` - Create, track, manage
- **Wishlist**: `/api/wishlist/*` - Add, remove, fetch
- **Reviews**: `/api/reviews/*` - Create, update, delete
- **Deals**: `/api/deals/*` - Offers, negotiations (Socket.io)
- **Subscriptions**: `/api/subscriptions/*` - Plans, payments
- **Notifications**: `/api/notifications/*` - Fetch, mark read
- **Support**: `/api/support/*` - Tickets, responses
- **Users**: `/api/users/*` - Profile, settings

All protected routes require JWT authentication via `Authorization: Bearer <token>` header.

## 🎯 Available Scripts

### Frontend

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend

```bash
npm run dev      # Development with nodemon
npm start        # Production server
```

## 🔒 Security

- JWT-based authentication
- Firebase token verification
- Input validation with express-validator
- Password hashing with bcrypt
- CORS configuration
- Environment variable protection
- Secure file uploads via Cloudinary

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

## 📝 License

MIT License - see LICENSE file for details

## 👥 Authors

- Sarthak Krishak
- Kamal Sinha
- Anurag Adarsh

---

**Made with ❤️ for campus communities**
