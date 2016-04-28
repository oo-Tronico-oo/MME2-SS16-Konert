/*
 Created on : 21.04.2016
 Authors    : Lisa Bitterling, Christoph Kozielski, Nico Nauendorf
 Function:  : Our main node js server file. Executed when started
 */

"use strict";

/**
 * Requirements
 */
var express = require("express");
var fs = require("fs");
var app = express();
var cache;

/**
 * Static directory
 */
app.use("/static", express.static(__dirname + '/static'));

/**
 * Handler for /time path for get requests
 *
 * @param req represents the HTTP request
 * @param res represents the HTTP response
 */
app.get('/time', function(req, res) {
    res.set('Content-Type', 'text/plain');
    var date = new Date();
    res.write(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + date.getMilliseconds());
    res.end();
});

/**
 * Handler for cache.txt path for get requests
 *
 * compare: blocking vs. non-blocking
 * http://code-maven.com/reading-a-file-with-nodejs
 *
 * @param req represents the HTTP request
 * @param res represents the HTTP response
 */
app.get('/file.txt', function(req, res){
    var time = process.hrtime()[1];
    if (cache) {
        res.set('Content-Type', 'text/plain');
        res.write(cache);
        res.write('\n\n' + (process.hrtime()[1] - time));
        res.end();
    } else {
        fs.readFile(__dirname + '/static/resource/file.txt', function (err, data) {
            if (err) return console.log(err);
            cache = data;
            res.set('Content-Type', 'text/plain');
            res.write(data);
            res.write('\n\n' + (process.hrtime()[1] - time));
            res.end();
        });
    }
});

/**
 * Handler for all requests at every other path
 *
 * @param req represents the HTTP request
 * @param res represents the HTTP response
 */
app.all('/*', function(req, res) {
    res.send('<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head><meta charset="utf-8"></head>' +
        '<body><h1>Hello World!</h1></body>' +
        '</html>'
    );
});

app.listen(3000, function () {
    console.log('helloworld app is ready and listening at http://localhost:3000');
});
