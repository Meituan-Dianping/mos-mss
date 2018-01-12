'use strict';

let assert = require('assert');

let MSS = require('../src');

let config = require('./config');

describe('test signer', function() {
    describe('test signer default v2', function() {
        before(function() {
            delete config.signerVersion;
            this.MSS = new MSS(config);
        });

        it('test signer v2 subResources', function(done) {
            assert.equal(this.MSS.subResources.acl, 1);
            done();
        });

        it('test signer v2 addAuthorization', function(done) {
            let author = this.MSS.addAuthorization({
                expired: false,
                expireTime: null,
                accessKeyId: 'accessKeyId',
                accessKeySecret: 'accessKeySecret'
            }, new Date(), {
                headers: {
                    'Transfer-Encoding': 'chunked',
                    'Host': 'msstest-corp.sankuai.com',
                    'Content-Type': 'application/octet-stream',
                    'User-Agent': 'mss-superagent-nodejs'
                },
                path: '/test-bucket/test-stream.json',
                method: 'PUT',
                body: undefined
            });
            assert.equal(typeof author.headers.Authorization, 'string');
            done();
        });
    });

    describe('test signer v2', function() {
        before(function() {
            config.signerVersion = 'v2';
            this.MSS = new MSS(config);
        });

        it('test signer v2 subResources', function(done) {
            assert.equal(this.MSS.subResources.acl, 1);
            done();
        });

        it('test signer v2 addAuthorization', function(done) {
            let author = this.MSS.addAuthorization({
                expired: false,
                expireTime: null,
                accessKeyId: 'accessKeyId',
                accessKeySecret: 'accessKeySecret'
            }, new Date(), {
                headers: {
                    'Transfer-Encoding': 'chunked',
                    'Host': 'msstest-corp.sankuai.com',
                    'Content-Type': 'application/octet-stream',
                    'User-Agent': 'mss-superagent-nodejs'
                },
                path: '/test-bucket/test-stream.json',
                method: 'PUT',
                body: undefined
            });
            assert.equal(typeof author.headers.Authorization, 'string');
            done();
        });
    });

    describe('test signer v4', function() {
        before(function() {
            config.signerVersion = 'v4';
            this.MSS = new MSS(config);
        });

        it('test signer v4 algorithm', function(done) {
            assert.equal(this.MSS.algorithm, 'AWS4-HMAC-SHA256');
            done();
        });

        it('test signer v4 addAuthorization', function(done) {
            let author = this.MSS.addAuthorization({
                expired: false,
                expireTime: null,
                accessKeyId: 'accessKeyId',
                accessKeySecret: 'accessKeySecret'
            }, new Date(), {
                headers: {
                    'Transfer-Encoding': 'chunked',
                    'Host': 'msstest-corp.sankuai.com',
                    'Content-Type': 'application/octet-stream',
                    'User-Agent': 'mss-superagent-nodejs'
                },
                path: '/test-bucket/test-stream.json',
                method: 'PUT',
                body: undefined
            });
            assert.equal(typeof author.headers.Authorization, 'string');
            done();
        });
    });
});