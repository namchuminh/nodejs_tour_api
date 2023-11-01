const express = require('express');
const router = express.Router();
const tours = require('../controllers/tours.controller.js');
const upload = require('../middlewares/upload.middleware.js');
const checkUploadedImage = require('../middlewares/checkUpload.middleware.js');
const auth = require("../middlewares/auth.middleware.js");
const authorization = require("../middlewares/authorization.middleware.js");

router.post('/', auth, authorization, upload.single('AnhChinh'), checkUploadedImage, tours.add);
router.get('/', tours.index);


module.exports = router;