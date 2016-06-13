var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var models = require('../models/models');

var Verify = require('./verify.js');

var wordDefRouter = express.Router();

wordDefRouter.use(bodyParser.json());

wordDefRouter.route('/')
    .post(Verify.verifyUser, function (req, res, next) {
        //make sure the word for the definition exists
        models.Words.findOneAndUpdate({word: req.body.word}, {word: req.body.word, $inc: {nused: 1}},
            {upsert: true, new:true}, function (err, word) {
            if (err) next(err);

            var id = word._id;
            req.body.word = id;
            console.log('word id is: ' + id);

            console.log(req.body);

            req.body.createdBy = req.decoded._id;

            //set rating to 0 just in case if the user is trying to cheat
            req.body.rating = 0;

            for (var i = 0; i < req.body.tags.length; i++) {
                var tag_i = req.body.tags[i];

                models.Tags.findOneAndUpdate({tag: tag_i}, {$inc: {nused: 1}}, {upsert: true, new: true}, function (err, tag) {
                    if (err) next(err);

                    var tagId = tag._id;
                    console.log(tagId);
                });
            }

            models.WordDefs.create(req.body, function (error, wordDef) {
                if (error) next(error);

                var wordDefId = wordDef._id;
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });

                console.log('wordDef created, id: ' + wordDefId);
                res.end('wordDef created, id: ' + wordDefId);
            });
        });
    });

wordDefRouter.route('/top')
    .get(function (req, res, next) {
        models.WordDefs.find({}, '-createdBy -updatedAt -upvotes -downvotes')
            .sort({rating: -1})
            .limit(30)
            .populate('word')
            .exec(function (err, wordDefs) {
                if (err) next(err);

                res.json(wordDefs)
            });
    });

wordDefRouter.route('/new')
    .get(function (req, res, next) {
        models.WordDefs.find({}, '-createdBy -updatedAt -upvotes -downvotes')
            .sort({createdAt: -1})
            .limit(30)
            .populate('word')
            .exec(function (err, wordDefs) {
                if (err) next(err);

                res.json(wordDefs)
            });
    });

wordDefRouter.route('/random')
    .get(function (req, res, next) {
        models.WordDefs.findOneRandom({}, '-createdBy -updatedAt -upvotes -downvotes', {populate: 'word'}, function (err, wordDef) {
            if (err) next(err);

            res.json(wordDef);
        });
    });

wordDefRouter.route('/:wordDefId/upvote')
    .put(Verify.verifyUser, function (req, res, next) {
        models.WordDefs.findById(req.params.wordDefId, function (err, wordDef) {
            if (err) next(err);

            var userUpvoting = req.decoded._id;

            // user can only vote once
            if (wordDef.upvotes.indexOf(userUpvoting) === -1 && wordDef.downvotes.indexOf(userUpvoting) === -1) {
                wordDef.upvotes.push(userUpvoting);
                wordDef.rating = wordDef.upvotes.length - wordDef.downvotes.length;

                wordDef.save(function (error, wordDefU) {
                    if (err) next(err);

                    console.log('wordDef upvoted');
                    res.json(wordDefU);
                });
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });

                res.end('you can only vote once');
            }
        });

    });

wordDefRouter.route('/:wordDefId/downvote')
    .put(Verify.verifyUser, function (req, res, next) {
        models.WordDefs.findById(req.params.wordDefId, function (err, wordDef) {
            if (err) next(err);

            var userDownvoting = req.decoded._id;

            // user can only vote once
            if (wordDef.upvotes.indexOf(userDownvoting) === -1 && wordDef.downvotes.indexOf(userDownvoting) === -1) {
                wordDef.downvotes.push(userDownvoting);
                wordDef.rating = wordDef.upvotes.length - wordDef.downvotes.length;

                wordDef.save(function (error, wordDefU) {
                    if (err) next(err);

                    console.log('wordDef downvoted');
                    res.json(wordDefU);
                });
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });

                res.end('you can only vote once');
            }
        });

    });

module.exports = wordDefRouter;