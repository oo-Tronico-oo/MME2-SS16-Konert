/*
 Created on : 21.04.2016
 Authors    : Lisa Bitterling, Christoph Kozielski, Nico Nauendorf
 */

/**
 * Requirements
 */
//let express = require("express");
//let app = express();
//
///**
// * Handler for get requests
// */
//app.get("/*", function(req, res) {
//    console.log(`Anfrage angekommen.`);
//    res.send(`<h1>Hello World</h1>`);
//});
//
///**
// * Start a listening server at the given port
// */
//let port = 3000;
//let server = app.listen(port, function() {
//    console.log(`Server is now listening at port ${port}.`);
//});

var express = require('express');
var app = express();
// add and configure Route /
app.get('/', function (req, res) {
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