var MSS = require('../src');

var { accessKeyId, accessKeySecret } = require('./config/server.js');

var client = new MSS({
    accessKeyId,
    accessKeySecret,
    signerVersion: 'v4'
});

var result = client.getBucketACL('test-bucket');
result.then(function(res) {
    console.log(JSON.stringify(res));
});

/**
{
    "code": 200,
    "error": null,
    "data": {
        "Owner": {
            "ID": "ed0UXlNh10WipH+ZngEwfw==",
            "DisplayName": "ed0UXlNh10WipH+ZngEwfw=="
        },
        "Grantee": [
            {
                "Grantee": {
                    "$": {
                        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                        "xsi:type": "CanonicalUser"
                    },
                    "ID": "ed0UXlNh10WipH+ZngEwfw==",
                    "DisplayName": "ed0UXlNh10WipH+ZngEwfw=="
                },
                "Permission": "FULL_CONTROL"
            },
            {
                "Grantee": {
                    "$": {
                        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                        "xsi:type": "Group"
                    },
                    "URI": "http://acs.amazonaws.com/groups/global/AllUsers"
                },
                "Permission": "READ"
            }
        ]
    }
}
 */