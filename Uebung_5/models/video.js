/**
 * @project:    MME2-SS16-Konert (Aufgabe 5)
 * @name:       video
 * @author:     Lisa Bittering, Christoph Kozielski, Nico Nauendorf
 * @date:       16.06.2016
 * @function:   Delivering the mongoose model for videos route in video.js
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// source: http://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
var urlRegex = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/;

var videoSchema = new Schema({
    _id: {
        type: String,
        required: false,
        default: mongoose.Types.ObjectId,
        validate: [
            function (value) {
                return (value) ? true : false;
            },
            '_id must not be set!'
        ]
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    src: {
        type: String,
        required: [true, "src must be set!"],
        validate: {
            validator: function (value) {
                return urlRegex.test(value);
            },
            message: "src is not a valid URL!"
        }
    },
    length: {
        type: Number,
        required: [true, "length must be set!"],
        min: [0, "length cant't be smaller than 0!"]
    },
    timestamp: {
        type: Date,
        required: false,
        default: new Date(),
        validate: {
            validator: function (value) {
                return (value) ? true : false;
            },
            message: "timestamp must not be set!"
        }
    },
    playcount: {
        type: Number,
        required: false,
        min: 0,
        default: 0
    },
    ranking: {
        type: Number,
        required: false,
        min: 0,
        default: 0
    }
}, { //options object
    strict : "throw", // throw error if key is not defined in schema
    timestamps: {
        createdAt: "timestamp" // rename "createdAt" to "timestamp"
    }
});

var VideoModel = mongoose.model("videos", videoSchema);

module.exports = VideoModel;