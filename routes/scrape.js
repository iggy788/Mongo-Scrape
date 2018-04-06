// Dependencies
const express = require('express');
const router = express.Router();
const db = require('../models');
const cheerio = require('cheerio');
const rp = require('request-promise');

// Scrape New Articles
router.get('/newArticles', function(req, res) {
  //configuring options object for request-promist
  const options = {
    uri: 'https://www.nytimes.com/section/us',
    transform: function (body) {
        return cheerio.load(body);
    }
  };

// Display Saved Articles from MongoDB
  db.Article
    .find({})
	  .then((savedArticles) => {
		  // Creates an Array of Article Headlines
		  let savedHeadlines = savedArticles.map(article => article.headline)

		// Calling request-promise
		rp(options)
        .then(function ($) {
		let newArticleArr = [];
		// Creating a newArticle object from the data after each Loop
          $('#latest-panel article.story.theme-summary').each((i, element) => {
            let newArticle = new db.Article({
              storyUrl: $(element).find('.story-body>.story-link').attr('href'),
              headline: $(element).find('h2.headline').text().trim(),
              summary : $(element).find('p.summary').text().trim(),
              imgUrl  : $(element).find('img').attr('src'),
              byLine  : $(element).find('p.byline').text().trim()
            });
            // Check to make sure newArticle contains a storyUrl
            if (newArticle.storyUrl) {
              // Checks to see if the article is already in the database, and if it isn't then it adds it
              if (!savedHeadlines.includes(newArticle.headline)) {
                newArticleArr.push(newArticle);
              }
			}
			console.log(newArticleArr);
          });

          // Add new articles to MongoDB
          db.Article
            .create(newArticleArr)
			  .then(result => res.json({ count: newArticleArr.length }))
			// Returning Count of New Articles Found
            .catch(err => {});
        })
        .catch(err => console.log(err))//end of rp method
    })
    .catch(err => console.log(err))//end of db.Article.find()
});// end of get request to /scrape

module.exports = router;