const router = require('express').Router();

// Controllers
const { renderIndex } = require('../controllers/index.controller');

router.get('/', renderIndex);

module.exports = router;
