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

app.use("/static", express.static("static"));

/**
 * Handler for get requests
 */
app.get("/*", function(req, res) {
        console.log(`Anfrage angekommen.`);
        res.send(`<h1>Hello World</h1>`);
});

/**
 * Start a listening server at the given port
 */
let port = 3000;
let server = app.listen(port, function() {
    console.log(`Server is now listening at port ${port}.`);
});