var MSS = require('../src');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret
});

var result = client.putBucketACL('test-bucket', 'public-read');
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
        "Code": "NoSuchBucket",
        "Message": "The specified bucket does not exist. Bucket [test2] not exist",
        "Resource": "Bucket:test2,Object:",
        "RequestId": "1513048195897628",
        "HostId": "41c9058565c68f2dd1345cf63e9744a2"
    },
    "data": { }
}
 */