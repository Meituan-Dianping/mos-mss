var MSS = require('../src');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

let client = new MSS({
    accessKeyId,
    accessKeySecret
});

var result = client.deleteBucket('mos-mss-test-bucket');
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
    "code": 409,
    "error": {
        "Code": "BucketNotEmpty",
        "Message": "The bucket you tried to delete is not empty. Bucket not empty",
        "Resource": "Bucket:myBucket12311,Object:",
        "RequestId": "1512111827618646",
        "HostId": "271d44d2d4d7c46c2eb9a33332e66ae4"
    },
    "data": { }
}

{
    "code": 404,
    "error": {
        "Code": "NoSuchBucket",
        "Message": "The specified bucket does not exist. Bucket [mos-mss-test-bucket] not exist",
        "Resource": "Bucket:mos-mss-test-bucket,Object:",
        "RequestId": "1513048279948630",
        "HostId": "efd53690054e962b78729d0cb3e8723f"
    },
    "data": { }
}
 */