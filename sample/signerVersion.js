var MSS = require('../src');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

let client = new MSS({
    accessKeyId,
    accessKeySecret,
    signerVersion: 'v4'
});

var result = client.listBucket();
result.then(function(res) {
    console.log(JSON.stringify(res));
});

/**
{
    "code": 200,
    "error": null,
    "data": { }
}
 */