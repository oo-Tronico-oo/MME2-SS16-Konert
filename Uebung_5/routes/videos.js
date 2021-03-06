/** This module defines the routes for videos using the store.js as db memory
 *
 * @author Johannes Konert
 * @contributingAuthors Lisa Bitterling, Christoph Kozielski, Nico Nauendorf
 * @licence CC BY-SA 4.0
 *
 * @module routes/videos
 * @type {Router}
 * @description exports a router module for expressjs for video endpoint,
 * that writes, reads and updates objects in the mongo database
 */

// remember: in modules you have 3 variables given by CommonJS
// 1.) require() function
// 2.) module.exports
// 3.) exports (which is module.exports)

// modules
var express = require('express');
var logger = require('debug')('me2u5:videos');
var middleware = require('../restapi/video-middlewares');
var VideoModel = require('../models/video');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/me2');

var videos = express.Router();

var allowedKeys = ["id", "timestamp", "title", "src", "length", "description", "playcount", "ranking"];

// **************************************************************************************************** middlewares
videos.use(middleware);

// **************************************************************************************************** routes
videos.route('/')
        .get(function (req, res, next) {
            var filter;                                         //filter = undefined
            if (res.locals.items && res.locals.items.filter) {
                 filter = res.locals.items.filter;
                 filter = filter.toString().replace(',',' ');
            } 
            VideoModel.find({}, filter, function (err, docs) {  //filter wird nicht berücksichtigt wenn filter = undefined
                if (!err) {
                    if (docs.length > 0)
                        res.status(200).json(docs).end();
                    else res.status(204).type("json").end();
                } else {
                    next(err);
                }
            });
            // var vids = store.select("video");
            // if (vids === undefined) {
            //     res.status(204).end();
            //     return;
            // }
            //     var limit = res.locals.items.limit;
            //     var offset = res.locals.items.offset;
            //     var search = res.locals.items.search;
            //     if (filter) {
            //         vids.forEach(function(vid) {
            //             clearNotAllowed(vid, filter);
            //         });
            //     }
            //     if (limit || offset) {
            //         offset = offset || 0;
            //         if (offset >= vids.length) {
            //             var err = new Error("offset higher than database length");
            //             err.status = 400;
            //             next(err);
            //             return;
            //         }
            //         limit = limit || vids.length;
            //         vids = vids.slice(offset, limit + offset);
            //     }
            //     if (search) {
            //         Object.keys(search).forEach(function(key) {
            //             for (var i = 0; i < vids.length; i++) {
            //                 if (typeof vids[i][key] === "string") {
            //                     if (!(vids[i][key].includes(search[key]))) {
            //                         vids.splice(i, 1);
            //                         i--;
            //                     }
            //                 } else if (typeof vids[i][key] === "number") {
            //                     if (vids[i][key] !== parseInt(search[key])) {
            //                         vids.splice(i, 1);
            //                         i--;
            //                     }
            //                 }
            //             }
            //         });
            //     }
            // }
            // res.status(200).json(vids).end();
        })
        .post(function (req, res, next) {
            try {
                // Error for not allowed paths is thrown separately, must be catch here
                var video = new VideoModel(req.body);
                if (video) {
                    video.save(function (err) {
                        if (!err) {
                            res.status(201).json(video).end();
                        } else {
                            var errText = "";
                            Object.keys(err.errors).forEach(function (item) {
                                errText += err.errors[item].name + ": " + err.errors[item].message + " \n";
                            });
                            err.message = errText + err.message;
                            err.status = 400;
                            next(err);
                        }
                    });
                }
            } catch (err) {
                // Hide using mongoose for users
                // err = JSON.parse(JSON.stringify(err).replace(" and strict mode is set to throw", ""));
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
        .get(function (req, res) {
            VideoModel.findById(req.params.id, function (err, doc) {
                if (!err) {
                    if (doc)
                        res.status(200).json(doc).end();
                    else
                        res.status(204).type("json").end();
                } else {
                    // TODO: When does this happen, what to do here? (null if id not found)
                }
            });
            // TODO: implement filtering for paths
            // var vid = store.select("video", req.params.id);
            // if (vid === undefined) res.status(204).end();
            // else {
            //     if (res.locals.items && res.locals.items.filter) {
            //         clearNotAllowed(vid, res.locals.items.filter);
            //     }
            //     res.status(200).json(vid).end();
            // }
        })
        .put(function (req, res, next) {
            var bodyObj = req.body;
            if (bodyObj) {
                // TODO: correct this function (does not work for now)
                if (req.params.id === bodyObj._id) {
                    VideoModel.findById(req.params.id, function (err, doc) {
                        if (!err) {
                            if (doc && doc.updatedAt.getTime() === Date.parse(bodyObj.updatedAt)) { //Bonusaufgabe 3
                                clearNotAllowed(bodyObj); //delete _id, __v, timestamp and updatedAt in body object
                                try {
                                    var video = new VideoModel(bodyObj);

                                    Object.keys(video).forEach(function (key) {
                                        if (key !== "_id" && key !== "__v" && bodyObj[key])
                                            bodyObj[key] = video[key];
                                    });

                                    VideoModel.findByIdAndUpdate(req.params.id, bodyObj,
                                            {"new": true, runValidators: true}, function (err, doc) {
                                        if (!err && doc) {
                                            res.status(200).json(doc).end();
                                        } else {
                                            next(err);
                                        }
                                    });
                                } catch (err) {
                                    // Hide using mongoose for users
                                    // err = JSON.parse(JSON.stringify(err).replace(" and strict mode is set to throw", ""));
                                    err.status = 400;
                                    next(err);
                                }
                            } else{
                                var error = new Error("updateAT different");
                                error.status = 409;
                                next(error);
                            }
                        } else {
                            // TODO: When does this happen, what to do here? (null if id not found)
                        }
                    });

//                    VideoModel.findById(req.params.id, function (err, doc) {
//                        if (!err) {
//                            if (doc) {
//
//                                Object.keys(doc).forEach(function (path) {
//                                    console.log(path + " : " + doc[path]);
//                                    if (VideoModel.schema.paths[path])
//                                        doc.$__[path] = req.body[path] || VideoModel.schema.paths[path].defaultValue;
//                                });
//                                VideoModel.findByIdAndUpdate(req.params.id, doc.$__,
//                                        {"new": true, runValidators: true}, function (err, doc) {
//                                    if (!err) {
//                                        res.status(200).json(doc).end();
//                                    } else {
//                                        next(err);
//                                    }
//                                });
//                            } else {
//                                var err = new Error("id not found", req.params.id);
//                                err.status = 404;
//                                next(err);
//                            }
//                        } else {
//                            // TODO: When does this happen, what to do here? (null if id not found)
//                        }
//                    });
                } else {
                    var err = new Error("id in param and object don't match");
                    err.status = 400;
                    next(err);
                }
            } else {
                var err = new Error("body in request is empty");
                err.status = 400;
                next(err);
            }
            // try {
            //     var id = req.params.id;
            //     var vid = req.body;
            //     vid = store.replace("video", id, vid).select("video", id);
            //     res.status(200).json(vid).end();
            // } catch (err) {
            //     err.status = 400;
            //     next(err);
            // }
        })
        .delete(function (req, res, next) {
            VideoModel.findByIdAndRemove(req.params.id, function (err, doc) {
                if (!err) {
                    if (doc)
                        res.status(200).json(doc).end();
                    else
                        res.status(404).type("json").end();
                } else {
                    // TODO: When does this happen?
                }
            });
            // try {
            //     var id = req.params.id;
            //     store.remove("video", id);
            //     res.status(204).type('json').end();
            // } catch (err) {
            //     err.status = 404;
            //     next(err);
            // }
        })
        .patch(function (req, res, next) { // Patch implementation is idempotent
            var id = req.params.id;
            var patch = req.body;
            if (patch) {
                if (patch.id && patch._id !== id) {
                    var err = new Error("id in body is false", id);
                    err.status = 404;
                    next(err);
                } else {
                    VideoModel.findByIdAndUpdate(id, patch,
                            {"new": true, runValidators: true}, // return new object instead of old one and rerun validators
                            function (err, doc) {
                                if (!err && doc) {
                                    res.status(200).json(doc).end();
                                } else {
                                    var err = new Error("id not found", id);
                                    err.status = 404;
                                    next(err);
                                }
                            });
                }
            }
            // var id = req.params.id;
            // var patch = req.body;
            // if (JSON.stringify(patch) === JSON.stringify({"playcount": "+1"})) {
            //     var vid = store.select("video", id);
            //     vid.playcount++;
            //     store.replace("video", id, vid);
            //     res.status(200).type("json").end();
            // } else {
            //     var err = new Error("Sent patch object is not correct", patch);
            //     err.status = 400;
            //     next(err);
            // }
        })
        .all(function (req, res, next) {
            var err = new Error("Wrong method");
            err.status = 405;
            next(err);
        });

// TODO: remove this function, when rest is finished
/**
 * deletes all not allowed keys in the obj object
 * @param obj (Object) the object to check for forbidden keys
 * @param filter (Array) the Array that should be checked
 * @returns {*}
 */
var clearNotAllowed = function (obj, filter) {
    var notAllowed = ["_id", "__v", "updatedAt", "timestamp"]; //filter || allowedKeys;
    Object.keys(obj).forEach(function (key) {
        if (notAllowed.indexOf(key) >= 0)
            delete obj[key];
    });
    return obj;
};

module.exports = videos;