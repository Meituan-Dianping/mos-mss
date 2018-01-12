var MSS = require('../src');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret
});

var result = client.getBucketLifecycle('test-bucket');
result.then(function(res) {
    console.log(JSON.stringify(res));
});

/**
{
    "code": 200,
    "error": null,
    "data": {
        "Rule": [
            {
                "ID": "STRING_VALUE",
                "Filter": {
                    "Prefix": null
                },
                "Expiration": {
                    "Days": "30"
                }
            },
            {
                "ID": "1",
                "Filter": {
                    "Prefix": null
                },
                "Expiration": {
                    "Days": "30"
                }
            },
            {
                "ID": "2",
                "Filter": {
                    "Prefix": null
                },
                "Expiration": {
                    "Days": "30"
                }
            },
            {
                "ID": "3",
                "Filter": {
                    "Prefix": null
                },
                "Expiration": {
                    "Days": "30"
                }
            },
            {
                "ID": "4",
                "Filter": {
                    "Prefix": null
                },
                "Expiration": {
                    "Days": "30"
                }
            }
        ]
    }
}

{
    "code": 404,
    "error": {
        "Code": "NoSuchBucketLifecycle",
        "Message": "The specified bucket lifecycle does not exist. Entry not found",
        "Resource": "Bucket:test1,Object:",
        "RequestId": "1513049550128170",
        "HostId": "a52aa5a165be3d91c966a8db4f7a9588"
    },
    "data": { }
}
 */