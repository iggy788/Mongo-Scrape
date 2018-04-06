// Dependencies
const express = require('express');
const router = express.Router();
const db = require('../models');

// Route to update the articleSchema Object's SAVED Default Property to TRUE
router.get('/save/:id', (req,res) => {
  db.Article
    .update({_id: req.params.id},{saved: true})
    .then(result=> res.redirect('/'))
    .catch(err => res.json(err));
});

// Route to Get/Find all Saved Articles and Display them in savedArticles.handlebars
router.get('/viewSaved', (req, res) => {
  db.Article
    .find({})
    .then(result => res.render('savedArticles', {articles:result}))
    .catch(err => res.json(err));
});

// Route to Delete One Saved Article and DO NOT Display it in savedArticles.handlebars
router.delete('/deleteArticle/:id', function(req,res){
  db.Article
    .remove({_id: req.params.id})
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

module.exports = router;