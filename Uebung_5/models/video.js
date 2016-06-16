/**
 * @project:    MME2-SS16-Konert (Aufgabe 5)
 * @name:       video
 * @author:     Lisa Bittering, Christoph Kozielski, Nico Nauendorf
 * @date:       16.06.2016
 * @function:   Delivering the mongoose model for videos route in video.js
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Model = mongoose.Model;

// source: http://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
var urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&/=]*)?/gi;

var videoSchema = new Schema({
    _id: {
        type : String,
        required : false,
        default : mongoose.Types.ObjectId(),
        validate : {
            validator: function (value) {
                return (value) ? false : true;
            },
            message : "_id must not be set!"
        }
    },
    title: {
        type : String,
        required : [true, "Title is required"]
    },
    description: {
        type : String,
        required : false,
        default : ""
    },
    src: {
        type : String,
        required : [true, "src must be set!"],
        validate : {
            validator: function (value) {
                return urlRegex.test(value);
            },
            message : "src is not a valid URL!"
        }
    },
    length: {
        type : Number,
        required : [true, "length must be set!"],
        min : [0, "length cant't be smaller than 0!"]
    },
    timestamp: {
        type : String,
        required : false,
        default : Date.now(),
        validate : {
            validator: function (value) {
                return (value) ? false : true;
            },
            message : "timestamp must not be set!"
        }
    },
    playcount: {
        type : Number,
        required : false,
        min : 0,
        default : 0
    },
    ranking: {
        type : Number,
        required : false,
        min : 0,
        default : 0
    }
}, {
    timestamps : {
        createdAt : "timestamp"
    }
});

var VideoModel = new Model("Video", videoSchema);

module.exports = VideoModel;