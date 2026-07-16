# DriveEasy – Premium Luxury Car Rental Management System

DriveEasy is a premium, production-ready, full-stack car sharing and rental web application. The design aesthetic is inspired by Tesla, BMW, and Airbnb to provide a luxurious, responsive, and seamless checkout experience across desktop, tablet, and mobile.

---

## 🚀 Tech Stack

### Frontend
- **React.js** (Vite fast scaffolding)
- **Tailwind CSS v4** (Utility-first luxury glassmorphic layouts)
- **React Router DOM v6** (Nested route protection guards)
- **Axios** (JWT Authorization request/response interceptors)
- **Lucide Icons** (Consistent modern typography and visuals)
- **Recharts** (Seamless administrative visualization statistics)

### Backend
- **Node.js & Express.js** (Standard RESTful API pattern)
- **JWT (JSON Web Tokens)** (Role-based secure route guards)
- **Bcrypt.js** (Secure industry-standard password hashing)
- **Multer** (File system uploads support)
- **MongoDB Memory Server** (In-memory, self-contained MongoDB environment that spins up instantly with zero external dependencies)

---

## 🔑 Pre-Seeded Accounts

The application automatically seeds a comprehensive database state (Locations, Cars, Customers, Bookings, Payments, Reviews, and in-app Notifications) to instantly populate all administrative charts and customer tables.

### 👤 Customer Profile
- **Email:** `john@example.com`
- **Password:** `customerpassword123`

### 🛡️ Administrator Profile
- **Email:** `admin@driveeasy.com`
- **Password:** `adminpassword123`

---

## 📁 Repository Structure

```
driveeasy/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI widgets (CarCard, Navbar, Footer, Toast)
│   │   ├── context/        # React AuthContext State Managers
│   │   ├── layouts/        # Sidebar dashboards layout divisions
│   │   ├── pages/          # Home, Cars Catalog, Details, About, Contact, Auth Forms
│   │   └── services/       # Axios API integration endpoints
│   └── vite.config.js      # Proxy server forwarding rules
│
└── server/                 # Express Backend API
    ├── config/             # DB initialization & Mongo Memory Server
    ├── controllers/        # Business logic handlers
    ├── models/             # Mongoose schemas (User, Car, Booking, Payment, Review)
    ├── routes/             # REST route mapping
    └── utils/              # Seeding algorithms
```

---

## ⚙️ Quick Start Installation

Follow these steps to run both the backend server and frontend client concurrently:

### 1. Clone & Set Up Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
JWT_SECRET=supersecretjwtkeydriveeasy12345
MONGODB_URI=
NODE_ENV=development
```

### 2. Install Root & Server Dependencies
```bash
# Install root package dependencies
npm install

# Start the Node/Express backend (serves on http://localhost:5000)
node server/server.js
```

### 3. Install Client Dependencies & Start
In a new terminal window:
```bash
# Navigate to the frontend directory
cd client

# Install packages
npm install

# Launch Vite hot-reload server (serves on http://localhost:3000)
npm run dev
```

Open **`http://localhost:3000`** in your browser to experience the premium luxury **DriveEasy** application.
