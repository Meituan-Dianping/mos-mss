mss-nodejs-sdk
======


mtyun MSS(Meituan Storage Service) sdk for Node.js

## install

```js
npm install mos-mss --save
```

# Overview

Constructs a service interface object. Each API operation is exposed as a function on service.

# MSS Usage

MSS, Object Storage Service. Equal to well known Amazon [S3](http://aws.amazon.com/s3/).

## Constructor Details

Constructs a service object. This object has one method for each API operation.

examples:

```js
var MSS = require('mos-mss');

var client = new MSS({
    accessKeyId: '<accessKeyId>', /* required */
    accessKeySecret: '<accessKeySecret>', /* required */
    endpoint: '<endpoint>', /* required */
    bucket: '<bucket name>'
})

```

options:

- endpoint (String) — The endpoint URI to send requests to. The endpoint should be a string like '{service}.{region}.amazonaws.com'.
- accessKeyId (String) — your MSS access key ID.
- accessKeySecret (String) — your MSS secret access key.
- bucket (String) your Bucket name.
- secure (Boolean) http(false) or https(true). The default is false.
- signerVersion (String) singer version v2 or v4. The default is v2.

## Method Summary


- [Bucket Operations](#bucket-operations)
    - [listBucket()](#listbucket)
    - [createBucket(name[, options])](#createbucketname-options)
    - [deleteBucket(name[, options])](#deletebucketname-options)
    - [getBucketACL(name[, options])](#getbucketaclname-options)
    - [putBucketACL(name, ACL[, options])](#putbucketaclname-acl-options)
    - [getBucket(name[, options])](#getbucketname-options)
    - [getBucketLifecycle(name[, options])](#getbucketlifecyclename-options)
    - [putBucketLifecycle(name[, options])](#putbucketlifecyclename-options)
    - [deleteBucketLifecycle(name,[ options])](#deletebucketlifecyclename-options)
    - [getBucketPolicy(name[, options])](#getbucketpolicyname-options)
    - [putBucketPolicy(name[, options])](#putbucketpolicyname-options)
    - [getBucketCors(name[, options])](#getbucketcorsname-options)
    - [putBucketCors(name[, options])](#putbucketcorsname-options)
    - [deleteBucketCors(name[, options])](#deletebucketcorsname-options)

- [Object Operations](#object-operations)
    - [putObject(key, file[, options])](#putobjectkey-file-options)
    - [putStream(key, file[, options])](#putstreamkey-file-options)
    - [multipartUpload(key, file[, options])](#multipartuploadkey-file-options)
    - [closeMultipartUpload(key, uploadId)](#closemultipartuploadkey-uploadid)
    - [getParts(key, uploadId)](#getpartskey-uploadid)
    - [getObject(key, path[, options])](#getobjectkey-path-options)
    - [getBuffer(key[, options])](#getbufferkey-options)
    - [getStream(key[, options])](#getstreamkey-options)
    - [listObject([options])](#listobjectoptions)
    - [copyObject(from, to[, options])](#copyobjectfrom-to-options)
    - [getMeta(key[, options])](#getmetakey-options)
    - [deleteObject(key[, options])](#deleteobjectkey-options)
    - [deleteMultiple(keys[, options])](#deletemultiplekeys-options)
 
## Bucket Operations
 
### listBucket()

Returns a list of all buckets owned by the authenticated sender of the request.

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>'
});
  
var result = client.listBucket();
result.then(function (res) {
    console.log(res);
});

```

Parameters:

- query (Object) (defaults to: {})

Return:

- res (Object)
    - code (Number) — the code number returned from the request. The request is successful when the number is 200.
    - data (Object) — the de-serialized data returned from the request. The default is ```{}```.
Set to ```{}``` if a request error occurs. The data object has the following properties:
        - Buckets (Array)
            - Name — (String) The name of the bucket.
            - CreationDate — (Date) Date the bucket was created.
        - Owner (Object)
            - DisplayName — (String)
            - ID — (String)
    - error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.

### createBucket(name[, options])

Creates a new bucket.

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>'
});
  
var result = client.createBucket('Bucket Name');
result.then(function (res) {
    console.log(res);
});

```
Parameters:

- name (String) Bucket name

Return:

- res (Object)
    - code (Number) — the code number returned from the request. The request is successful when the number is 200.
    - data (Object) — the de-serialized data returned from the request. The default is ```{}```. Set to ```{}``` if a request error occurs. The data object has the following properties:
        - x-mss-trace-id (String)
    - error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.

### deleteBucket(name[, options])

Deletes the bucket. All objects (including all object versions and Delete Markers) in the bucket must be deleted before the bucket itself can be deleted.

Examples:

```js
var MSS = require('mos-mss');
 
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>'
});
 
var result = client.deleteBucket('Bucket Name');
result.then(function (res) {
    console.log(res);
});
```

Parameters:

- name (String) Bucket name

Return:

- res (Object)
	- code (Number) — the code number returned from the request. The request is successful when the number is 200.
	- data (Object) — the de-serialized data returned from the request. The default is ```{}```. 
	- error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.

### getBucketACL(name[, options])

Gets the access control policy for the bucket.

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>'
});
 
var result = client.getBucketACL('Bucket Name');
result.then(function (res) {
    console.log(res);
});

```

Parameters:

- name (String) Bucket name

Return:

- res (Object)
    - code (Number) — the code number returned from the request. The request is successful when the number is 200.
    - data (Object) — the de-serialized data returned from the request. The default is ```{}```. Set to ```{}``` if a request error occurs. The data object has the following properties:
        - Owner (Object)
        - DisplayName — (String) Screen name of the grantee.
			- ID — (String) The canonical user ID of the grantee.
		- Grants — (Array) A list of grants.
			- Grantee
				- DisplayName — (String) Screen name of the grantee.
				- EmailAddress — (String) Email address of the grantee.
				- ID — (String) The canonical user ID of the grantee.
				- URI — (String) URI of the grantee group.
			- Permission — (String) Specifies the permission given to the grantee. Possible values include:
				- "FULL_CONTROL"
				- "WRITE"
				- "WRITE_ACP"
				- "READ"
				- "READ_ACP"
	- error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.

### putBucketACL(name, ACl[, options])

Sets the permissions on a bucket using access control lists (ACL).

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>'
});
 
var result = client.putBucketACL('Bucket Name', 'ACL');
result.then(function (res) {
    console.log(res);
});

```

Parameters:

- name (String) Bucket name.
- ACL — (String) The canned ACL to apply to the bucket. Possible values include:
    - private
    - public-read

Return:

- res (Object)
	- code (Number) — the code number returned from the request. The request is successful when the number is 200.
	- data (Object) — the de-serialized data returned from the request. The default is ```{}```.
	- error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.

### getBucket(name[, options])

This operation is useful to determine if a bucket exists and you have permission to access it.mos

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>'
});
  
var result = client.getBucket('Bucket Name');
result.then(function (res) {
    console.log(res);
    //res.code === 200 exists
});

```

Parameters:

- name (String) Bucket name.

Return:

- res (Object)
    - code (Number) — the code number returned from the request. The request is successful when the number is 200.
    - data (Object) — the de-serialized data returned from the request. The default is ```{}```. Set to ```{}``` if a request error occurs.
    - error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.

### getBucketLifecycle(name[, options])

Get the bucket object lifecycle.

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>'
});
  
var result = client.getBucketLifecycle('Bucket');
result.then(function (res) {
    console.log(res);
});

```

Parameters:

- name (String) Bucket name.

Return:

- res (Object)
    - code (Number) — the code number returned from the request. The request is successful when the number is 200.
    - data (Object) — the de-serialized data returned from the request. Set to null if a request error occurs. The data object has the following properties:
        - Rule — (Array<map>)
            - Expiration — (map)
                - Date — (Date) Indicates at what date the object is to be moved or deleted. Should be in GMT ISO 8601 Format.
                - Days — (Integer) Indicates the lifetime, in days, of the objects that are subject to the rule. The value must be a non-zero positive integer.
                - ExpiredObjectDeleteMarker — (Boolean) Indicates whether mos S3 will remove a delete marker with no noncurrent versions. If set to true, the delete marker will be expired; if set to false the policy takes no action. This cannot be specified with Days or Date in a Lifecycle Expiration Policy.
            - ID — (String) Unique identifier for the rule. The value cannot be longer than 255 characters.
            - Prefix — required — (String) Prefix identifying one or more objects to which the rule applies.
            - Status — required — (String) If 'Enabled', the rule is currently being applied. If 'Disabled', the rule is not currently being applied. Possible values include:
                - "Enabled"
                - "Disabled"
            - Transition — (map)
                - Date — (Date) Indicates at what date the object is to be moved or deleted. Should be in GMT ISO 8601 Format.
                - Days — (Integer) Indicates the lifetime, in days, of the objects that are subject to the rule. The value must be a non-zero positive integer.
                - StorageClass — (String) The class of storage used to store the object. Possible values include:
                    - "GLACIER"
                    - "STANDARD_IA"
            - NoncurrentVersionTransition — (map) Container for the transition rule that describes when noncurrent objects transition to the STANDARD_IA or GLACIER storage class. If your bucket is versioning-enabled (or versioning is suspended), you can set this action to request that mos S3 transition noncurrent object versions to the STANDARD_IA or GLACIER storage class at a specific period in the object's lifetime.
                - NoncurrentDays — (Integer) Specifies the number of days an object is noncurrent before mos S3 can perform the associated action. For information about the noncurrent days calculations, see How mos S3 Calculates When an Object Became Noncurrent in the mos Simple Storage Service Developer Guide.
                - StorageClass — (String) The class of storage used to store the object. Possible values include:
                    - "GLACIER"
                    - "STANDARD_IA"
                - NoncurrentVersionExpiration — (map) Specifies when noncurrent object versions expire. Upon expiration, mos S3 permanently deletes the noncurrent object versions. You set this lifecycle configuration action on a bucket that has versioning enabled (or suspended) to request that mos S3 delete noncurrent object versions at a specific period in the object's lifetime.
                - NoncurrentDays — (Integer) Specifies the number of days an object is noncurrent before mos S3 can perform the associated action. For information about the noncurrent days calculations, see How mos S3 Calculates When an Object Became Noncurrent in the mos Simple Storage Service Developer Guide.
                - AbortIncompleteMultipartUpload — (map) Specifies the days since the initiation of an Incomplete Multipart Upload that Lifecycle will wait before permanently removing all parts of the upload.
                - DaysAfterInitiation — (Integer) Indicates the number of days that must pass since initiation for Lifecycle to abort an Incomplete Multipart Upload.
    - error (Object) — the error object returned from the request. Set to ``null`` if the request is successful.

### putBucketLifecycle(name[, options])

Set the bucket object lifecycle.

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>'
});
  
var result = client.putBucketLifecycle('Bucket', {
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
            }
        ]
    }
});

result.then(function (res) {
    console.log(res);
});

```

Parameters:

- name (String) Bucket name.
- options (Object)
    - lifecycleConfiguration — (map)
        - Rule — required — (Array<map>)
            - Expiration — (map)
                - Date — (Date) Indicates at what date the object is to be moved or deleted.Should be in GMT ISO 8601 Format.
                - Days — (Integer) Indicates the lifetime, in days, of the objects that are subject to the rule. The value must be a non-zero positive integer.
                - ExpiredObjectDeleteMarker — (Boolean) Indicates whether mos S3 will remove a delete marker with no noncurrent versions. If set to true, the delete marker will be expired; if set to false the policy takes no action. This cannot be specified with Days or Date in a Lifecycle Expiration Policy.
            - ID — (String) Unique identifier for the rule. The value cannot be longer than 255 characters.
            - Prefix — required — (String) Prefix identifying one or more objects to which the rule applies.
            - Status — required — (String) If 'Enabled', the rule is currently being applied. If 'Disabled', the rule is not currently being applied. Possible values include:
                - "Enabled"
                - "Disabled"
            - Transition — (map)
                - Date — (Date) Indicates at what date the object is to be moved or deleted. Should be in GMT ISO 8601 Format.
                - Days — (Integer) Indicates the lifetime, in days, of the objects that are subject to the rule. The value must be a non-zero positive integer.
                - StorageClass — (String) The class of storage used to store the object. Possible values include:
                    - "GLACIER"
                    - "STANDARD_IA"
            - NoncurrentVersionTransition — (map) Container for the transition rule that describes when noncurrent objects transition to the STANDARD_IA or GLACIER storage class. If your bucket is versioning-enabled (or versioning is suspended), you can set this action to request that mos S3 transition noncurrent object versions to the STANDARD_IA or GLACIER storage class at a specific period in the object's lifetime.
            - NoncurrentDays — (Integer) Specifies the number of days an object is noncurrent before mos S3 can perform the associated action. For information about the noncurrent days calculations, see How mos S3 Calculates When an Object Became Noncurrent in the mos Simple Storage Service Developer Guide.
            - StorageClass — (String) The class of storage used to store the object. Possible values include:
                - "GLACIER"
                - "STANDARD_IA"
            - NoncurrentVersionExpiration — (map) Specifies when noncurrent object versions expire. Upon expiration, mos S3 permanently deletes the noncurrent object versions. You set this lifecycle configuration action on a bucket that has versioning enabled (or suspended) to request that mos S3 delete noncurrent object versions at a specific period in the object's lifetime.
            - NoncurrentDays — (Integer) Specifies the number of days an object is noncurrent before mos S3 can perform the associated action. For information about the noncurrent days calculations, see How mos S3 Calculates When an Object Became Noncurrent in the mos Simple Storage Service Developer Guide.
            - AbortIncompleteMultipartUpload — (map) Specifies the days since the initiation of an Incomplete Multipart Upload that Lifecycle will wait before permanently removing all parts of the upload.
            - DaysAfterInitiation — (Integer) Indicates the number of days that must pass since initiation for Lifecycle to abort an Incomplete Multipart Upload.

Return:

- res (Object)
	- code (Number) — the code number returned from the request. The request is successful when the number is 200.
	- data (Object) — the de-serialized data returned from the request. The default is ```{}```.
	- error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.

### deleteBucketLifecycle(name[, options])

Deletes the lifecycle configuration from the bucket.

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>'
});
  
var result = client.deleteBucketLifecycle('Bucket');
result.then(function (res) {
    console.log(res);
});

```

Parameters:

- name (String) Bucket name

Return:

- res (Object)
	- code (Number) — the code number returned from the request. The request is successful when the number is 200.
	- data (Object) — the de-serialized data returned from the request. The default is ```{}```. 
	- error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.

### getBucketPolicy(name[, options])

Returns the policy of a specified bucket.

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>'
})

var result = client.getBucketPolicy('test-bucket');
result.then(function (res) {
    console.log(res);
});

```

Parameters:

- name (String) Bucket name.

Return:

- res (Object)
	- code (Number) — the code number returned from the request. The request is successful when the number is 200.
	- data (Object) — the de-serialized data returned from the request. Set to null if a request error occurs. The data object has the following properties:
		- Policy — (String) The bucket policy as a JSON document.
	- error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.


### putBucketPolicy(name[, options])

Replaces a policy on a bucket. If the bucket already has a policy, the one in this request completely replaces it.

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>'
})

var result = client.putBucketPolicy('test-bucket', {
    policy: {
        "Version":"2012-10-17",
        "Statement":[
            // refer 不相关部分
            {
                "Sid":"",
                "Effect":"Allow",
                "Principal": {"AWS": "*"},
                "Action":["s3:PutObject", "s3:PutObjectAcl"],
                "Resource":["arn:aws:s3:::examplebucket/*"]
            },
            // refer 相关部分
            {
                "Sid":"",
                "Effect":"Allow",
                "Principal":{"AWS": "*"},
                "Action":["s3:GetObject"],
                "Resource":["arn:aws:s3:::examplebucket/*"],
                "Condition":{
                    "StringLike":{"aws:Referer":["http://www.example.com/*", "http://example.com/*", ""]}
                }
            },
            {
                "Sid":"Allow get requests without referrer",
                "Effect":"Deny",
                "Principal":{"AWS": "*"},
                "Action":["s3:GetObject"],
                "Resource":["arn:aws:s3:::examplebucket/*"],
                "Condition":{
                            "StringNotLike":{"aws:Referer":["http://www.example.com/*", "http://example.com/*", ""]}
                }
            }
        ]
    }
});
result.then(function (res) {
    console.log(res);
});

```

Parameters:

- name (String) Bucket name.

- options (Object)
    - policy — (Object) The bucket policy as a JSON document.

Return:

- res (Object)
	- code (Number) — the code number returned from the request. The request is successful when the number is 200.
	- data (Object) — the de-serialized data returned from the request. The default is ```{}```.
	- error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.

### getBucketCors(name[, options])
Returns the cors configuration for the bucket.

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>'
});
  
var result = client.getBucketCors('Bucket');
result.then(function (res) {
    console.log(res);
});
```

Parameters:

- name (String) Bucket name.

Return:

- res (Object)
	- code (Number) — the code number returned from the request. The request is successful when the number is 200.
	- data (Object) — the de-serialized data returned from the request. Set to null if a request error occurs. The data object has the following properties:
		- CORSRule — (Array<map>)
			- AllowedHeaders — (Array<String>) Specifies which headers are allowed in a pre-flight OPTIONS request.
			- AllowedOrigins — required — (Array<String>) One or more origins you want customers to be able to access the bucket from.
	- error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.

### putBucketCors(name[, options])
Sets the cors configuration for a bucket.

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>'
});
  
var result = client.putBucketCors('Bucket', {
    CORSConfiguration: {
        CORSRule: [
            {
                AllowedMethod: [
                    'GET',
                /* more items */
                ],
                AllowedOrigin: [
                    'http://www.example1.com',
                    'http://www.example2.com',
                /* more items */
                ],
                AllowedHeader: [
                    '*',
                /* more items */
                ],
                MaxAgeSeconds: 0
            },
        /* more items */
        ]
    }
});
result.then(function (res) {
    console.log(res);
});

```

Parameters:

- name (String) Bucket name.
- options (Object)
    - CorsConfiguration — (map)
        - CORSRule — required — (Array<map>)
            - AllowedHeader — (Array<String>) Specifies which headers are allowed in a pre-flight OPTIONS request.
            - AllowedMethod — required — (Array<String>) Identifies HTTP methods that the domain/origin specified in the rule is allowed to execute.
            - AllowedOrigin — required — (Array<String>) One or more origins you want customers to be able to access the bucket from.
            - MaxAgeSeconds — (Integer) The time in seconds that your browser is to cache the preflight response for the specified resource.

Return:

- res (Object)
    - code (Number) — the code number returned from the request. The request is successful when the number is 200.
    - data (Object) - the de-serialized data returned from the request. The default is ```{}```.
    - error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.

### deleteBucketCors(name[, options])
Deletes the cors configuration information set for the bucket.

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>'
});
  
var result = client.deleteBucketCors('Bucket');
result.then(function (res) {
    console.log(res);
});

```

Parameters:

- name (String) Bucket name.

Return:

- res (Object)
	- code (Number) — the code number returned from the request. The request is successful when the number is 200.
	- data (Object) - the de-serialized data returned from the request. The default is ```{}```.
	- error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.


## Object Operations

### putObject(key, file[, options])

Adds an object to a bucket.

Examples:

```js
// file: String
var MSS = require('mos-mss');
var path = require('path');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>',
    bucket: 'Bucket'
});
  
var filePath = path.join(__dirname, './test.json');
var result = client.putObject('ObjectKey', filePath);
 
result.then(function (res) {
    console.log(res);
});

// file: Buffer
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>',
    bucket: 'Bucket'
});
  
var result = client.putObject('ObjectKey', new Buffer('test'));
result.then(function (res) {
    console.log(res);
});

```

Parameters:

- key (String) — object name.
- file (String|Buffer|ReadStream) object local path, content buffer or ReadStream content.
- options (Object)
    - headers (Object) extra headers.

Return:

- res (Object)
    - code (Number) — the code number returned from the request. The request is successful when the number is 200.
    - data (Object) — the de-serialized data returned from the request. The default is ```{}```.
Set to ```{}``` if a request error occurs. The data object has the following properties:
        - ETag — (String) An ETag is an opaque identifier assigned by a web server to a specific version of a resource found at a URL.
    - error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.

### putStream(key, file[, options])

Adds an object to a bucket.

Examples:

```js
var MSS = require('mos-mss');
var path = require('path');
var fs = require('fs');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>',
    bucket: 'Bucket'
});
 
 
var filePath = path.join(__dirname, './test.json');
var stream = fs.createReadStream(filePath);
 
var result = client.putStream('ObjectKey', stream);
result.then(function (res) {
    console.log(res);
});

```

Parameters:

- key (String) — object name.
- file (ReadStream) ReadStream content.
- options (Object)
    - headers (Object) extra headers.

Return:

- res (Object)
    - code (Number) — the code number returned from the request. The request is successful when the number is 200.
    - data (Object) — the de-serialized data returned from the request. The default is ```{}```.
Set to ```{}``` if a request error occurs. The data object has the following properties:
        - ETag — (String) An ETag is an opaque identifier assigned by a web server to a specific version of a resource found at a URL.
    - error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.

### multipartUpload(key, file[, options])

Upload file with MSS multipart.

Examples:

```js
// Piecewise upload
var MSS = require('mos-mss');
var path = require('path');
var fs = require('fs');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>',
    bucket: 'Bucket'
});
 
var write = function (data) {
    return fs.writeFileSync(path.join(__dirname, './data/checkpoint.txt'), data);
};
 
var result = client.multipartUpload('ObjectKey', path.join(__dirname, './img/test-big.json'), {
    progress: function (p, checkpoint) {
        write(JSON.stringify(checkpoint));
        console.log('Progress: ' + p);
    }
});
 
result.then(function (res) {
    console.log(res);
});

// Breakpoint upload
var MSS = require('mos-mss');
var path = require('path');
var fs = require('fs');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>',
    bucket: 'Bucket'
});
 
var read = function () {
    return fs.readFileSync(path.join(__dirname, './data/checkpoint.txt'), 'utf-8');
};
var checkpoint = JSON.parse(read());
 
var object = client.multipartUpload('Bucket', path.join(__dirname, './data/test-big.json'), {
    checkpoint: checkpoint,
    progress: function (p, checkpoint) {
        console.log('Progress: ' + p, checkpoint);
    }
});
 
object.then(function (data) {
    console.log(data);
});

```

Parameters:

- key (String) — object name.
- file (String) object local path
- options (Object)
    - partSize (Number) — the suggested size for each part.
    - checkpoint (Object) — the checkpoint to resume upload.
    - headers (Object) extra headers.

Return:

- res (Object)
    - code (Number) — the code number returned from the request. The request is successful when the number is 200.
    - data (Object) — the de-serialized data returned from the request. The default is ```{}```.
Set to ```{}``` if a request error occurs. The data object has the following properties:
        - ETag (String) — An ETag is an opaque identifier assigned by a web server to a specific version of a resource found at a URL.
        - Location (String)
        - Bucket (String)
        - Key (String)
    - error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.

### closeMultipartUpload(key, uploadId)

Abort a multipart upload for object.

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>',
    bucket: 'Bucket'
});
 
var result = client.closeMultipartUpload('Bucket', 'UploadId');
 
result.then(function (res) {
    console.log(res);
});

```

Parameters:

- key (String) — object name.
- uploadId (String) the upload id

Return:

- res (Object)
    - code (Number) — the code number returned from the request. The request is successful when the number is 200.
    - data (Object) — the de-serialized data returned from the request. The default is ```{}```.
Set to ```{}``` if a request error occurs.
    - error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.

### getParts(key, uploadId)

a list of parts that has been uploaded.

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>',
    bucket: 'Bucket'
});
 
var result = client.getParts('Bucket', 'UploadId');
 
result.then(function (res) {
    console.log(res);
});

```

Parameters:

- key (String) — object name.
- uploadId (String) the upload id

Return:

- res (Object)
    - code (Number) — the code number returned from the request. The request is successful when the number is 200.
    - data (Object) — the de-serialized data returned from the request. The default is ```{}```.
Set to ```{}``` if a request error occurs.
    - error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.

### getObject(key, path[, options])
Retrieves objects from mos S3.

Examples:

```js
var MSS = require('mos-mss');
var path = require('path');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>',
    bucket: 'Bucket'
});
 
