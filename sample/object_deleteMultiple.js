var MSS = require('../src'

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret,
    bucket: 'test-bucket'
});

var result = client.deleteMultiple(['test-big.json', 'test.json']);

result.then(function(res) {
    console.log(res);
});

/**
{
    "code": 200,
    "error": null,
    "data": null
}
 */