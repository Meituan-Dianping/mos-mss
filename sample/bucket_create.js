var MSS = require('../src');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret
});

var result = client.createBucket('test-bucket');
result.then(function(res) {
    console.log(res);
});

/**
{
    "code": 200,
    "error": null,
    "data": {
        "x-mss-trace-id": "1175482797233555046"
    }
}

{
    "code": 409,
    "error": {
        "Code": "BucketAlreadyExists",
        "Message": "The requested bucket name is not available. db duplicate entry",
        "Resource": "Bucket:test-bucket,Object:",
        "RequestId": "1513048027288690",
        "HostId": "87440f1e40a3710215c108574bdab8ce"
    },
    "data": { }
}
 */