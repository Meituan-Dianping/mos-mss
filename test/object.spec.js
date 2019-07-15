'use strict';
let fs = require('fs');
let path = require('path');
let assert = require('assert');
let MSS = require('../src');

let equal = assert.equal;
let config = require('./config');

describe('test object', function() {
    this.timeout(60000);
    before(async function() {
        this.MSS = new MSS(config);
        this.bucket = 'mos-mss-test-object-bucket';
        this.objects = [];
        let { code } = await this.MSS.createBucket(this.bucket);
        this.MSS.use(this.bucket);
        equal(code, 200);
    });

    after(async function() {
        let result = await this.MSS.deleteBucket(this.bucket);
        let { code } = result;
        equal(code, 200);
    });

    describe('putObject()', function() {
        it('put object by buffer', async function() {
            let key = 'test.txt';
            let result = await this.MSS.putObject(key, new Buffer('test'));
            equal(result.code, 200);

            this.objects.push(key);
        });
        it('put object by stream or path', async function() {
            let key = 'test-path';
            let o = {};
            for (let i = 0; i < 3000; i++) {
                o['test' + i] = new Date().getTime();
            }
            let filePath = path.join(__dirname, './data/test-stream.json');
            fs.writeFileSync(filePath, JSON.stringify(o));

            let stream = fs.createReadStream(filePath);
            let { code } = await this.MSS.putObject(key, stream);
            equal(code, 200);
            this.objects.push(key);
        });

        it('put object for Chinese key', async function() {
            let key = '测试key';
            let result = await this.MSS.putObject(key, new Buffer('test'));
            equal(result.code, 200);

            this.objects.push(key);
        });

        it('put multipart object', async function() {
            let key = 'test-multipart';

            let o = {};
            for (let i = 0; i < 350000; i++) {
                o['test' + i] = new Date().getTime();
            }
            let filePath = path.join(__dirname, './data/test-multipart.json');
            fs.writeFileSync(filePath, JSON.stringify(o));

            let { code, data } = await this.MSS.multipartUpload(key, filePath, {
                timeout: 60000,
                progress: async(p, checkpoint) => {
                    console.log('progress:', p);
                    let result = await this.MSS.getParts('test.json', checkpoint.uploadId);
                    equal(result.code, 200);

                    let result1 = await this.MSS.getParts('test.json', 'not exit uploadId');
                    equal(result1.code, 404);

                    let result2 = await this.MSS.closeMultipartUpload('test.json', 'not exit uploadId');
                    equal(result2.code, 404);
                }
            });

            equal(code, 200);
            equal(data.Bucket, this.bucket);

            this.objects.push('test-multipart');
        });

        it('test private function', async function() {
            let parts = this.MSS._divideParts(10000, 100);
            equal(parts.length, 100);

            let bufferSize = await this.MSS._getFileSize(new Buffer('test0'));
            equal(bufferSize, 5);
        });
    });

    describe('getObject()', function() {
        it('get object by buffer success', async function() {
            let { code } = await this.MSS.getBuffer('test.txt');
            equal(code, 200);
        });

        it('get object  for Chinese key', async function() {
            let { code } = await this.MSS.getBuffer('测试key');
            equal(code, 200);
        });

        it('get object by buffer fail', async function() {
            let { code, error } = await this.MSS.getBuffer('test-no-exit.txt');
            equal(code, 404);
            equal(error.Code, 'NotSuchURLSource');
        });

        it('get object by path', async function() {
            let { code } = await this.MSS.getObject('test.txt', path.join(__dirname, './data/test.txt'));
            equal(code, 200);
        });
    });

    describe('getStream()', function() {
        it('get object by stream success', async function() {
            let writeStream = fs.createWriteStream(path.join(__dirname, './data/test-download-stream.json'));

            let result = await this.MSS.getStream('test.json');
            result.stream.pipe(writeStream);
            result.stream.on('end', function() {
                equal(true, true);
            });
        });
    });

    describe('getMeta()', function() {
        it('getMeta should success', async function() {
            let { code } = await this.MSS.getMeta('test.txt');
            equal(code, 200);
        });

        it('getMeta should fail', async function() {
            let thisbucket = 'mos-mss-test-object-bucket-01';
            this.MSS.use(thisbucket);
            let { code } = await this.MSS.getMeta('test.txt');
            equal(code, 404);
            this.MSS.use(this.bucket);
        });
    });

    describe('listObject()', function() {
        it('return data Contents should be array', async function() {
            let { code, data } = await this.MSS.listObject();
            equal(code, 200);
            equal(Array.isArray(data.Contents), true);
        });

        it('list length is 0', async function() {
            let thisbucket = 'mos-mss-test-object-bucket-0';
            await this.MSS.createBucket(thisbucket);
            this.MSS.use(thisbucket);
            let { code, data } = await this.MSS.listObject();

            equal(code, 200);
            equal(Array.isArray(data.Contents), true);
            equal(data.Contents.length, 0);

            this.MSS.use(this.bucket);

            let result = await this.MSS.deleteBucket(thisbucket);
            equal(result.code, 200);
        });

        it('list length is 0', async function() {
            let thisbucket = 'mos-mss-test-object-bucket-01';
            this.MSS.use(thisbucket);
            let { code } = await this.MSS.listObject();
            equal(code, 404);
            this.MSS.use(this.bucket);
        });
    });

    describe('copyObject()', function() {
        it('copy should be successful', async function() {
            let { code } = await this.MSS.copyObject(`/${this.bucket}/test.txt`, `/${this.bucket}/test-copy.txt`);
            this.objects.push('test-copy.txt');
            equal(code, 200);
        });

        it('copy should be fail', async function() {
            let thisbucket = 'mos-mss-test-object-bucket-01';
            this.MSS.use(thisbucket);
            let { code } = await this.MSS.copyObject(`/${thisbucket}/test.txt`, `/${thisbucket}/test-copy.txt`);
            equal(code, 404);
            this.MSS.use(this.bucket);
        });
    });

    describe('deleteObject()', async function() {
        it('delete object list should be successful', async function() {
            let { code } = await this.MSS.deleteObject(this.objects.shift());
            equal(code, 200);
        });

        it('delete object list should be successful', async function() {
            let thisbucket = 'mos-mss-test-object-bucket-01';
            this.MSS.use(thisbucket);
            let { code } = await this.MSS.deleteObject(this.objects[0]);
            equal(code, 404);
            this.MSS.use(this.bucket);
        });
    });

    describe('deleteMultiple()', async function() {
        it('delete object list should be successful', async function() {
            let { code } = await this.MSS.deleteMultiple(this.objects);
            equal(code, 200);
        });
    });

    describe('signatureUrl()', async function() {
        it('use signatureUrl should be successful', async function() {
            let { code } = await this.MSS.signatureUrl('test.json');
            equal(code, 200);
        });

        it('use signatureUrl by query', async function() {
            let { code } = await this.MSS.signatureUrl('test.json', {
                query: {
                    'response-content-type': 'json'
                }
            });
            equal(code, 200);
        });
    });
});