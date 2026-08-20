const request = require('supertest');
const app = require('../app');
const { connect, closeDatabase, clearDatabase } = require('./setup');
const Car = require('../models/Car');

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe('Cars Endpoints', () => {
  beforeEach(async () => {
    await Car.create({
      brand: 'TestBrand',
      model: 'TestModel',
      year: 2023,
      color: 'Black',
      seats: 4,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      dailyPrice: 100,
      weeklyPrice: 600,
      monthlyPrice: 2000,
      description: 'A test car',
      category: 'Sedan',
      availability: true,
      images: ['img1.jpg']
    });
  });

  describe('GET /api/cars', () => {
    it('should fetch all available cars', async () => {
      const res = await request(app).get('/api/cars');

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('brand', 'TestBrand');
    });
  });
});
