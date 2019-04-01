var MSS = require('../src');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret
});

var result = client.getBucketCors('test-bucket');
result.then(function(res) {
    console.log(JSON.stringify(res));
});

/**
{
    "code": 200,
    "error": null,
    "data": {
        "CORSRule": [
            {
                "AllowedOrigin": [
                    "http://www.example2.com",
                    "http://www.example1.com"
                ],
                "AllowedHeader": "*"
            }
        ]
    }
}

{
    "code": 404,
    "error": {
        "Code": "NoSuchBucketCors",
        "Message": "The specified bucket cors does not exist. Entry not found",
        "Resource": "Bucket:test-bucket,Object:",
        "RequestId": "1513048504894000",
        "HostId": "8c40795b0fa0af2edff38bf252988f18"
    },
    "data": { }
}
 */