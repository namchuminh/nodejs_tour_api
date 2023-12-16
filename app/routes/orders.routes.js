const express = require('express');
const router = express.Router();
const orders = require('../controllers/orders.controller.js');
const auth = require("../middlewares/auth.middleware.js");
const authorization = require("../middlewares/authorization.middleware.js");


router.post('/:id/cancel', auth, orders.cancel);


router.post('/', auth, orders.add);
router.get('/:id', auth, orders.detail);
router.get('/', auth, orders.index);



module.exports = router;