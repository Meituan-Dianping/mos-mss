var MSS = require('../src');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret,
    bucket: 'test-bucket'
});

var result = client.putObject('test-buffer.json', new Buffer('test'));
result.then(function(res) {
    console.log(JSON.stringify(res));
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