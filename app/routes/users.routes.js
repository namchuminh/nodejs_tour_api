const express = require('express');
const router = express.Router();
const users = require('../controllers/users.controller.js');
const auth = require("../middlewares/auth.middleware.js");

router.post('/login', users.login);
router.post('/logout', users.logout);
router.post('/register', users.register);
router.get('/:id', auth, users.detailUser);


module.exports = router;