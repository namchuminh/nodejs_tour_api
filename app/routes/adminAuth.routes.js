const express = require('express');
const router = express.Router();
const adminAuth = require('../controllers/admin/adminAuth.controller.js');

router.post('/dang-nhap', adminAuth.login);
router.post('/dang-xuat', adminAuth.logout);


module.exports = router;