var router = require('express').Router();
var scrapeController = require('../controllers/testController')
// Main route index.handlebars
router.get('/:id','testController.find');
router.post('/new','testController.create');

module.exports = router;