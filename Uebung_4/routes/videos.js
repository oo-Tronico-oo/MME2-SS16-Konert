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

var allowedKeys = ["id", "timestamp", "title", "src", "length", "description", "playcount", "ranking"];

// **************************************************************************************************** middlewares
/**
 * string for multiple errors, so the user get all at once and not just the first one on every request
 * @type {string}
 */
var errText = "";
/**
 * filter query (should we use default values instead?)
 */
videos.use(function(req, res, next) {
    if (req.method === "GET" && req.query.filter) {
        var filter = req.query.filter.replace(" ", "").split(",");
        var filterErr = "Filter not allowed: ";
        // check if all filters are valid
        filter.forEach(function(item) {
            if (allowedKeys.indexOf(item) === -1) {
                filterErr += item + ", ";
            }
        });
        if (filterErr !== "Filter not allowed: ") {
            errText = filterErr.slice(0, -2) + "; ";
            next();
        } else {
            if (!res.locals.items) res.locals.items = {};
            res.locals.items.filter = filter;
            next();
        }
    } else {
        next();
    }
});

/**
 * limit query (should we use default values instead?)
 */
videos.use(function(req, res, next) {
    if (req.method === "GET" && req.query.limit) {
        var lim = parseInt(req.query.limit);
        if (isNaN(lim)) {
            errText += "limit is not a number or empty; ";
            next();
        } else if (lim < 1) {
            errText += "limit must be greater than 0 (zero); ";
            next();
        } else {
            if (!res.locals.items) res.locals.items = {};
            res.locals.items.limit = lim;
            next();
        }
    } else {
        next();
    }
});

/**
 * offset query (should we use default values instead?)
 */
videos.use(function(req, res, next) {
    if (req.method === "GET" && req.query.offset) {
        var off = parseInt(req.query.offset);
        if (isNaN(off)) {
            errText += "offset is not a number or empty; ";
            next();
        } else if (off < 0) {
            errText += "offset must be 0 (zero) or greater; ";
            next();
        } else {
            if (!res.locals.items) res.locals.items = {};
            res.locals.items.offset = off;
            next();
        }
    } else {
        next();
    }
});

/**
 * error handler (skipped if none)
 */
videos.use(function(req, res, next) {
    if (errText !== "") {
        var err = new Error(errText);
        err.status = 400;
        errText = "";
        next(err);
    } else {
        next();
    }
});

// **************************************************************************************************** routes
videos.route('/')
    .get(function(req, res, next) {
        var vids = store.select("video");
        if (vids === undefined) res.status(204).end();
        if (res.locals.items) {
            var filter = res.locals.items.filter;
            var limit = res.locals.items.limit;
            var offset = res.locals.items.offset;
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
        }
        res.status(200).json(vids).end();
    })
    .post(function(req, res, next) {
        var vid = req.body;
        try {
            // Check if required keys are set and internal key "timestamp" is not set
            if (!vid.title || !vid.src || !vid.length) throw new Error("required keys (title, src, length) must be set!", vid);
            if (vid.length < 0 || vid.playcount < 0 || vid.ranking < 0) throw new Error("corrupted parameter (length, playcount, ranking)", vid);
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
        var id = req.params.id;
        var vid = req.body;
        vid = store.replace("video", id, vid).select("video", id);
        res.status(200).json(vid).end();
    })
    .delete(function(req, res, next) {
        try {
            var id = req.params.id;
            var vid = store.remove("video", id);
            res.status(204).type('json').end();
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
