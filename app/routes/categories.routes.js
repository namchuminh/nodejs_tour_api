const express = require('express');
const router = express.Router();
const categories = require('../controllers/categories.controller.js');
const auth = require("../middlewares/auth.middleware.js");
const authorization = require("../middlewares/authorization.middleware.js");

router.delete('/:id', auth, authorization, categories.remove);
router.put('/:id', auth, authorization, categories.edit);
router.post('/', auth, authorization, categories.add);
router.get('/:id', categories.detail);
router.get('/', categories.index);

module.exports = router;