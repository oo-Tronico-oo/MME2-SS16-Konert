/*
 Created on : 21.04.2016
 Authors    : Lisa Bitterling, Christoph Kozielski, Nico Nauendorf
 */

"use strict"

/**
 * Requirements
 */
let express = require("express");
let app = express();

/**
 * Static directory
 */
app.use(`/static`, express.static(`${__dirname}/static`));

/**
 * Handler for /time path for get requests
 */
app.get(`/time`, function(req, res, next) {
    res.set(`Content-Type`, `text/plain`);
    res.send(`${Date.now()}`);
});
/**
 * Handler for all requests at every other path
 */
app.all(`/*`, function(req, res) {
    res.send('<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head><meta charset="utf-8"></head>' +
        '<body><h1>Hello World!</h1></body>' +
        '</html>'
    );
});
var server = app.listen(3000, function () {
    console.log('helloworld app is ready and listening at http://localhost:3000');
});
