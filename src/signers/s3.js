const util = require('./lib/util');

/**
 * @api private
 */
let proto = {};
proto.s3 = function() {
    let request = null;
    return {

        /**
         * When building the stringToSign, these sub resource params should be
         * part of the canonical resource string with their NON-decoded values
         */
        subResources: {
            'acl': 1,
            'cors': 1,
            'lifecycle': 1,
            'delete': 1,
            'location': 1,
            'logging': 1,
            'notification': 1,
            'partNumber': 1,
            'policy': 1,
            'requestPayment': 1,
            'restore': 1,
            'tagging': 1,
            'torrent': 1,
            //'uploadId': 1,
            'uploads': 1,
            'versionId': 1,
            'versioning': 1,
            'versions': 1,
            'website': 1,
            'domain': 1
        },

        // when building the stringToSign, these querystring params should be
        // part of the canonical resource string with their NON-encoded values
        responseHeaders: {
            'uploadId': 1,
            'response-content-type': 1,
            'response-content-language': 1,
            'response-expires': 1,
            'response-cache-control': 1,
            'response-content-disposition': 1,
            'response-content-encoding': 1
        },

        addAuthorization: function addAuthorization(credentials, date, authorizationR) {
            request = authorizationR;
            if (!request.headers['presigned-expires']) {
                request.headers['X-Amz-Date'] = util.date.rfc822(date);
            }

            if (credentials.sessionToken) {
            // presigned URLs require this header to be lowercased
                request.headers['x-amz-security-token'] = credentials.sessionToken;
            }

            let signature = this.sign(credentials.accessKeySecret, this.stringToSign());
            let auth = 'AWS ' + credentials.accessKeyId + ':' + signature;

            request.headers['Authorization'] = auth;
            return request;
        },

        stringToSign: function stringToSign() {
            let r = request;
            let parts = [];
            parts.push(r.method);
            parts.push(r.headers['Content-MD5'] || '');
            parts.push(r.headers['Content-Type'] || '');

            // This is the "Date" header, but we use X-Amz-Date.
            // The S3 signing mechanism requires us to pass an empty
            // string for this Date header regardless.
            parts.push(r.headers['presigned-expires'] || '');

            let headers = this.canonicalizedAmzHeaders();

            if (headers) { parts.push(headers); }
            parts.push(this.canonicalizedResource());

            // console.log(parts.join('\n'));
            return parts.join('\n');
        },

        canonicalizedAmzHeaders: function canonicalizedAmzHeaders() {
            let amzHeaders = [];

            util.each(request.headers, function(name) {
                if (name.match(/^x-amz-/i)) { amzHeaders.push(name); }
            });

            amzHeaders.sort(function(a, b) {
                return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
            });

            let parts = [];
            util.arrayEach.call(this, amzHeaders, function(name) {
                parts.push(name.toLowerCase() + ':' + String(request.headers[name]));
            });

            return parts.join('\n');
        },

        canonicalizedResource: function canonicalizedResource() {
            let r = request;

            let parts = r.path.split('?');
            let path = parts[0];
            let querystring = parts[1];

            let resource = '';

            if (r.virtualHostedBucket) { resource += '/' + r.virtualHostedBucket; }

            resource += path;

            if (querystring) {
                // collect a list of sub resources and query params that need to be signed
                let resources = [];

                util.arrayEach.call(this, querystring.split('&'), function(param) {
                    let name = param.split('=')[0];
                    let value = param.split('=')[1];
                    if (this.subResources[name] || this.responseHeaders[name]) {
                        let subresource = { name: name };
                        if (value !== undefined) {
                            if (this.subResources[name]) {
                                subresource.value = value;
                            } else {
                                subresource.value = decodeURIComponent(value);
                            }
                        }
                        resources.push(subresource);
                    }
                });

                resources.sort(function(a, b) { return a.name < b.name ? -1 : 1; });

                if (resources.length) {
                    querystring = [];
                    util.arrayEach(resources, function(resource) {
                        if (resource.value === undefined) { querystring.push(resource.name); } else { querystring.push(resource.name + '=' + resource.value); }
                    });

                    resource += '?' + querystring.join('&');
                }
            }

            return resource;
        },

        sign: function sign(secret, string) {
            return util.crypto.hmac(secret, string, 'base64', 'sha1');
        }
    };
};
module.exports = proto;
