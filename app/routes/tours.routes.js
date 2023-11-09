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

// Route policy Tour
router.get('/:id/policy', tours.detailPolicy);
router.post('/:id/policy', auth, authorization, tours.addPolicy);
router.put('/:id/policy', auth, authorization, tours.editPolicy);

// Route gallery Tour
router.get('/:id/gallery', tours.detailGallery);
router.post('/:id/gallery', auth, authorization, upload.array('HinhAnh'), checkUploadedImage, tours.addGallery);
router.put('/:id/gallery', auth, authorization, upload.array('HinhAnh'), checkUploadedImage, tours.editGallery);

module.exports = router;