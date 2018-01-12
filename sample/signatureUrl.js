var MSS = require('../src');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret,
    bucket: 'test-bucket'
});

var result = client.signatureUrl('test-buffer.json', {
    protocol: 'https'
});

result.then(function(res) {
    console.log(res);
});

/**
{
    "code": 200,
    "data": "http://msstest-corp.sankuai.com/test-bucket/test.json?AWSAccessKeyId=c428038fcfa54c91b2e07b04535136f8&Expires=1513060431&Signature=0g0inYZLPgrsO4sveDC13rH3WlQ%3D"
}
 */