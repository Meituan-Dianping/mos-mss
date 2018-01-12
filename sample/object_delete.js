var MSS = require('../src');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret,
    bucket: 'test-bucket'
});

var result = client.deleteObject('test.json');

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
    "error": {
        "Code": "NoSuchKey",
        "Message": "The specified key does not exist. Object [test.json] not exist",
        "Resource": "Bucket:test-bucket,Object:test.json",
        "RequestId": "1513057960712742",
        "HostId": "1eaeb35338a6e58c1e327000fe00098d"
    },
    "data": { }
}
 */