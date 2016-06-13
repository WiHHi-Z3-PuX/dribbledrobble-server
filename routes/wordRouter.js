var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var models = require('../models/models');

var wordRouter = express.Router();

wordRouter.use(bodyParser.json());

wordRouter.route('/')
    .get(function (req, res, next) {
        models.Words.find({}, 'word nused -_id')
            .exec(function (err, words) {
                if (err) next(err);

                res.json(words);
            });
    });

wordRouter.route(':wordId')
    .get(function (req, res, next) {
        models.WordDefs.find({word: req.params.wordId}, function (err, wordDefs) {
            if (err) next(err);

            res.json(wordDefs);
        });
    });

wordRouter.route('/one')
    .post(function (req, res, next) {
        models.Words.findOne({word: req.body.word}, function (err, word) {
            if (err) next(err);

            var wordId = word._id;

            models.WordDefs.find({word: wordId}, '-createdBy -updatedAt -upvotes -downvotes')
                .populate('word')
                .exec(function (error, wordDefs) {
                    if (error) next(error);

                    res.json(wordDefs);
                });
        });
    });

wordRouter.route('/random')
    .get(function (req, res, next) {
        models.Words.findOneRandom(function (err, wordObj) {
            if (err) throw err;

            if (wordObj) {
                models.WordDefs.find({word: wordObj._id}, '-createdBy -updatedAt -upvotes -downvotes', {populate: 'word'}, function (error, wordDefs) {
                    if (error) next(error);

                    res.json(wordDefs);
                });
            }
        });
    });

module.exports = wordRouter;