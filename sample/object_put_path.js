var MSS = require('../src');
var path = require('path');

var { accessKeyId, accessKeySecret, endpoint } = require('./config/server.js');

let client = new MSS({
    accessKeyId,
    accessKeySecret,
    endpoint,
    bucket: 'testccc'
});

for(let i = 0; i < 1005; i++) {
    var result = client.putObject(i + 'test.json', path.join(__dirname, './data/test.json'));
    result.then(function(res) {
        console.log(res);
    });
}

/**
{
    "code": 200,
    "error": null,
    "data": {
        "ETag": "\"d1988f52f2809b37b68ba8b4dfd577ef\""
    }
}
 */