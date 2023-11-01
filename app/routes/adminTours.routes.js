const express = require('express');
const router = express.Router();
const tours = require('../controllers/admin/tours.controller.js');
const upload = require('../middlewares/upload.middleware.js');
const checkUploadedImage = require('../middlewares/checkUpload.middleware.js');

router.post('/', upload.single('AnhChinh'), checkUploadedImage, tours.add);
router.get('/', tours.index);


module.exports = router;