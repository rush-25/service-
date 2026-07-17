const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const Location = require('../models/Location');
const Notification = require('../models/Notification');

const seedData = async () => {
  try {
    // Clear Existing
    await User.deleteMany();
    await Car.deleteMany();
    await Booking.deleteMany();
    await Payment.deleteMany();
    await Review.deleteMany();
    await Location.deleteMany();
    await Notification.deleteMany();

    console.log('Database cleared. Seeding starting...');

    // Seed Locations
    const locations = await Location.create([
      { name: 'Chilaw', address: 'Colombo Rd, Maikkulama, Chilaw' },
      { name: 'Waikkal', address: 'Waikkal' },
    ]);
    console.log('Locations seeded!');

    // Seed Users
    const admin = await User.create({
      name: 'DriveEasy Admin',
      email: 'admin@driveeasy.com',
      phone: '+1 555-0199',
      password: 'adminpassword123',
      role: 'Administrator',
    });

    const customer1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 555-0144',
      password: 'customerpassword123',
      role: 'Customer',
    });

    const customer2 = await User.create({
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      phone: '+1 555-0188',
      password: 'customerpassword123',
      role: 'Customer',
    });

    console.log('Users seeded!');

    // Seed Cars with Premium Unsplash URLs
    const cars = await Car.create([
      {
        brand: 'Tesla',
        model: 'Model S Plaid',
        year: 2023,
        color: 'Solid Black',
        seats: 5,
        fuelType: 'Electric',
        transmission: 'Automatic',
        dailyPrice: 150,
        weeklyPrice: 130,
        monthlyPrice: 110,
        description: 'Experience unmatched speed and luxury with the Tesla Model S Plaid. Features triple motor all-wheel drive, gaming-grade processing power, and Autopilot functionality.',
        category: 'Electric',
        availability: true,
        images: [
          'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
        ],
        rating: 4.9,
        reviewsCount: 2,
      },
      {
        brand: 'BMW',
        model: 'M4 Competition',
        year: 2022,
        color: 'Isle of Man Green',
        seats: 4,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        dailyPrice: 180,
        weeklyPrice: 160,
        monthlyPrice: 140,
        description: 'The BMW M4 Competition Coupe is a high-performance luxury sports car designed with track-inspired engineering, raw horsepower, and an ultra-premium cabin experience.',
        category: 'Sports',
        availability: true,
        images: [
          'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80'
        ],
        rating: 4.8,
        reviewsCount: 1,
      },
      {
        brand: 'Porsche',
        model: '911 Carrera S',
        year: 2023,
        color: 'Guards Red',
        seats: 4,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        dailyPrice: 250,
        weeklyPrice: 220,
        monthlyPrice: 190,
        description: 'An icon of automotive styling and performance. The Porsche 911 Carrera S offers timeless aesthetics mixed with surgical handling precision and high-revving boxer engine excitement.',
        category: 'Sports',
        availability: true,
        images: [
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80'
        ],
        rating: 5.0,
        reviewsCount: 1,
      },
      {
        brand: 'Audi',
        model: 'e-tron GT',
        year: 2023,
        color: 'Daytona Gray',
        seats: 5,
        fuelType: 'Electric',
        transmission: 'Automatic',
        dailyPrice: 170,
        weeklyPrice: 150,
        monthlyPrice: 130,
        description: 'Audis peak electric engineering achievement. The e-tron GT merges an beautiful grand tourer silhouette with state of the art 800V fast charging and standard quattro all-wheel drive.',
        category: 'Electric',
        availability: true,
        images: [
          'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
        ],
        rating: 4.7,
        reviewsCount: 1,
      },
      {
        brand: 'Land Rover',
        model: 'Range Rover Sport',
        year: 2022,
        color: 'Fuji White',
        seats: 7,
        fuelType: 'Diesel',
        transmission: 'Automatic',
        dailyPrice: 160,
        weeklyPrice: 140,
        monthlyPrice: 120,
        description: 'Uncompromising capabilities combined with supreme comfort. The Range Rover Sport commands respect on any road or off-road trail with class-leading luxury interior accents.',
        category: 'SUV',
        availability: true,
        images: [
          'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
        ],
        rating: 4.6,
        reviewsCount: 1,
      },
      {
        brand: 'Mercedes-Benz',
        model: 'S-Class S500',
        year: 2023,
        color: 'Obsidian Black Metallic',
        seats: 5,
        fuelType: 'Hybrid',
        transmission: 'Automatic',
        dailyPrice: 220,
        weeklyPrice: 195,
        monthlyPrice: 170,
        description: 'The gold standard of executive luxury sedans. The Mercedes S-Class provides absolute whisper-quiet cabin acoustics, active air ride suspension, and advanced active driving assistance features.',
        category: 'Luxury',
        availability: true,
        images: [
          'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1200&q=80'
        ],
        rating: 5.0,
        reviewsCount: 1,
      },
    ]);

    console.log('Cars seeded!');

    // Seed Bookings, Payments, Reviews to build instant visual metrics for charts
    // Create dates
    const d = new Date();
    const prevMonthDate = new Date(d.getFullYear(), d.getMonth() - 1, 15);
    const prevMonthEnd = new Date(d.getFullYear(), d.getMonth() - 1, 18);

    const currentMonthStart = new Date(d.getFullYear(), d.getMonth(), 2);
    const currentMonthEnd = new Date(d.getFullYear(), d.getMonth(), 5);

    const booking1 = await Booking.create({
      user: customer1._id,
      car: cars[0]._id, // Tesla
      pickupLocation: locations[0].name,
      returnLocation: locations[0].name,
      pickupDate: prevMonthDate,
      returnDate: prevMonthEnd,
      totalPrice: 450,
      status: 'Completed',
      paymentStatus: 'Paid',
      createdAt: prevMonthDate,
    });

    await Payment.create({
      booking: booking1._id,
      user: customer1._id,
      amount: 450,
      paymentMethod: 'Stripe',
      status: 'Completed',
      createdAt: prevMonthDate,
    });

    const booking2 = await Booking.create({
      user: customer2._id,
      car: cars[1]._id, // BMW
      pickupLocation: locations[1].name,
      returnLocation: locations[1].name,
      pickupDate: currentMonthStart,
      returnDate: currentMonthEnd,
      totalPrice: 540,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      createdAt: currentMonthStart,
    });

    await Payment.create({
      booking: booking2._id,
      user: customer2._id,
      amount: 540,
      paymentMethod: 'Stripe',
      status: 'Completed',
      createdAt: currentMonthStart,
    });

    const booking3 = await Booking.create({
      user: customer1._id,
      car: cars[2]._id, // Porsche
      pickupLocation: locations[0].name,
      returnLocation: locations[1].name,
      pickupDate: new Date(d.getFullYear(), d.getMonth(), d.getDate() + 2),
      returnDate: new Date(d.getFullYear(), d.getMonth(), d.getDate() + 5),
      totalPrice: 750,
      status: 'Pending',
      paymentStatus: 'Pending',
      createdAt: d,
    });

    console.log('Bookings & Payments seeded!');

    // Seed Reviews
    await Review.create([
      { car: cars[0]._id, user: customer1._id, rating: 5, comment: 'Simply incredible. Autopilot works wonders and the acceleration is mind-blowing.' },
      { car: cars[0]._id, user: customer2._id, rating: 4.8, comment: 'Clean car, high-tech features, smooth pickup process at LAX!' },
      { car: cars[1]._id, user: customer2._id, rating: 4.8, comment: 'Dynamic handling, absolute sports perfection.' },
      { car: cars[2]._id, user: customer1._id, rating: 5, comment: 'My absolute dream car. Smooth rental transition, highly recommended!' },
      { car: cars[3]._id, user: customer2._id, rating: 4.7, comment: 'Audis electric styling is gorgeous. Extremely comfortable cabin.' },
      { car: cars[4]._id, user: customer1._id, rating: 4.6, comment: 'Spacious for my entire family. Powerful road grip.' },
      { car: cars[5]._id, user: customer2._id, rating: 5.0, comment: 'Absolute executive comfort. Whispering cabin.' },
    ]);

    // Send notifications
    await Notification.create([
      { user: customer1._id, title: 'Welcome to DriveEasy!', message: 'Explore our catalog of luxury vehicles and place your first booking today.' },
      { user: customer1._id, title: 'Trip Completed!', message: 'Your booking for Tesla Model S Plaid is completed. Please write a review!' },
      { user: customer2._id, title: 'Booking Confirmed', message: 'Your booking for BMW M4 Competition is confirmed.' },
    ]);

    console.log('Reviews & Notifications seeded!');
    console.log('Database Seeding Successful!');
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
  }
};

module.exports = seedData;
