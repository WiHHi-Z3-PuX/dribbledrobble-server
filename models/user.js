var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});

// var User = new Schema({
//     username: String,
//     password: String,
//     email: {
//         type: String,
//         required: true
//     },
//     admin: {
//         type: Boolean,
//         default: false
//     }
// });

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);