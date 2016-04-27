/*
 Created on : 21.04.2016
 Authors    : Lisa Bitterling, Christoph Kozielski, Nico Nauendorf
 */

"use strict"

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
app.use('/static', express.static('${__dirname}/static'));

/**
 * Handler for /time path for get requests
 */
app.get('/time', function(req, res) {
    res.set('Content-Type', 'text/plain');
    res.send('${Date.now()}');
});
/**
 * Handler for cache.txt path for get requests
 *
 * compare: blocking vs. non-blocking
 * http://code-maven.com/reading-a-file-with-nodejs
 */
app.get('/file.txt', function(req, res){
    var time = process.hrtime()[1];
    if (cache) {
        res.set('Content-Type', 'text/plain');
        res.write(cache);
        res.write('\n\n${process.hrtime()[1] - time}');
        res.send();
    } else {
        fs.readFile('${__dirname}/static/resource/file.txt', function (err, data) {
            if (err) return console.log(err);
            cache = data;
            res.set('Content-Type', 'text/plain');
            res.write(data);
            res.write('\n\n${process.hrtime()[1] - time}');
            res.send();
        });
    }
});

/**
 * Handler for all requests at every other path
 */
app.all('/*', function(req, res) {
    res.send('<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head><meta charset="utf-8"></head>' +
        '<body><h1>Hello World!</h1></body>' +
        '</html>'
    );
});

function memoizer(memo, func) {
    
}

app.listen(3000, function () {
    console.log('helloworld app is ready and listening at http://localhost:3000');
});
