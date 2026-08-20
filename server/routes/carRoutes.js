const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getCars, getCar, createCar, updateCar, deleteCar } = require('../controllers/carController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Set up local storage for files
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max per file
  fileFilter(req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Images only (jpg, jpeg, png, webp)!'));
  },
});

router.route('/')
  .get(getCars)
  .post(protect, authorize('Administrator'), upload.array('images', 5), createCar);

router.route('/:id')
  .get(getCar)
  .put(protect, authorize('Administrator'), upload.array('images', 5), updateCar)
  .delete(protect, authorize('Administrator'), deleteCar);

module.exports = router;