var result = client.getObject('test.json', path.join(__dirname, './data/test.json'));
 
result.then(function (data) {
    console.log(data);
});
```

Parameters:

- key (String) — object name.
- path (String) - object local path.
- options (Object)
    - headers (Object) extra headers.
    - query (Object)
        - response-content-type (String) - Sets the Content-Type header of the response.
        - response-content-language (String) - Sets the Content-Language header of the response.
        - response-expires (String) - Sets the Expires header of the response.
        - response-cache-control (String) - Sets the Cache-Control header of the response.
        - response-content-disposition (String) - Sets the Content-Disposition header of the response.
        - response-content-encoding (String) - Sets the Content-Encoding header of the response.

Return:

- res (Object)
    - code (Number) — the code number returned from the request. The request is successful when the number is 200.
    - data (Object) — the de-serialized data returned from the request. The default is ```{}```.
    - error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.

### getBuffer(key[, options])

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>',
    bucket: 'Bucket'
});
 
var result = client.getBuffer('test');
 
result.then(function (res) {
    console.log(res);
});

```

Parameters:

- key (String) — object name.
- options (Object)
    - headers (Object) extra headers.
    - query (Object)
        - response-content-type (String) - Sets the Content-Type header of the response.
        - response-content-language (String) - Sets the Content-Language header of the response.
        - response-expires (String) - Sets the Expires header of the response.
        - response-cache-control (String) - Sets the Cache-Control header of the response.
        - response-content-disposition (String) - Sets the Content-Disposition header of the response.
        - response-content-encoding (String) - Sets the Content-Encoding header of the response.

