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
var middleware = require('../restapi/video-middlewares');

var videos = express.Router();

// if you like, you can use this for task 1.b:
var requiredKeys = {title: 'string', src: 'string', length: 'number'};
var optionalKeys = {description: 'string', playcount: 'number', ranking: 'number'};
var internalKeys = {id: 'number', timestamp: 'number'};

var allTypsOfKeys = {title: 'string', src: 'string', length: 'number', description: 'string', playcount: 'number', ranking: 'number'};

var allowedKeys = ["id", "timestamp", "title", "src", "length", "description", "playcount", "ranking"];
var usedKeywords = ["filter", "limit", "offset"];

// **************************************************************************************************** middlewares
videos.use(middleware);

// **************************************************************************************************** routes
videos.route('/')
    .get(function(req, res, next) {
        var vids = store.select("video");
        if (vids === undefined) {
            res.status(204).end();
            return;
        }
        if (res.locals.items) {
            var filter = res.locals.items.filter;
            var limit = res.locals.items.limit;
            var offset = res.locals.items.offset;
            var search = res.locals.items.search;
            if (filter) {
                vids.forEach(function(vid) {
                    clearNotAllowed(vid, filter);
                });
            }
            if (limit || offset) {
                offset = offset || 0;
                if (offset >= vids.length) {
                    var err = new Error("offset higher than database length");
                    err.status = 400;
                    next(err);
                    return;
                }
                limit = limit || vids.length;
                vids = vids.slice(offset, limit + offset);
            }
            if (search) {
                Object.keys(search).forEach(function(key) {
                    for (var i = 0; i < vids.length; i++) {
                        if (typeof vids[i][key] === "string") {
                            if (!(vids[i][key].includes(search[key]))) {
                                vids.splice(i, 1);
                                i--;
                            }
                        } else if (typeof vids[i][key] === "number") {
                            if (vids[i][key] !== parseInt(search[key])) {
                                vids.splice(i, 1);
                                i--;
                            }
                        }
                    }
                });
            }
        }
        res.status(200).json(vids).end();
    })
    .post(function(req, res, next) {
        var vid = req.body;
        try {
            // Check if required keys are set and internal key "timestamp" is not set
            if (!vid.title || !vid.src || !vid.length)
                throw new Error("required keys (title, src, length) must be set!", vid);
            
            Object.keys(vid).forEach(function(key){
                if(typeof vid[key] !== allTypsOfKeys[key])
                    throw new Error("At least one of the required keys has the wrong type", vid);
            });
            if (vid.length < 0 || vid.playcount < 0 || vid.ranking < 0)
                throw new Error("corrupted parameter (length, playcount, ranking)", vid);
            if (vid.timestamp)
                throw new Error("timestamp must not be set on insert!", vid);

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
    .get(function(req, res) {
        var vid = store.select("video", req.params.id);
        if (vid === undefined) res.status(204).end();
        else {
            if (res.locals.items && res.locals.items.filter) {
                clearNotAllowed(vid, res.locals.items.filter);
            }
            res.status(200).json(vid).end();
        }
    })
    .put(function(req, res) {
        try {
            var id = req.params.id;
            var vid = req.body;
            vid = store.replace("video", id, vid).select("video", id);
            res.status(200).json(vid).end();
        } catch (err) {
            err.status = 400;
            next(err);
        } 
    })
    .delete(function(req, res, next) {
        try {
            var id = req.params.id;
            store.remove("video", id);
            res.status(204).type('json').end();
        } catch (err) {
            err.status = 404;
            next(err);
        }
    })
    .patch(function(req, res, next) {
        var id = req.params.id;
        var patch = req.body;
        if (JSON.stringify(patch) === JSON.stringify({"playcount" : "+1"})) {
            var vid = store.select("video", id);
            vid.playcount++;
            store.replace("video", id, vid);
            res.status(200).type("json").end();
        } else {
            var err = new Error("Sent patch object is not correct", patch);
            err.status = 400;
            next(err);
        }
    })
    .all(function (req, res, next) {
        var err = new Error("Wrong method");
        err.status = 405;
        next(err);
    });

/**
 * deletes all not allowed keys in the obj object
 * @param obj (Object) the object to check for forbidden keys
 * @param filter (Array) the Array that should be checked
 * @returns {*}
 */
var clearNotAllowed = function(obj, filter) {
    var allowed = filter || allowedKeys;
    Object.keys(obj).forEach(function(key) {
        if (allowed.indexOf(key) === -1) delete obj[key];
    });
    return obj;
};

module.exports = videos;
