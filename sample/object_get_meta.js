var MSS = require('../src');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret,
    bucket: 'test-bucket'
});

var result = client.getMeta('test.json');
result.then(function(res) {
    console.log(res);
});

/**
{
    "code": 200,
    "error": null,
    "data": {
        "ETag": "\"aaee20437490d3d8fbf1ff4716d901fc\"",
        "LastModified": "Fri, 24 Nov 2017 03:16:56 GMT",
        "ContentType": "application/octet-stream"
    }
}
 */