Return:

- res (Object)
    - code (Number) — the code number returned from the request. The request is successful when the number is 200.
    - data (Object) — the de-serialized data returned from the request. The default is ```{}```.
Set to ```{}``` if a request error occurs. The data object has the following properties:
        - content (String)  — the data.
    - error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.


### getStream(key[, options])

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>',
    bucket: 'Bucket'
});
 
var writeStream = fs.createWriteStream(path.join(__dirname, './data/test.json'));
 
var result = client.getStream('ObjectKey');
 
result.then(function (data) {
    data.stream.pipe(writeStream);
    data.stream.on('end', function () {
        console.log('success');
    });
    data.stream.on('error', function (err) {
        console.log('fail', err);
    });
});

```

Parameters:

- key (String) — object name.
- options (Object)
    - headers (Object) extra headers.
    - query (Object)
        - response-content-type (String) - Sets the Content-Type header of the response.
        - response-content-language (String) - Sets the Content-Language header of the response.
        - response-expires (String) - Sets the Expires header of the response.
        - response-cache-control (String) - Sets the Cache-Control header of the response.
        - response-content-disposition (String) - Sets the Content-Disposition header of the response.
        - response-content-encoding (String) - Sets the Content-Encoding header of the response.

Return:

- res (Object)
    - code (Number) — the code number returned from the request. The request is successful when the number is 200.
    - data (Object) — the de-serialized data returned from the request. The default is ```{}```.
Set to ```{}``` if a request error occurs. The data object has the following properties:
        - stream (ReadStream)
    - error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.


### listObject([options])
Returns all of the objects in a bucket. 

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>',
    bucket: 'Bucket'
});
 
 
var result = client.listObject();
result.then(function (res) {
    console.log(res);
});

```

