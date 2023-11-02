const express = require('express');
const router = express.Router();
const users = require('../controllers/users.controller.js');

router.post('/login', users.login);
router.post('/logout', users.logout);
router.post('/register', users.register);

module.exports = router;