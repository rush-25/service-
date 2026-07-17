const Car = require('../models/Car');

// @desc    Get all vehicles (with optional query parameters)
// @route   GET /api/cars
// @access  Public
exports.getCars = async (req, res) => {
  try {
    const { brand, category, fuelType, transmission, seats, availability, minPrice, maxPrice, sort, search } = req.query;

    let query = {};

    if (brand) query.brand = new RegExp(brand, 'i');
    if (category) query.category = category;
    if (fuelType) query.fuelType = fuelType;
    if (transmission) query.transmission = transmission;
    if (seats) query.seats = parseInt(seats);
    if (availability !== undefined) query.availability = availability === 'true';

    if (minPrice || maxPrice) {
      query.dailyPrice = {};
      if (minPrice) query.dailyPrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.dailyPrice.$lte = parseFloat(maxPrice);
    }

    if (search) {
      query.$or = [
        { brand: new RegExp(search, 'i') },
        { model: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }

    let queryBuilder = Car.find(query);

    // Sorting
    if (sort) {
      if (sort === 'priceLowToHigh') {
        queryBuilder = queryBuilder.sort({ dailyPrice: 1 });
      } else if (sort === 'priceHighToLow') {
        queryBuilder = queryBuilder.sort({ dailyPrice: -1 });
      } else if (sort === 'highestRated') {
        queryBuilder = queryBuilder.sort({ rating: -1 });
      } else if (sort === 'mostPopular') {
        queryBuilder = queryBuilder.sort({ reviewsCount: -1 });
      }
    } else {
      queryBuilder = queryBuilder.sort({ createdAt: -1 });
    }

    const cars = await queryBuilder;
    res.status(200).json({ success: true, count: cars.length, data: cars });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single vehicle by ID
// @route   GET /api/cars/:id
// @access  Public
exports.getCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    res.status(200).json({ success: true, data: car });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new vehicle
// @route   POST /api/cars
// @access  Private/Admin
exports.createCar = async (req, res) => {
  try {
    // If files are uploaded, map them to image URLs
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    } else if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const carData = { ...req.body, images };
    const car = await Car.create(carData);

    res.status(201).json({ success: true, data: car });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a vehicle
// @route   PUT /api/cars/:id
// @access  Private/Admin
exports.updateCar = async (req, res) => {
  try {
    let car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    let images = [];
    // Keep explicitly-passed existing image URLs
    if (req.body.existingImages) {
      images = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];
    }
    // Append any newly uploaded files
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      images = [...images, ...newImages];
    }
    // Fallback: keep original images if nothing was provided
    if (images.length === 0) {
      images = car.images;
    }

    const updatedData = { ...req.body, images };
    car = await Car.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: car });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/cars/:id
// @access  Private/Admin
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    await car.deleteOne();
    res.status(200).json({ success: true, message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
