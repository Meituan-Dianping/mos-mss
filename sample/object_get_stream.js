/**
 * 流式下载
 */
var MSS = require('../src');
var fs = require('fs');
var path = require('path');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret,
    bucket: 'test-bucket',
    secure: false
});

var writeStream = fs.createWriteStream(path.join(__dirname, './data/test-download-stream.json'));

var result = client.getStream('test-big.json');

result.then(function(data) {
    data.stream.pipe(writeStream);
    data.stream.on('end', function() {
        console.log('success');
    });
    data.stream.on('error', function(err) {
        console.log('fail', err);
    });
});