Parameters:

- key (String) — object name.
- options (Object)
    - query (Object) query object, see the api list.
        - delimiter (String) - A delimiter is a character you use to group keys.
        - marker (String) - Specifies the key to start with when listing objects in a bucket.
        - max-keys (Integer) - Sets the maximum number of keys returned in the response. The response might contain fewer keys but will never contain more.
        - prefix (String) - Limits the response to keys that begin with the specified prefix.

Return:

- res (Object)
    - code (Number) — the code number returned from the request. The request is successful when the number is 200.
    - data (Object) — the de-serialized data returned from the request. The default is ```{}```.
Set to ```{}``` if a request error occurs. The data object has the following properties:
        - Name (String) - Bucket name
        - Prefix (String)
        - Marker (String)
        - MaxKeys (Integer)
        - Contents (Array) the list of object.
            - Key (String) — object name on mss.
            - Etag (String) — object etag.
            - LastModified (String) — object last modified GMT date.
            - Size (Number) — object size.
            - StorageClass (String) — storage class type.
            - Owner (Object) — object owner, including ID and DisplayName.
        - IsTruncated (Boolean) - A flag that indicates whether or not Amazon S3 returned all of the results that satisfied the search criteria.
        - Delimiter (String)
        - NextMarker (String) - When response is truncated (the IsTruncated element value in the response is true), you can use the key name in this field as marker in the subsequent request to get next set of objects. Amazon S3 lists objects in alphabetical order Note: This element is returned only if you have delimiter request parameter specified. If response does not include the NextMaker and it is truncated, you can use the value of the last Key in the response as the marker in the subsequent request to get the next set of object keys.
    - error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.

        
