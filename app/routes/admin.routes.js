const express = require('express');
const router = express.Router();
const admin = require('../controllers/admin.controller.js');

router.post('/login', admin.login);
router.post('/logout', admin.logout);


module.exports = router;