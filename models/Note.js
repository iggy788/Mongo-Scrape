const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noteSchema = new Schema({
    title: {
        type: String
    },
    body: {
        type: String
    }
});

// This creates our model & Note model from the above schema
const Note = module.exports = mongoose.model('Note', noteSchema);