var MSS = require('../src');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret
});

var result = client.deleteBucketLifecycle('test-bucket');
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
        "Code": "NoSuchBucketLifecycle",
        "Message": "The specified bucket lifecycle does not exist. Entry not found",
        "Resource": "Bucket:test1,Object:",
        "RequestId": "1513049282785330",
        "HostId": "8c40795b0fa0af2edff38bf252988f18"
    },
    "data": { }
}
 */