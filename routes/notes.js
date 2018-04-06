// Dependencies
const express = require('express');
const router = express.Router();
const db = require('../models');

// Route for Getting/Finding ONE Article by id, populate it with it's note
router.get('/notes/:id', function (req, res) {
	// console.log('ID is getting read for' + req.params.id);
	db.Article
		.findOne({
			_id: req.params.id
		})
		.populate('notes')
		.then(results => res.json(results))
		.catch(err => res.json(err));
});

// Route to Getting/Finding ONE Single Note and it Return it to the Page
router.get('/getSingleNote/:id', function (req,res) {
  db.Note
	.findOne({_id: req.params.id})
	.then( result => res.json(result))
	.catch(err => res.json(err));
});

// Route to Post/Create a New Note in MongoDB
router.post('/createNote', function (req,res){
  let { title, body, articleId } = req.body;
  let note = {
    title,
    body
  }
  db.Note
    .create(note)
    .then( result => {
      db.Article
        .findOneAndUpdate({_id: articleId}, {$push:{notes: result._id}},{new:true})//saving reference to note in corresponding article
        .then( data => res.json(result))
        .catch( err => res.json(err));
    })
    .catch(err => res.json(err));
});

// Route Remove/Delete a Note
router.post('/deleteNote', (req,res)=>{
  let {articleId, noteId} = req.body
  db.Note
    .remove({_id: noteId})
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

module.exports = router;