var MSS = require('../src');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret,
    bucket: 'test-bucket'
});

var result = client.getParts('test.json', '0a1050231513059398631244');
result.then(function(res) {
    console.log(JSON.stringify(res));
});