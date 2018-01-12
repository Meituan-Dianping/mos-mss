var MSS = require('../src');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret
});

var result = client.getBucket('test-bucket');
result.then(function(res) {
    console.log(res);
});

/**
{
    "code": 200,
    "error": null,
    "data": { }
}

{
    "code": 404,
    "error": "Not Found",
    "data": { }
}

{
    "code": 403,
    "error": "Forbidden",
    "data": { }
}
 */