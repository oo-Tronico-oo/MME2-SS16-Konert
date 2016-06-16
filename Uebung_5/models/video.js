/**
 * @project:    MME2-SS16-Konert (Aufgabe 5)
 * @name:       video
 * @author:     Lisa Bittering, Christoph Kozielski, Nico Nauendorf
 * @date:       16.06.2016
 * @function:   Delivering the mongoose model for videos route in video.js
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var videoSchema = new Schema({
    _id: String,
    title: String,
    description: String,
    src: String,
    length: Number,
    timestamp: String,
    playcount: Number,
    ranking: Number
});