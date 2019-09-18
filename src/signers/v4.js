const { debuglog } = require('util');
const util = require('./lib/util');
const urlParse = require('url');
let debug = debuglog('mss-net');

/**
 * @api private
 * AWS
 */
let cachedSecret = {};

/**
 * @api private
 */
let expiresHeader = 'presigned-expires';

/**
 * @api private
 */
let proto = {};
proto.v4 = function() {
    let request = null;
    return {
        algorithm: 'AWS4-HMAC-SHA256',

        addAuthorization: function addAuthorization(credentials, date, authorizationR) {
            request = authorizationR;
            request.region = 'us-east-1';
            this.serviceName = 's3';
            request.headers['X-Amz-Content-Sha256'] = this.hexEncodedHash(request.body || '');
            let datetime = util.date.iso8601(date).replace(/[:\-]|\.\d{3}/g, '');

            if (this.isPresigned()) {
                this.updateForPresigned(credentials, datetime);
            } else {
                this.addHeaders(credentials, datetime);
                this.updateBody(credentials);
            }

            request.headers['Authorization'] = this.authorization(credentials, datetime);
            return request;
        },

        addHeaders: function addHeaders(credentials, datetime) {
            request.headers['X-Amz-Date'] = datetime;
            if (credentials.sessionToken) {
                request.headers['x-amz-security-token'] = credentials.sessionToken;
            }
        },

        updateBody: function updateBody(credentials) {
            // if (request.params) {
            // request.params.AWSAccessKeyId = credentials.accessKeyId;

            // if (credentials.sessionToken) {
            //     request.params.SecurityToken = credentials.sessionToken;
            // }

            // request.body = util.queryParamsToString(request.params);
            // request.headers['Content-Length'] = request.body.length;
            // }
        },

        updateForPresigned: function updateForPresigned(credentials, datetime) {
            let credString = this.credentialString(datetime);
            let qs = {
                'X-Amz-Date': datetime,
                'X-Amz-Algorithm': this.algorithm,
                'X-Amz-Credential': credentials.accessKeyId + '/' + credString,
                'X-Amz-Expires': request.headers[expiresHeader],
                'X-Amz-SignedHeaders': this.signedHeaders()
            };

            if (credentials.sessionToken) {
                qs['X-Amz-Security-Token'] = credentials.sessionToken;
            }

            if (request.headers['Content-Type']) {
                qs['Content-Type'] = request.headers['Content-Type'];
            }

            // need to pull in any other X-Amz-* headers
            util.each.call(this, request.headers, function(key, value) {
                if (key === expiresHeader) { return; }
                if (this.isSignableHeader(key) &&
                    key.toLowerCase().indexOf('x-amz-') === 0) {
                    qs[key] = value;
                }
            });

            let sep = request.path.indexOf('?') >= 0 ? '&' : '?';
            request.path += sep + util.queryParamsToString(qs);
        },

        authorization: function authorization(credentials, datetime) {
            let parts = [];
            let credString = this.credentialString(datetime);

            parts.push(this.algorithm + ' Credential=' +
            credentials.accessKeyId + '/' + credString);

            parts.push('SignedHeaders=' + this.signedHeaders());

            parts.push('Signature=' + this.awssignature(credentials, datetime));

            return parts.join(', ');
        },

        awssignature: function signature(credentials, datetime) {
            let cache = cachedSecret[this.serviceName];
            let date = datetime.substr(0, 8);
            if (!cache ||
                cache.akid !== credentials.accessKeyId ||
                cache.region !== request.region ||
                cache.date !== date) {
                let kSecret = credentials.accessKeySecret;

                let kDate = util.crypto.hmac('AWS4' + kSecret, date, 'buffer');
                let kRegion = util.crypto.hmac(kDate, request.region, 'buffer');
                let kService = util.crypto.hmac(kRegion, this.serviceName, 'buffer');
                let kCredentials = util.crypto.hmac(kService, 'aws4_request', 'buffer');
                cachedSecret[this.serviceName] = {
                    region: request.region, date: date,
                    key: kCredentials, akid: credentials.accessKeyId
                };
            }

            let key = cachedSecret[this.serviceName].key;
            return util.crypto.hmac(key, this.stringToSign(datetime), 'hex');
        },

        stringToSign: function stringToSign(datetime) {
            let parts = [];
            parts.push('AWS4-HMAC-SHA256');
            parts.push(datetime);
            parts.push(this.credentialString(datetime));
            parts.push(this.hexEncodedHash(this.canonicalString()));

            debug('stringToSign %j', parts);
            return parts.join('\n');
        },

        canonicalString: function canonicalString() {
            let parts = [];
            let pathname = request.path;
            let url = urlParse.parse(pathname);

            function parseQuery(queryString) {
                let queryObj = {};
                if (queryString) {
                    let block = queryString.split('&');
                    for (let i = 0; i < block.length; i++) {
                        let one = block[i].split('=');
                        queryObj[one[0]] = one[1] ? one[1] : '';
                    }
                }
                return queryObj;
            }
            let params = parseQuery(url.query);

            pathname = util.uriEscapePath(url.pathname);

            parts.push(request.method);
            parts.push(url.pathname);
            parts.push(util.queryParamsToString(params) || '');
            parts.push(this.canonicalHeaders() + '\n');
            parts.push(this.signedHeaders());
            parts.push(this.hexEncodedBodyHash());
            debug('cannoicalString %j', parts);
            return parts.join('\n');
        },

        canonicalHeaders: function canonicalHeaders() {
            let headers = [];
            util.each.call(this, request.headers, function(key, item) {
                headers.push([key, item]);
            });
            headers.sort(function(a, b) {
                return a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1;
            });
            let parts = [];
            util.arrayEach.call(this, headers, function(item) {
                let key = item[0].toLowerCase();
                if (this.isSignableHeader(key)) {
                    parts.push(key + ':' +
                    this.canonicalHeaderValues(item[1].toString()));
                }
            });
            return parts.join('\n');
        },

        canonicalHeaderValues: function canonicalHeaderValues(values) {
            return values.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
        },

        signedHeaders: function signedHeaders() {
            let keys = [];
            util.each.call(this, request.headers, function(key) {
                key = key.toLowerCase();
                if (this.isSignableHeader(key)) { keys.push(key); }
            });
            return keys.sort().join(';');
        },

        credentialString: function credentialString(datetime) {
            let parts = [];
            parts.push(datetime.substr(0, 8));
            parts.push(request.region);
            parts.push(this.serviceName);
            parts.push('aws4_request');
            return parts.join('/');
        },

        hexEncodedHash: function hash(string) {
            return util.crypto.sha256(string, 'hex');
        },

        hexEncodedBodyHash: function hexEncodedBodyHash() {
            if (this.isPresigned() && this.serviceName === 's3') {
                return 'UNSIGNED-PAYLOAD';
            } else if (request.headers['X-Amz-Content-Sha256']) {
                return request.headers['X-Amz-Content-Sha256'];
            } else {
                return this.hexEncodedHash(request.body || request.stream || '');
            }
        },

        unsignableHeaders: ['authorization', 'content-type', 'content-length',
            'user-agent', expiresHeader, 'transfer-encoding', 'connection'],

        isSignableHeader: function isSignableHeader(key) {
            if (key.toLowerCase().indexOf('x-amz-') === 0) { return true; }
            return this.unsignableHeaders.indexOf(key) < 0;
        },

        isPresigned: function isPresigned() {
            return request.headers[expiresHeader] ? true : false;
        }

    };
};
module.exports = proto;