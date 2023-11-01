const express = require('express');
const router = express.Router();
const tours = require('../controllers/admin/tours.controller.js');

router.post('/', tours.add);
router.get('/', tours.index);


module.exports = router;