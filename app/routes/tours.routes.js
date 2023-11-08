const express = require('express');
const router = express.Router();
const tours = require('../controllers/tours.controller.js');
const upload = require('../middlewares/upload.middleware.js');
const checkUploadedImage = require('../middlewares/checkUpload.middleware.js');
const auth = require("../middlewares/auth.middleware.js");
const authorization = require("../middlewares/authorization.middleware.js");

router.delete('/:id', auth, authorization, tours.remove);
router.put('/:id', auth, authorization, upload.single('AnhChinh'), tours.edit);
router.post('/', auth, authorization, upload.single('AnhChinh'), checkUploadedImage, tours.add);
router.get('/:id', tours.detail);
router.get('/', tours.index);

// Route information Tour
router.get('/:id/information', tours.detailInformation);
router.post('/:id/information', auth, authorization, tours.addInformation);
router.put('/:id/information', auth, authorization, tours.editInformation);

module.exports = router;