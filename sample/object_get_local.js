/**
 * 本地下载
 */
var MSS = require('../src');
var path = require('path');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret,
    bucket: 'test-bucket'
});

var result = client.getObject('test-buffer.json', path.join(__dirname, './data/test-download.json'), {
    query: {
        'response-content-type': 'json'
    }
});

result.then(function(data) {
    console.log(data);
});

/**
{
    "code": 200,
    "error": null,
    "data": null
}
 */