### copyObject(from, to[, options])

Creates a copy of an object that is already stored in mss S3.

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>',
    bucket: 'Bucket'
});
 
var result = client.copyObject(‘from’, 'to');
 
result.then(function (res) {
    console.log(res);
});

```

Parameters:

- key (String) — object name.

Return:

- res (Object)
    - code (Number) — the code number returned from the request. The request is successful when the number is 200.
    - data (Object) — the de-serialized data returned from the request. The default is ```{}```.
Set to ```{}``` if a request error occurs. The data object has the following properties:
        - Etag (String) — object etag.
        - LastModified (String) — object last modified GMT date.	- error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.


### getMeta(key[, options])

Retrieves objects meta from mos S3.

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>',
    bucket: 'Bucket'
});
 
var result = client.getMeta('ObjectKey');
result.then(function (res) {
    console.log(res);
});

```

Parameters:

- key (String) — object name.

Return:

- res (Object)
    - code (Number) — the code number returned from the request. The request is successful when the number is 200.
    - data (Object) — the de-serialized data returned from the request. The default is ```{}```.
Set to ```{}``` if a request error occurs. The data object has the following properties:
        - Etag (String) — object etag.
        - LastModified (String) — object last modified GMT date.
        - ContentType (String) — content-type.
        - ContentLength (String) — content-length.
    - error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.

