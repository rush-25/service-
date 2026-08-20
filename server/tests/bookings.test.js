const request = require('supertest');
const app = require('../app');
const { connect, closeDatabase, clearDatabase } = require('./setup');
const User = require('../models/User');
const Car = require('../models/Car');

let token;
let carId;

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe('Bookings Endpoints', () => {
  beforeEach(async () => {
    // 1. Create a user
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Booking User',
        email: 'bookinguser@example.com',
        password: 'password123',
        phone: '+1 555-0000'
      });
    token = userRes.body.token;

    // 2. Create an admin to add a car
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'password123',
        phone: '+1 555-9999',
        role: 'Administrator'
      });
    const adminToken = adminRes.body.token;

    // 3. Create a car
    const carRes = await request(app)
      .post('/api/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        brand: 'Honda',
        model: 'Civic',
        year: 2022,
        color: 'White',
        seats: 5,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        dailyPrice: 50,
        weeklyPrice: 300,
        monthlyPrice: 1000,
        description: 'Reliable car',
        category: 'Sedan',
        availability: true,
        images: ['civic.jpg']
      });
    carId = carRes.body.data._id;
  });

  describe('POST /api/bookings', () => {
    it('should create a new booking for an authenticated user', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          carId: carId,
          pickupLocation: 'Airport',
          returnLocation: 'City Center',
          pickupDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          returnDate: new Date(Date.now() + 86400000 * 3).toISOString() // 3 days from now
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toEqual(true);
      expect(res.body.data).toHaveProperty('totalPrice');
      expect(res.body.data).toHaveProperty('status', 'Pending');
    });

    it('should reject unauthenticated booking attempt', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .send({
          carId: carId,
          pickupLocation: 'Airport',
          returnLocation: 'City Center',
          pickupDate: new Date().toISOString(),
          returnDate: new Date().toISOString()
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toEqual(false);
    });
  });

  describe('GET /api/bookings', () => {
    it('should allow user to view their own bookings', async () => {
      // First create a booking
      await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          carId: carId,
          pickupLocation: 'Airport',
          returnLocation: 'City Center',
          pickupDate: new Date(Date.now() + 86400000).toISOString(),
          returnDate: new Date(Date.now() + 86400000 * 3).toISOString()
        });

      const res = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
    });
  });
});
