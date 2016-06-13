var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');
var random = require('mongoose-simple-random');

var wordSchema = new Schema({
    word: {
        type: String,
        minlength: 2,
        maxlength: 20,
        required: true,
        unique: true
    },
    nused: {
        type: Number,
        default: 1
    }
});

var tagSchema = new Schema({
    tag: {
        type: String,
        minlength: 2,
        maxlength: 20,
        required: true,
        unique: true
    },
    nused: {
        type: Number,
        default: 1
    }
});

var wordDefSchema = new Schema({
    word: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Word'
    },
    wordDef: {
        type: String,
        minlength: 30,
        maxlength: 500,
        required: true,
        unique: true
    },
    example: {
        type: String,
        maxlength: 300
    },
    tags: [{
        type: String
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    rating: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

wordSchema.plugin(findOrCreate);
tagSchema.plugin(findOrCreate);
wordSchema.plugin(random);
wordDefSchema.plugin(random);
tagSchema.plugin(random);



var models = {
    Tags: mongoose.model('Tag', tagSchema),
    WordDefs: mongoose.model('WordDef', wordDefSchema),
    Words: mongoose.model('Word', wordSchema)
};

module.exports = models;