### deleteObject(key[, options])

Deletes an object.

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>',
    bucket: 'Bucket'
});
 
var result = client.deleteObject('ObjectKey');
 
result.then(function (res) {
    console.log(res);
});

```

Parameters:

- key (String) — object name.

Return:

- res (Object)
    - code (Number) — the code number returned from the request. The request is successful when the number is 200.
    - data (Object) — the de-serialized data returned from the request. The default is ```{}```.
Set to ```{}``` if a request error occurs.
    - error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.

    
### deleteMultiple(keys[, options])

Deletes objects by query.

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>',
    bucket: 'Bucket'
});
 
var result = client.deleteMultiple('array');
 
result.then(function (res) {
    console.log(res);
});

```

Parameters:

- keys (Array) — objects.

Return:

- res (Object)
    - code (Number) — the code number returned from the request. The request is successful when the number is 200.
    - data (Object) — the de-serialized data returned from the request. The default is ```{}```.
Set to ```{}``` if a request error occurs.
    - error (Object) — the error object returned from the request. Set to ```null``` if the request is successful.


### signatureUrl(name[, options])

Examples:

```js
var MSS = require('mos-mss');
var client = new MSS({
    accessKeyId: '<accessKeyId>',
    accessKeySecret: '<accessKeySecret>',
    bucket: 'Bucket'
});
 
var result = client.signatureUrl('ObjectKey');
 
result.then(function (res) {
    console.log(res);
});

```

Parameters:

- name (String) — object name.
- options (Object)
    - headers (Object) extra headers.
    - query (Object)
        - response-content-type (String) - Sets the Content-Type header of the response.
        - response-content-language (String) - Sets the Content-Language header of the response.
        - response-expires (String) - Sets the Expires header of the response.
        - response-cache-control (String) - Sets the Cache-Control header of the response.
        - response-content-disposition (String) - Sets the Content-Disposition header of the response.
        - response-content-encoding (String) - Sets the Content-Encoding header of the response.

Return:

- res (Object)
    - code (Number) — the code number returned from the request. The request is successful when the number is 200.
    - data (String) — object signature url.



## License

[MIT](LICENSE)