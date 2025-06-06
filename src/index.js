'use strict';

const { debuglog } = require('util');
const merge = require('merge-descriptors');
const S3 = require('./signers/s3');
const V4 = require('./signers/v4');
const request = require('./net/mos-request.js');
const config = require('./config');
const bucket = require('./api/bucket');
const object = require('./api/object');
const multipart = require('./api/multipart');
const website = require('./api/website');

const debug = debuglog('mos-mss');

class Client {
    constructor(options) {
        const { MSS_APP_KEY, MSS_APP_SECRET } = process.env;
        const { accessKeyId = MSS_APP_KEY, accessKeySecret = MSS_APP_SECRET} = options;
        Object.assign(options, {
            accessKeyId,
            accessKeySecret
        });
        if (!(this instanceof Client)) {
            return new Client(options);
        }

        debug('config is %j', this.config, options);

        this.options = Client.initOptions.call(this, options);
        this.options.signerVersion = this.options.signerVersion || 'v2';

        debug('options is %j', this.options);

        /**
         * authorization
         */
        debug('signer version %s', this.options.signerVersion);

        switch (this.options.signerVersion) {
        case 'v2':
            merge(Client.prototype, S3.s3());
            break;
        case 'v4':
            merge(Client.prototype, V4.v4());
            break;
        default:
            throw new Error('signerVersion should be v2 or v4');
        }
    }
    static initOptions(options) {
        if (options && (!options.accessKeyId || !options.accessKeySecret)) {
            throw new Error('accessKeyId and accessKeySecret is must be');
        }
        options.protocol = options.secure ? 'https' : 'http';
        options.endpoint = options.endpoint || this.config.endpoint;
        const opts = Object.assign({}, {
            region: '',
            endpoint: options.endpoint
        }, options);
        return opts;
    };
}

module.exports = Client;

const proto = Client.prototype;

/**
 * api config
 */
merge(proto, {
    config: config
});

/**
 * request api
 */
merge(proto, request);

/**
 * Bucket
 */
merge(proto, bucket);

/**
 * Object
 */
merge(proto, object);

/**
 * multipart
 */
merge(proto, multipart);

/**
 * website
*/
merge(proto, website);

/**
 * other
 */
//Coming soon