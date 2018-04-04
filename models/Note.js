var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noteSchema = new Schema({
	title: {
		type: String
	},
	body: {
		type: String
	}
});

// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model('Note', noteSchema);

// Export the Note model
module.exports = Note;