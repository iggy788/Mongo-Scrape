// Dependencies
const express = require('express');
const router = express.Router();
const db = require('../models');
const productRouter = require('./apiRoutes');
const htmlRouter = require('./htmlRoutes');

router.use('/api/products', productRouter);
router.use('/', htmlRouter);

// Route to Display index.handlebars with Articles
// router.get('/', (req,res) => {
//   db.Article
//     .find({})
//     .then(articles => res.render('index', {articles}))
//     .catch(err=> res.json(err));
// });

// module.exports = router;
