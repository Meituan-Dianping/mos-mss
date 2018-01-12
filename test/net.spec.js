'use strict';

let assert = require('assert');

let MSS = require('../src');

let streamClient = require('../src/net/net.js');

let config = require('./config');
let equal = assert.equal;
describe('test Clinet', function() {
    describe('test net.js', function() {
        it('test port error', function(done) {
            this.timeout(60000);

            let opts = { query: undefined,
                stream: {},
                headers: {
                    'Host': config.endpoint.split('//')[1],
                    'Content-Type': 'application/octet-stream',
                    'User-Agent': 'mss-superagent-nodejs',
                    'X-Amz-Content-Sha256': 'sha256 string',
                    'Authorization': 'AWS4-HMAC-SHA256 string'
                },
                method: 'PUT',
                timeout: undefined,
                path: '/mos-mss-test-object-bucket/test-multipart?partNumber=1&uploadId=0a105071513223467484071',
                port: 99
            };
            streamClient(opts, function(err, data) {
                if (err) {
                    equal(err instanceof Error, true);
                }
                done();
            });
        });
    });

    describe('test mss Client Function', function() {
        it('Client.initOptions call success', function() {
            let opts = MSS.initOptions(config);
            equal(typeof opts.endpoint, 'string');
        });
    });
});