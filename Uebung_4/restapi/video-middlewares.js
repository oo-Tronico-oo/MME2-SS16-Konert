var internalKeys = {id: 'number', timestamp: 'number'};

var allowedKeys = ["id", "timestamp", "title", "src", "length", "description", "playcount", "ranking"];
var usedKeywords = ["filter", "limit", "offset"];

var videoMiddlewares = require('express').Router();

/**
 * string for multiple errors, so the user get all at once and not just the first one on every request
 * @type {string}
 */
var errText = "";
/**
 * filter query (should we use default values instead?)
 */
videoMiddlewares.use(function(req, res, next) {
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
        } else {
            if (!res.locals.items) res.locals.items = {};
            res.locals.items.filter = filter;
        }
    }
    next();
});

/**
 * limit query (should we use default values instead?)
 */
videoMiddlewares.use(function(req, res, next) {
    if (req.method === "GET" && req.query.limit) {
        var lim = parseInt(req.query.limit);
        if (isNaN(lim)) {
            errText += "limit is not a number or empty; ";
        } else if (lim < 1) {
            errText += "limit must be greater than 0 (zero); ";
        } else {
            if (!res.locals.items) res.locals.items = {};
            res.locals.items.limit = lim;
        }
    }
    next();
});

/**
 * offset query (should we use default values instead?)
 */
videoMiddlewares.use(function(req, res, next) {
    if (req.method === "GET" && req.query.offset) {
        var off = parseInt(req.query.offset);
        if (isNaN(off)) {
            errText += "offset is not a number or empty; ";
        } else if (off < 0) {
            errText += "offset must be 0 (zero) or greater; ";
        } else {
            if (!res.locals.items) res.locals.items = {};
            res.locals.items.offset = off;
        }
    }
    next();
});

/**
 * search queries
 */
videoMiddlewares.use(function(req, res, next) {
    if (req.method === "GET" && req.query) {
        var searchErr = "Search for the following keywords is not permitted: ";
        Object.keys(req.query).forEach(function(key) {
            if (usedKeywords.indexOf(key) === -1) {
                if (allowedKeys.indexOf(key) !== -1 && Object.keys(internalKeys).indexOf(key) === -1) {
                    if (!res.locals.items) res.locals.items = {};
                    if (!res.locals.items.search) res.locals.items.search  = {};
                    res.locals.items.search[key] = req.query[key];
                } else {
                    searchErr += key + ", ";
                }
            }
        });
        if (searchErr !== "Search for the following keywords is not permitted: ") {
            searchErr = searchErr.slice(0, -2) + "; ";
            errText += searchErr;
        }
    }
    next();
});

/**
 * error handler (skipped if none)
 */
videoMiddlewares.use(function(req, res, next) {
    if (errText !== "") {
        var err = new Error(errText);
        err.status = 400;
        errText = "";
        next(err);
    } else {
        next();
    }
});

module.exports = videoMiddlewares;