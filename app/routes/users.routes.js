const express = require('express');
const router = express.Router();
const users = require('../controllers/users.controller.js');
const auth = require("../middlewares/auth.middleware.js");
const authorization = require("../middlewares/authorization.middleware.js");

router.post('/login', users.login);
router.post('/logout', users.logout);
router.post('/register', users.register);
router.get('/:id', auth, users.detailUser);
router.put('/:id', auth, users.editUser);
router.get('/', auth, authorization, users.index);



module.exports = router;