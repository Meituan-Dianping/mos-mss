var MSS = require('../src');
var path = require('path');
var fs = require('fs');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret,
    bucket: 'test-bucket'
});

var read = function() {
    return fs.readFileSync(path.join(__dirname, './data/checkpoint.txt'), 'utf-8');
};
var write = function(data) {
    return fs.writeFileSync(path.join(__dirname, './data/checkpoint.txt'), data);
};
var checkpoint = JSON.parse(read());

var object = client.multipartUpload('test-1.json', path.join(__dirname, './data/1.zip'), {
    checkpoint: checkpoint,
    progress: function(p, checkpoint) {
        write(JSON.stringify(checkpoint));
        console.log('Progress: ' + p, checkpoint);
    }
});

object.then(function(data) {
    console.log('result', data);
});