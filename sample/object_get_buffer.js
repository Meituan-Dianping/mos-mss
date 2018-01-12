/**
 * 下载到 buffer
 */
var MSS = require('../src');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret,
    bucket: 'test-bucket'
});

var result = client.getBuffer('test-buffer.json');

result.then(function(res) {
    console.log(res);
}).catch(function(err) {
    console.log(err);
});

/**
{
    "code": 200,
    "error": null,
    "data": {
        "content": "test"
    }
}
 */