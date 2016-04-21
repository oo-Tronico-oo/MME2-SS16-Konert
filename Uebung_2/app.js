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
 * Handler for get requests
 */
app.get(`/time`, function(req, res, next) {
    res.set('Content-Type', 'text/plain');
    res.send(`${Date.now()}`);
});
app.all(`/*`, function(req, res) {
    res.send(`<h1>Hello World</h1>`);
});

/**
 * Start a listening server at the given port
 */
let port = 3000;
let server = app.listen(port, function() {
    console.log(`Server is now listening at port ${port}.`);
});