var MSS = require('../src');
var path = require('path');
var fs = require('fs');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret,
    bucket: 'test-bucket',
    signerVersion: 'v4',
    secure: true
});

var write = function(data) {
    return fs.writeFileSync(path.join(__dirname, './data/checkpoint.txt'), data);
};

var result = client.multipartUpload('test-big.json', path.join(__dirname, './data/test-big.json'), {
    progress: function(p, checkpoint) {
        console.log(JSON.stringify(checkpoint));
        write(JSON.stringify(checkpoint));
        console.log('Progress: ' + p);
    }
});

result.then(function(res) {
    console.log('result', JSON.stringify(res));
});

/**
{
    "code": 200,
    "error": null,
    "data": {
        "Location": "http://test-bucket-ed0UXlNh10WipH+ZngEwfw==.msstest-corp.sankuai.com/test-big.json",
        "Bucket": "test-bucket",
        "Key": "test-big.json",
        "ETag": "\"cbfa45d303bc7ef238817055542be4fe-2\""
    }
}

{
    "code": 400,
    "error": {
        "Code": "InvalidPartOrder",
        "Message": "The list of parts was not in ascending order. The parts list must be specified in order by part number. ",
        "Resource": "Bucket:test-bucket,Object:test-big.json",
        "RequestId": "1513059146257686",
        "HostId": "87440f1e40a3710215c108574bdab8ce"
    },
    "data": { }
}
 */