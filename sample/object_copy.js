/**
 * copy object
 */
var MSS = require('../src');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret,
    bucket: 'test-bucket'
});

var result = client.copyObject('/test-bucket/test.json', '/test-bucket/test99');

result.then(function(res) {
    console.log(res);
});

/**
{
    "code": 200,
    "error": null,
    "data": {
        "LastModified": "2017-12-12T05:57:08.000Z",
        "ETag": "\"d1988f52f2809b37b68ba8b4dfd577ef\""
    }
}

{
    "code": 404,
    "error": {
        "Code": "NoSuchBucket",
        "Message": "The specified bucket does not exist. Bucket [test-test-bucket] not exist",
        "Resource": "Bucket:test-test-bucket,Object:test99",
        "RequestId": "1513058120171020",
        "HostId": "0f68e481af38c0478f0eb393df3b135e"
    },
    "data": { }
}

//ObjectKey 不存在
{
    "code": 400,
    "error": {
        "Code": "InvalidArgument",
        "Message": "Invalid Argument. ",
        "Resource": "Bucket:test-bucket,Object:test99",
        "RequestId": "1513058159119196",
        "HostId": "87440f1e40a3710215c108574bdab8ce"
    },
    "data": { }
}
 */