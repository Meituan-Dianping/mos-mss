var MSS = require('../src');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret
});

var result = client.putBucketLifecycle('test-bucket', {
    lifecycleConfig: {
        Rule: [
            {
                Expiration: {
                    Days: 30
                },
                ID: 'STRING_VALUE',
                Filter: {
                    Prefix: ''
                }
            },
            {
                Expiration: {
                    Days: 30
                },
                ID: '1',
                Filter: {
                    Prefix: ''
                }
            },
            {
                Expiration: {
                    Days: 30
                },
                ID: '2',
                Filter: {
                    Prefix: ''
                }
            },
            {
                Expiration: {
                    Days: 30
                },
                ID: '3',
                Filter: {
                    Prefix: ''
                }
            },
            {
                Expiration: {
                    Days: 30
                },
                ID: '4',
                Filter: {
                    Prefix: ''
                }
            }
        ]
    }
});
result.then(function(res) {
    console.log(res);
});

/**
{
    "code": 200,
    "error": null,
    "data": { }
}

rule 大于5|| id 相同
{
    "code": 400,
    "error": {
        "Code": "MalformedXML",
        "Message": "The XML you provided was not well-formed or did not validate against our published schema. invalid arg",
        "Resource": "Bucket:test1,Object:",
        "RequestId": "1512625935059881",
        "HostId": "271d44d2d4d7c46c2eb9a33332e66ae4"
    },
    "data": { }
}

{
    "code": 404,
    "error": {
        "Code": "NoSuchBucket",
        "Message": "The specified bucket does not exist. Bucket [test-Bucket] not exist",
        "Resource": "Bucket:test-Bucket,Object:",
        "RequestId": "1513049645360444",
        "HostId": "efd53690054e962b78729d0cb3e8723f"
    },
    "data": { }
}
 */