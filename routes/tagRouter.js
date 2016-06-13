var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var models = require('../models/models');

// var Verify = require('./verify.js');

var tagRouter = express.Router();

tagRouter.use(bodyParser.json());

//sends all the tags, just the tags column 
tagRouter.route('/')
    .get(function (req, res, next) {
        models.Tags.find({}, 'tag nused -_id', function (err, tags) {
            if (err) next(err);

            res.json(tags);
        });
    });

// //finds and sends all word definitions with a particular tagId
// tagRouter.route('/:tagId', function (req, res, next) {
//     models.WordDefs.find({tags: tagId}, function (err, wordDefs) {
//         if (err) next(err);
//
//         res.json(wordDefs);
//     });
// });

//all wordDefs that have this particular tag
tagRouter.route('/one')
    .post(function (req, res, next) {
        models.WordDefs.find({tags: req.body.tag}, '-createdBy -updatedAt -upvotes -downvotes')
            .populate('word')
            .exec(function (err, wordDefs) {
                if (err) next(err);

                res.json(wordDefs);
            });
    });

// tagRouter.route('/random')
//     .get(function (req, res, next) {
//         // models.Tags.findOneRandom({}, null, {}, function (err, tag) {
//         //     if (err) next(err);
//         //     if (err) console.log(err);
//         //
//         //     console.log(tag);
//         //
//         //     res.json(tag);
//         // });
//
//
//
//         models.Tags.findById("574f2323ba1609007f3bfafc", function (err, tag) {
//             if (err) throw err;
//
//             res.json(tag);
//         });
//     });

module.exports = tagRouter;