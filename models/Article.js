const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	summary: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	},
	note: [
		{
			type: Schema.Types.ObjectId,
			ref: "Note"
		}
	]
});

// This creates our model & Article model from the above schema
const Article = module.exports = mongoose.model('Article', articleSchema);