/** This module defines the routes for videos using the store.js as db memory
 *
 * @author Johannes Konert
 * @licence CC BY-SA 4.0
 *
 * @module routes/videos
 * @type {Router}
 */

// remember: in modules you have 3 variables given by CommonJS
// 1.) require() function
// 2.) module.exports
// 3.) exports (which is module.exports)

// modules
var express = require('express');
var logger = require('debug')('me2u4:videos');
var store = require('../blackbox/store');

var videos = express.Router();

// if you like, you can use this for task 1.b:
var requiredKeys = {title: 'string', src: 'string', length: 'number'};
var optionalKeys = {description: 'string', playcount: 'number', ranking: 'number'};
var internalKeys = {id: 'number', timestamp: 'number'};


// routes **********************
videos.route('/')
    .get(function(req, res, next) {
        // TODO
        var vids = store.select("video");
        if (vids === undefined) res.status(204).end();
        else res.status(200).json(vids).end();
    })
    .post(function(req, res, next) {
        var vid = req.body;
        try {
            // Check if required keys are set and internal key "timestamp" is not set
            if (!vid.title || !vid.src || !vid.length) throw new Error("required keys (title, src, length) must be set!", vid);
            if (vid.length < 0 || vid.playcount < 0 || vid.ranking < 0) throw new Error("corrupted parameter (length, playcount, ranking", vid);
            if (vid.timestamp) throw new Error("timestamp must not be set on insert!", vid);

            // Check if optional keys are set, else set default values
            vid.description = vid.description || "";
            vid.playcount = vid.playcount || 0;
            vid.ranking = vid.ranking || 0;

            // set timestamp
            vid.timestamp = Date.now();

            // remove all not allowed keys from object
            vid = clearNotAllowed(vid);

            // put in store and get new id (if no error appears) and then get new video from store
            var id = store.insert("video", vid);
            vid = store.select("video", id);

            // send result
            res.status(201).json(vid).end();
        } catch (err) {
            err.status = 400;
            next(err);
        }
    })
    .all(function (req, res, next) {
        var err = new Error("Wrong method");
        err.status = 405;
        next(err);
    });

videos.route("/:id")
    .get(function(req, res, next) {
        var vid = store.select("video", req.params.id);
        if (vid === undefined) res.status(204).end();
        else res.status(200).json(vid).end();
    })
    .put(function(req, res, next) {
        var id = req.params.id;
        var vid = req.body;
        vid = store.replace("video", id, vid).select("video", id);
        res.status(200).json(vid).end();
    })
    .delete(function(req, res, next) {
        try {
            var id = req.params.id;
            var vid = store.remove("video", id);
            res.status(204).set('Content-Type', "application/json").end();
        } catch (err) {
            err.status = 404;
            next(err);
        }
    })
    .all(function (req, res, next) {
        var err = new Error("Wrong method");
        err.status = 405;
        next(err);
    });

// this middleware function can be used, if you like (or remove it)
videos.use(function(req, res, next){
    // if anything to send has been added to res.locals.items
    if (res.locals.items) {
        // then we send it as json and remove it
        res.json(res.locals.items);
        delete res.locals.items;
    } else {
        // otherwise we set status to no-content
        res.set('Content-Type', 'application/json');
        res.status(204).end(); // no content;
    }
});

/**
 * deletes all not allowed keys in the obj object
 * @param obj the object to check for forbidden keys
 */
var clearNotAllowed = function(obj) {
    var allowedKeys = ["id", "timestamp", "title", "src", "length", "description", "playcount", "ranking"];
    Object.keys(obj).forEach(function(key) {
        if (allowedKeys.indexOf(key) === -1) delete obj[key];
    });
    return obj;
};

module.exports = videos;
