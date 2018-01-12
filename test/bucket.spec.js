'use strict';

let assert = require('assert');
let MSS = require('../src');

let equal = assert.equal;
let config = require('./config');
let dataParam = require('./dataParam');

describe('test bucket', function() {
    before(async function() {
        this.MSS = new MSS(config);
        this.bucket = 'mos-mss-test-bucket';
        let { code } = await this.MSS.createBucket(this.bucket);
        equal(code, 200);
    });

    after(async function() {
        let result = await this.MSS.deleteBucket(this.bucket);
        let { code } = result;
        equal(code, 200);
    });

    describe('listBucket()', function() {
        it('test list', async function() {
            let result = await this.MSS.listBucket();
            let { code, data } = result;
            if (code === 200) {
                equal(Array.isArray(data.Buckets), true);
                equal(typeof data.Owner.ID, 'string');
                equal(typeof data.Owner.DisplayName, 'string');
            }
        });
    });

    describe('createBucket()', function() {
        it('create a new bucket successful', async function() {
            let result = await this.MSS.createBucket('createTestBucket');
            let { code, data } = result;
            equal(code, 200);
            equal(typeof data['x-mss-trace-id'], 'string');
        });

        it('don\'t create the same name bucket', async function() {
            let result = await this.MSS.createBucket('createTestBucket');
            let { code, error } = result;
            equal(code, 409);
            equal(error.Code, 'BucketAlreadyExists');
        });

        after(async function() {
            let result = await this.MSS.deleteBucket('createTestBucket');
            let { code } = result;
            equal(code, 200);
        });
    });

    describe('deleteBucket()', function() {
        it('delete not exists bucket throw NoSuchBucket', async function() {
            let result = await this.MSS.deleteBucket('not-exists-bucket');
            let { code, error } = result;
            equal(code, 404);
            equal(error.Code, 'NoSuchBucket');
        });

        it('delete not empty bucket throw BucketNotEmpty', async function() {
            this.MSS.use(this.bucket);
            let result = await this.MSS.putObject('test.txt', new Buffer('test'));
            equal(result.code, 200);

            let result2 = await this.MSS.deleteBucket(this.bucket);
            equal(result2.code, 409);
            equal(result2.error.Code, 'BucketNotEmpty');

            let result3 = await this.MSS.deleteObject('test.txt');
            equal(result3.code, 200);
        });
    });

    describe('getBucket()', function() {
        it('get bucket meta successful', async function() {
            let { code } = await this.MSS.getBucket(this.bucket);
            equal(code, 200);
        });

        it('get bucket meta fail', async function() {
            let { code, error } = await this.MSS.getBucket('not exists');
            equal(code, 404);
            equal(error, 'Not Found');
        });
    });

    describe('putBucketACL()', function() {
        it('set bucket acl to public-read success', async function() {
            let { code } = await this.MSS.putBucketACL(this.bucket, 'public-read');
            equal(code, 200);
        });

        it('set bucket acl to public-read fail', async function() {
            let { code } = await this.MSS.putBucketACL('not exists', 'public-read');
            equal(code, 404);
        });
    });

    describe('getBucketACL()', function() {
        it('get bucket acl info success', async function() {
            let { code, data } = await this.MSS.getBucketACL(this.bucket);
            equal(code, 200);
            equal(Array.isArray(data.Grantee), true);
        });

        it('get bucket acl info fail', async function() {
            let { code } = await this.MSS.getBucketACL('not exists');
            equal(code, 404);
        });
    });

    describe('getBucketLifecycle()', function() {
        it('get bucket lifecycle success', async function() {
            await this.MSS.putBucketLifecycle(this.bucket, dataParam.bucketLifecycle);
            let { code, data } = await this.MSS.getBucketLifecycle(this.bucket);
            equal(code, 200);
            equal(Array.isArray(data.Rule), true);
        });
        it('get bucket lifecycle fail', async function() {
            let { code, error } = await this.MSS.getBucketLifecycle('not exist');
            equal(code, 404);
            equal(error.Code, 'NoSuchBucket');
        });
    });

    describe('putBucketLifecycle()', function() {
        it('put bucket lifecycle success', async function() {
            let { code, data } = await this.MSS.putBucketLifecycle(this.bucket, dataParam.bucketLifecycle);
            equal(code, 200);
            equal(JSON.stringify(data), '{}');
        });
        it('put bucket lifecycle fail', async function() {
            let { code, error } = await this.MSS.putBucketLifecycle('not exist', dataParam.bucketLifecycle);
            equal(code, 404);
            equal(error.Code, 'NoSuchBucket');
        });
    });

    describe('deleteBucketLifecycle()', function() {
        it('delete bucket lifecycle success', async function() {
            let { code, data } = await this.MSS.deleteBucketLifecycle(this.bucket);
            equal(code, 200);
            equal(JSON.stringify(data), '{}');
        });
        it('delete bucket lifecycle fail', async function() {
            let { code, error } = await this.MSS.deleteBucketLifecycle('not exist');
            equal(code, 404);
            equal(error.Code, 'NoSuchBucket');
        });
    });

    describe('getBucketPolicy()', function() {
        it('get bucket policy success', async function() {
            await this.MSS.putBucketPolicy(this.bucket, dataParam.bucketPolicy);
            let { code, data } = await this.MSS.getBucketPolicy(this.bucket);
            equal(code, 200);
            equal(Array.isArray(data.Statement), true);
        });
        it('get bucket policy fail', async function() {
            let { code, error } = await this.MSS.getBucketPolicy('not exist');
            equal(code, 404);
            equal(error.Code, 'NoSuchBucket');
        });
    });

    describe('putBucketPolicy()', function() {
        it('put bucket policy success', async function() {
            let { code, data } = await this.MSS.putBucketPolicy(this.bucket, dataParam.bucketPolicy);
            equal(code, 200);
            equal(JSON.stringify(data), '{}');
        });
        it('put bucket policy fail', async function() {
            let { code, error } = await this.MSS.putBucketPolicy('not exist', dataParam.bucketPolicy);
            equal(code, 404);
            equal(error.Code, 'NoSuchBucket');
        });
    });

    describe('getBucketCors()', function() {
        it('get no cors should throw NoSuchBucketCors', async function() {
            let { code, error } = await this.MSS.getBucketCors('not set cors');
            equal(code, 404);
            equal(error.Code, 'NoSuchBucket');
        });
        it('get cors success', async function() {
            let result = await this.MSS.putBucketCors(this.bucket, dataParam.bucketCors);
            equal(result.code, 200);
            let { code, data } = await this.MSS.getBucketCors(this.bucket);
            equal(code, 200);
            equal(Array.isArray(data.CORSRule), true);
            let result1 = await this.MSS.deleteBucketCors(this.bucket);
            equal(result1.code, 200);
        });
    });

    describe('putBucketCors()', function() {
        it('delete bucket cors fail', async function() {
            let { code } = await this.MSS.deleteBucketCors(this.bucket);
            equal(code, 404);
        });

        it('put bucket cors success', async function() {
            let { code } = await this.MSS.putBucketCors(this.bucket, dataParam.bucketCors);
            equal(code, 200);
        });
        it('put bucket cors fail', async function() {
            let { code, error } = await this.MSS.putBucketCors('not exist', dataParam.bucketCors);
            equal(code, 404);
            equal(error.Code, 'NoSuchBucket');
        });
    });

    describe('deleteBucketCors()', function() {
        it('delete bucket cors success', async function() {
            let { code } = await this.MSS.deleteBucketCors(this.bucket);
            equal(code, 200);
        });
    });
});