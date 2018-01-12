var MSS = require('../src');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret
});

var result = client.putBucketPolicy('test-bucket', {
    policy: {
        'Version': '2012-10-17',
        'Statement': [
            // refer 不相关部分
            {
                'Sid': '',
                'Effect': 'Allow',
                'Principal': {'AWS': '*'},
                'Action': ['s3:PutObject', 's3:PutObjectAcl'],
                'Resource': ['arn:aws:s3:::examplebucket/*']
            },
            // refer 相关部分
            {
                'Sid': '',
                'Effect': 'Allow',
                'Principal': {'AWS': '*'},
                'Action': ['s3:GetObject'],
                'Resource': ['arn:aws:s3:::examplebucket/*'],
                'Condition': {
                    'StringLike': {'aws:Referer': ['http://www.example.com/*', 'http://example.com/*', '']}
                }
            },
            {
                'Sid': 'Allow get requests without referrer',
                'Effect': 'Deny',
                'Principal': {'AWS': '*'},
                'Action': ['s3:GetObject'],
                'Resource': ['arn:aws:s3:::examplebucket/*'],
                'Condition': {
                    'StringNotLike': {'aws:Referer': ['http://www.example.com/*', 'http://example.com/*', '']}
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
 */