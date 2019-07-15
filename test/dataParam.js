let dataParam = {
    bucketPolicy: {
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
    },
    bucketLifecycle: {
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
    },
    bucketCors: {
        CORSConfiguration: {
            CORSRule: [
                {
                    AllowedMethod: [
                        'GET'

                    /* more items */
                    ],
                    AllowedOrigin: [
                        'http://www.example1.com',
                        'http://www.example2.com'

                    /* more items */
                    ],
                    AllowedHeader: [
                        '*'

                    /* more items */
                    ],
                    MaxAgeSeconds: 0
                }

            /* more items */
            ]
        }
    }
};
module.exports = dataParam;