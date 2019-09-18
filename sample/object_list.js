var MSS = require('../src');

var { accessKeyId, accessKeySecret, endpoint } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret,
    endpoint,
    bucket: 'testccc'
});

var result = client.listObject({
    query: {
        prefix="",
        marker="",
        delimiter="/",
        max_keys=100
    }
});
result.then(function(res) {
    console.log(JSON.stringify(res));
});

/**
{
    "code": 200,
    "error": null,
    "data": {
        "Name": "myBucket",
        "Prefix": null,
        "Marker": null,
        "MaxKeys": "1000",
        "Delimiter": null,
        "IsTruncated": "false",
        "Contents": [
            {
                "Key": "Hello",
                "LastModified": "2017-11-06T04:20:52.000Z",
                "ETag": "\"42c2181aa4e9c5d6fa9d7a75f6536959\"",
                "Size": "5",
                "Owner": {
                    "ID": "0a10501f1509942052133971",
                    "DisplayName": "0a10501f1509942052133971"
                },
                "StorageClass": "3R"
            },
            {
                "Key": "asd",
                "LastModified": "2017-12-01T11:26:31.000Z",
                "ETag": "\"4470996414e1899e7186d140e8aa4d21\"",
                "Size": "3",
                "Owner": {
                    "ID": "0a10501f1509942052133971",
                    "DisplayName": "0a10501f1509942052133971"
                },
                "StorageClass": "3R"
            }
        ]
    }
}

{
    "code": 404,
    "error": {
        "Code": "NoSuchBucket",
        "Message": "The specified bucket does not exist. Bucket [myBuckets] not exist",
        "Resource": "Bucket:myBuckets,Object:",
        "RequestId": "1513165827025761",
        "HostId": "8c40795b0fa0af2edff38bf252988f18"
    },
    "data": { }
}
 */