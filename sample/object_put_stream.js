var MSS = require('../src');
var fs = require('fs');
var path = require('path');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret,
    bucket: 'test-bucket',
    signerVersion: 'v4'
});
var filePath = path.join(__dirname, './data/test.json');

var stream = fs.createReadStream(filePath);

var result = client.putStream('test-stream.json', stream);
result.then(function(res) {
    console.log(res);
});

/**
{
    "code": 200,
    "error": null,
    "data": {
        "ETag": "\"f45aa1b107c723002a2b00b756d05f0a\""
    }
}
 */