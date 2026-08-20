# DriveEasy - Premium Car Rental Platform

![DriveEasy](https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80)

DriveEasy is a full-stack, enterprise-grade web application designed for executive car rentals. From high-performance sports cars to luxurious electric vehicles, DriveEasy provides a seamless, premium booking experience for both self-drive and chauffeur-driven journeys. 

Built with modern web technologies, this platform features secure authentication, dynamic vehicle availability tracking, real-time mock payment processing, and comprehensive administrative dashboards.

---

## 📸 Screenshots

| Home Page | Vehicle Catalog |
|:---:|:---:|
| ![Home](https://via.placeholder.com/600x400/111827/ffffff?text=Premium+Home+Page+Preview) | ![Catalog](https://via.placeholder.com/600x400/111827/ffffff?text=Vehicle+Catalog+Preview) |

| Booking Workflow | Admin Dashboard |
|:---:|:---:|
| ![Booking](https://via.placeholder.com/600x400/111827/ffffff?text=Seamless+Booking+Preview) | ![Admin](https://via.placeholder.com/600x400/111827/ffffff?text=Admin+Dashboard+Preview) |

*(Note: Replace placeholder image links with actual screenshots of your running application).*

---

## ✨ Features

- **🛡️ Secure User Authentication:** Role-based access control (Customer vs. Administrator) using JWT.
- **🏎️ Dynamic Car Catalog:** Browse vehicles with advanced filtering, sorting, and premium image galleries.
- **📅 Smart Booking System:** Automated overlap prevention, date validations, and instant confirmation for card payments.
- **💳 Payment Processing:** Mock Stripe integration with dynamic calculation of rates (daily, weekly, monthly).
- **⭐ Reviews & Ratings:** Verified customers can leave detailed reviews on completed trips.
- **❤️ Wishlist:** Save your dream cars for quick access later.
- **📊 Admin Dashboard:** Complete control over fleet management, user profiles, bookings, and revenue metrics.
- **🔔 Notifications:** Automated alerts for booking confirmations and updates.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** React.js powered by Vite
- **Styling:** Tailwind CSS (Modern, premium aesthetic)
- **Routing:** React Router v7
- **State Management:** React Context API
- **HTTP Client:** Axios (Modularized Services)

### Backend (Server)
- **Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB via Mongoose
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Security:** Helmet, express-rate-limit
- **Testing:** Jest & Supertest (Integration Testing with MongoDB Memory Server)
- **File Uploads:** Multer (with strict MIME & Size validation)

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

### 2. Environment Variables
Clone the `.env.example` file to create your local `.env`:

```bash
cp .env.example .env
```
Update the `.env` file with your actual `MONGODB_URI` and `JWT_SECRET`.

### 3. Backend Setup
Open a terminal in the root directory:

```bash
# Install backend dependencies
npm install

# Seed the database with initial premium data (Optional)
npm run seed

# Start the development server (runs on port 5000 by default)
npm run dev
```

### 4. Frontend Setup
Open a **new** terminal and navigate to the client directory:

```bash
cd client

# Install frontend dependencies
npm install

# Start the Vite development server (runs on port 5173 by default)
npm run dev
```

---

## 🧪 Testing

The backend includes a comprehensive integration test suite utilizing `mongodb-memory-server` to mock the database.

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 📡 API Documentation

Here is a quick overview of the core REST endpoints available in the DriveEasy API.

| Method | Endpoint | Description | Auth Required |
|:---:|:---|:---|:---:|
| **POST** | `/api/auth/register` | Register a new user | ❌ |
| **POST** | `/api/auth/login` | Authenticate & retrieve JWT | ❌ |
| **GET** | `/api/auth/profile` | Get current user profile | ✅ |
| **GET** | `/api/cars` | Fetch all available vehicles | ❌ |
| **GET** | `/api/cars/:id` | Get details of a specific vehicle | ❌ |
| **POST** | `/api/cars` | Add a new vehicle to the fleet | ✅ (Admin) |
| **POST** | `/api/bookings` | Create a new rental booking | ✅ |
| **GET** | `/api/bookings` | Retrieve user's bookings | ✅ |
| **POST** | `/api/payments` | Process a booking payment | ✅ |
| **GET** | `/api/reviews/:carId` | Get reviews for a specific vehicle| ❌ |
| **POST** | `/api/reviews` | Submit a review for a completed trip| ✅ |

*(For full endpoint details, refer to the route definitions in `server/routes`)*.

---

## 🔒 Security Practices Implemented
- Passwords hashed using `bcryptjs` before storage.
- Endpoints protected with standard JWT verification middleware.
- Request rate limiting implemented on API to prevent brute-force attacks.
- Application headers secured via `Helmet`.
- Strict file upload validation (Size and MIME types) using `Multer`.
