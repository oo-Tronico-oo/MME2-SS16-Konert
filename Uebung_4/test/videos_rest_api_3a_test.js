/** This is a testfile to be run wit mocha.
 *  Remember to start your node server before and edit config_for_tests for a proper baseURL.
 *
 * @author Johannes Konert
 * @licence CC BY-SA 4.0
 *
 */
"use strict";

var should = require('should');
require('should-http');
var request = require('supertest');
var cfg = require('./../test/config_for_tests');

var baseURL = cfg.baseURL; // please change it in file config_for_tests.js
var videoURL = cfg.videoURL;


// some helper objects and function to be send to node ********************************************
var videoURL = baseURL + 'videos';
var codes = cfg.codes;
var video1 = cfg.videoSearch1;
var video2 = cfg.videoSearch2;
var video3 = cfg.videoSearch3;
var video4 = cfg.videoSearch4;

// start of tests ********************************************************************************
describe('Task 3.a browse through data', function() {
    var videoResults = [];
    var totalResults = [];
    var total = 0;
    var videoIDsCleanup = [];
    describe('/videos REST API Filling by Posts (prepare)', function() {
        // ask for correct filters
        it('should again create a video on post', function(done) {
            request(videoURL)
                .post('/')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(video1)
                .expect('Content-Type', /json/)
                .expect(codes.created)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.should.have.ownProperty('id').above(0);
                    videoResults.push(res.body);
                    videoIDsCleanup.push(res.body.id);
                    done();
                });
        });
        it('should again create a 2. video on post', function(done) {
            request(videoURL)
                .post('/')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(video2)
                .expect('Content-Type', /json/)
                .expect(codes.created)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.should.have.ownProperty('id').above(0);
                    videoResults.push(res.body);
                    videoIDsCleanup.push(res.body.id);
                    done();
                });
        });
        it('should again create a 3. video on post', function(done) {
            request(videoURL)
                .post('/')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(video3)
                .expect('Content-Type', /json/)
                .expect(codes.created)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.should.have.ownProperty('id').above(0);
                    videoResults.push(res.body);
                    videoIDsCleanup.push(res.body.id);
                    done();
                });
        });
        it('should again create a 4. video on post', function(done) {
            request(videoURL)
                .post('/')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(video4)
                .expect('Content-Type', /json/)
                .expect(codes.created)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.should.have.ownProperty('id').above(0);
                    videoResults.push(res.body);
                    videoIDsCleanup.push(res.body.id);
                    done();
                });
        });
        it('should deliver all videos without any limits or offsets', function(done) {
            request(videoURL)
                .get('/')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(codes.success)
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.length.should.be.equal(4);
                    total = res.body.length;
                    totalResults = res.body;
                    done();
                });
        });
    });
    // here start the real limit/offset tests with the data inserted above **************
    describe("now testing search", function() {
        it('should deliver 2 videos with title "beuth"', function(done) {
            request(videoURL)
                .get('/?title=beuth')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(codes.success)
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.length.should.be.equal(2);
                    done();
                });
        });
        it('should deliver 1 video with title "spain"', function(done) {
            request(videoURL)
                .get('/?title=spain')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(codes.success)
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.length.should.be.equal(1);
                    done();
                });
        })
        it('should get status 404 with search for "test"', function(done) {
            request(videoURL)
                .get('/?test=spain')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(codes.wrongrequest)
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.be.json();
                    done();
                });
        });
        it('should deliver 1 video with title "beuth" & playcount "42"', function(done) {
            request(videoURL)
                .get('/?title=beuth&playcount=42')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(codes.success)
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.length.should.be.equal(1);
                    done();
                });
        });
    });
    // delete the posted videos at end if not already deleted...
    after(function(done) {
        var numDone = videoIDsCleanup.length;
        for (var i = 0; i < videoIDsCleanup.length; i++) {
            request(videoURL)
                .delete('/' + videoIDsCleanup[i])
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect(true)
                .end(function() {
                    if (--numDone === 0) {
                        done();
                    }
                });
        };
        if (numDone === 0) {
            done();
        }
    });
});
