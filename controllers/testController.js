const db = require('../models');

module.exports = {
	find: function (req, res) {
		db.Article.find({
			// No Articles to find yet
		}).then(function (dbArticle) {
			res.json(dbArticle);
		});
	},
	find: function (req, res) {
		db.Article.findOne({
			title: result.title
		}).then(function (dbArticle) {
			res.json(dbArticle);
		});
	},
	find: function (req, res) {
		db.Note.find({
				// No Articles to find yet
			}).then(function (dbNote) {
				// If all Notes are successfully found, send them back to the client
				res.json(dbNote);
			})
			.catch(function (err) {
				// If an error occurs, send the error back to the client
				res.json(err);
			});
	},
	create: function (req, res) {
		db.Note.create(req.body)
			.then(function (dbNote) {
				return db.Article.findOneAndUpdate({
					// Find the One to Update
				}, {
					$push: {
						notes: dbNote._id
					}
				}, {
					new: true
				});
			})
			.then(function (dbArticle) {
				// If the User was updated successfully, send it back to the client
				res.json(dbArticle);
			})
			.catch(function (err) {
				// If error occurs
				res.json(err);
			});
	},
	find: function (req, res) {
		db.Note.create(req.body).then(function (dbNote) {
			res.json(dbNote);
		});
	}
};

// same thing as
/*
router.get('/articles/:id', function (req, res) {
	console.log('ID is getting read' + req.params.id);

	// Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
	db.Article.findOne({
			'_id': req.params.id
		})
		*/