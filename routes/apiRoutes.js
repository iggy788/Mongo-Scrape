const router = require('express').Router();
const scrapeController = require('../controllers/testController')
// Main route index.handlebars
router.get('/:id','testController.find');
router.post('/new','testController.create');

module.exports = router;