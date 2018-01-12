var MSS = require('../src');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret
});

var result = client.getBucketPolicy('test-bucket', {
    headers: {
        'Accept': 'application/json'
    }
});
result.then(function(res) {
    console.log(res);
}).catch(function(err) {
    console.log(err);
});

/**
{
    "code": 200,
    "error": null,
    "data": {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "",
                "Effect": "Allow",
                "Principal": {
                    "AWS": "*"
                },
                "Action": [
                    "s3:PutObject",
                    "s3:PutObjectAcl"
                ],
                "ResourceList": null,
                "Condition": null
            },
            {
                "Sid": "",
                "Effect": "Allow",
                "Principal": {
                    "AWS": "*"
                },
                "Action": [
                    "s3:GetObject"
                ],
                "ResourceList": null,
                "Condition": {
                    "StringLike": {
                        "aws:Referer": [
                            "http://www.example.com/*",
                            "http://example.com/*",
                            ""
                        ]
                    }
                }
            },
            {
                "Sid": "Allow get requests without referrer",
                "Effect": "Deny",
                "Principal": {
                    "AWS": "*"
                },
                "Action": [
                    "s3:GetObject"
                ],
                "ResourceList": null,
                "Condition": {
                    "StringNotLike": {
                        "aws:Referer": [
                            "http://www.example.com/*",
                            "http://example.com/*",
                            ""
                        ]
                    }
                }
            }
        ]
    }
}

{
    "code": 404,
    "error": {
        "Code": "NoSuchBucketPolicy",
        "Message": "The specified bucket policy does not exist. Entry not found",
        "Resource": "Bucket:test-bucket,Object:",
        "RequestId": "1513049967681737",
        "HostId": "a52aa5a165be3d91c966a8db4f7a9588"
    },
    "data": { }
}
 */