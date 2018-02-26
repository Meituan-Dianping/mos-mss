var MSS = require('../src');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret
});

var result = client.putBucketCors('test-bucket', {
    CORSConfiguration: {
        CORSRule: [
            {
                AllowedMethod: [
                    'GET'

                /* more items */
                ],
                AllowedOrigin: [
                    'http://www.example2.com',
                    'http://www.example1.com'

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