const express = require('express');
const router = express.Router();
const orders = require('../controllers/orders.controller.js');
const auth = require("../middlewares/auth.middleware.js");
const authorization = require("../middlewares/authorization.middleware.js");

router.delete('/:id', auth, authorization, orders.remove);
router.post('/', auth, orders.add);
router.get('/:id', auth, orders.detail);
router.get('/', auth, authorization, orders.index);

module.exports = router;