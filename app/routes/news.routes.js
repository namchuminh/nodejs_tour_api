const express = require('express');
const router = express.Router();
const news = require('../controllers/news.controller.js');
const upload = require('../middlewares/upload.middleware.js');
const checkUploadedImage = require('../middlewares/checkUpload.middleware.js');
const auth = require("../middlewares/auth.middleware.js");
const authorization = require("../middlewares/authorization.middleware.js");

router.delete('/:id', auth, authorization, news.remove);
router.put('/:id', auth, authorization, upload.single('AnhChinh'), news.edit);
router.post('/', auth, authorization, upload.single('AnhChinh'), checkUploadedImage, news.add);
router.get('/:id', news.detail);
router.get('/', news.index);

module.exports = router;