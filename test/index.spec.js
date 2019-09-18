'use strict';

let assert = require('assert');

let MSS = require('../src');

let config = require('./config');
let equal = assert.equal;
describe('test Clinet', function() {
    before(function() {
        this.MSS = new MSS(config);
    });

    it('if not Client, created one', function(done) {
        equal(typeof new MSS(config), 'object');
        done();
    });

    describe('test accessKeyId and accessKeySecret', function() {
        it('accessKeyId is must be', function(done) {
            equal(config.accessKeyId, this.MSS.options.accessKeyId);
            done();
        });
        it('accessKeySecret is must be', function(done) {
            equal(config.accessKeySecret, this.MSS.options.accessKeySecret);
            done();
        });
    });

    describe('test mss Client Function', function() {
        it('Client.initOptions call success', function() {
            let opts = MSS.initOptions(config);
            equal(typeof opts.endpoint, 'string');
        });
    });
});