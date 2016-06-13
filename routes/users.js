var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');

router.use(bodyParser.json());


/* GET users listing. */
router.route('/')
    .get(function (req, res, next) {
        User.find({}, '-_id username')
            .exec(function (err, users) {
                if (err) next(err);

                res.json(users);
            });
    });

router.post('/register', function (req, res) {
    User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, function (err, user) {
        if (err) {
            return res.status(500).json({eer: err});
        }

        user.email = req.body.email;

        user.save(function (err, user) {
            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({status: "Registration successful"});
            });
        });
    });
});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json({
                err: info
            });
        }

        req.logIn(user, function (err) {
            if (err) {
                return res.status(500).json({
                    err: "Could not log in user"
                });
            }

            console.log("User logged in: ", user);

            var token = Verify.getToken({"username": user.username, "_id": user._id, "admin": user.admin});

            res.status(200).json({
                status: 'Login successful',
                success: true,
                token: token
            });
        });
    })(req, res, next);
});

router.get('/logout', function (req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

module.exports = router;
