'use strict';

let assert = require('assert');

let MSS = require('../src');

let config = require('./config');
let equal = assert.equal;
describe('test Clinet', function() {
    describe('test mss Client Function', function() {
        it('Client.initOptions call success', function() {
            let opts = MSS.initOptions(config);
            equal(typeof opts.endpoint, 'string');
        });
    });
});