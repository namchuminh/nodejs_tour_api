const express = require('express');
const router = express.Router();
const destination = require('../controllers/destination.controller.js');
const upload = require('../middlewares/upload.middleware.js');
const checkUploadedImage = require('../middlewares/checkUpload.middleware.js');
const auth = require("../middlewares/auth.middleware.js");
const authorization = require("../middlewares/authorization.middleware.js");

router.delete('/:id', auth, authorization, destination.remove);
router.put('/:id', auth, authorization, upload.any(), destination.edit);
router.post('/', auth, authorization, upload.any(), checkUploadedImage, destination.add);
router.get('/:id', destination.detail);
router.get('/', destination.index);

module.exports = router;