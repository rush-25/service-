# DriveEasy API Server

The backend service for the DriveEasy car rental application. Built with Node.js, Express, and MongoDB, this API provides robust endpoints to manage user authentication, car listings, bookings, payments, reviews, and administration.

## Features

- **Authentication & Authorization**: Secure login and registration using JWT (JSON Web Tokens).
- **Cars Management**: Complete CRUD operations for car listings.
- **Booking System**: Manage reservations, availability, and scheduling.
- **Payment Processing**: Endpoints to handle transaction data.
- **Reviews & Wishlist**: Users can leave feedback and save their favorite cars.
- **Admin Dashboard**: Comprehensive admin endpoints to oversee the platform.
- **Zero-Setup Database**: Uses `mongodb-memory-server` out of the box for quick local testing without needing a standalone MongoDB instance. It automatically seeds initial data on startup for a premium out-of-the-box experience.

## Prerequisites

- Node.js (v14 or higher is recommended)
- npm (Node Package Manager)

## Installation

1. Clone the repository or navigate to the project root directory.
2. Install the required dependencies using npm:

   ```bash
   npm install
   ```

## How to Run

You can start the server in either development mode or standard mode. The application will start on port `5000` by default.

### Development Mode

Starts the server. (If you want to use nodemon, install it and configure the `dev` script).
```bash
npm run dev
```

### Production Mode

Starts the server using standard node execution.
```bash
npm start
```

*Note: Since the server uses an in-memory MongoDB server by default, any data changes made during the session will reset once the server is stopped unless a remote database URI is specified in the environment.*

## Environment Variables (Optional)

If you wish to use a persistent MongoDB instance or configure other options, create a `.env` file in the root directory and add the following variables:

```env
# Optional: Set a specific port for the server
PORT=5000

# Optional: Set the Node environment (development/production)
NODE_ENV=development

# Optional: Use a persistent MongoDB database URI instead of the in-memory server
MONGODB_URI=mongodb://localhost:27017/driveeasy
```

## API Structure

The API is mounted under the `/api` prefix:

- `GET /api/health` - Server health check
- `/api/auth` - User authentication and registration
- `/api/cars` - Car listings and details
- `/api/bookings` - Booking management
- `/api/payments` - Payments handling
- `/api/reviews` - Reviews and ratings
- `/api/wishlist` - User's saved cars
- `/api/notifications` - System notifications
- `/api/admin` - Administrative features
- `/api/locations` - Available rental locations

## Seed Data

The server automatically runs a seed script (`server/utils/seed.js`) upon successfully connecting to the database. This populates your in-memory database with initial data (such as sample cars, locations, etc.), making it easy to test endpoints immediately after startup.
