var MSS = require('../src');
var path = require('path');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

let client = new MSS({
    accessKeyId,
    accessKeySecret,
    bucket: 'test-bucket'
});

var result = client.putObject('test.json', path.join(__dirname, './data/test.json'));

result.then(function(res) {
    console.log(res);
});

/**
{
    "code": 200,
    "error": null,
    "data": {
        "ETag": "\"d1988f52f2809b37b68ba8b4dfd577ef\""
    }
}
 */