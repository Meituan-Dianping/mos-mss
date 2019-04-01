var MSS = require('../src');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

let client = new MSS({
    accessKeyId,
    accessKeySecret
});

var result = client.listBucket();
result.then(function(res) {
    console.log(res);
}).catch(function(err) {
    console.log(err);
});

/**
{
    "code": 200,
    "data": {
        "Owner": {
            "ID": "ed0UXlNh10WipH+ZngEwfw==",
            "DisplayName": "ed0UXlNh10WipH+ZngEwfw=="
        },
        "Buckets": [
            {
                "Name": "myBucket",
                "CreationDate": "2017-11-06T04:20:52.000Z"
            },
            {
                "Name": "myBucket12",
                "CreationDate": "2017-11-08T05:28:30.000Z"
            },
            {
                "Name": "test1",
                "CreationDate": "2017-11-15T04:11:12.000Z"
            }
        ]
    }
}
 */