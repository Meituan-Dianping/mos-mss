'use strict';

/**
 * Object api
 */
const { debuglog } = require('util');
const fs = require('fs');
const mime = require('mime');
const xml2js = require('xml2js');
const url = require('url');
const _ = require('../util');
const util = require('../signers/lib/util');

const builder = new xml2js.Builder();
const debug = debuglog('mos-mss');
const proto = exports;

proto.getObject = async function(fileName, file, options) {
    options = options || {};
    return new Promise(async(resolve) => {
        const writeStream = fs.createWriteStream(file);

        const { stream, code } = await this.getStream(fileName, options);
        if (code === 404) {
            resolve({
                code: 404,
                error: 'object key不存在'
            });
        } else {
            stream.pipe(writeStream);
        }
        stream.on('error', function(err) {
            resolve({
                code: 500,
                error: err
            });
        });
        writeStream.on('finish', function() {
            resolve({
                code: 200,
                error: null,
                data: null
            });
        });
    });
};

proto.putObject = async function(fileName, file, options) {
    options = options || {};
    options.headers = options.headers || {};
    options['headers']['Content-Type'] = options['headers']['Content-Type'] || mime.getType(file);

    //upload local file
    if (_.isString(file)){
        options.contentLength = await this._getFileSize(file);
        const stream = fs.createReadStream(file);
        return await this.putStream(fileName, stream, options);
    } else if (_.isReadable(file)) {
        return await this.putStream(fileName, file, options);
    } else if (_.isBuffer(file)) {
        const method = 'PUT';
        const params = this._requestParams(method, fileName, options);
        params.body = file;

        const result = await this.request(params);

        const { code } = result;
        let { body, headers } = result.res;
        const data = {};

        if (code !== 200) {
            result.error = this.keyValueObject(body);
        } else {
            data['ETag'] = headers['etag'];
        }
        return {
            code,
            data,
            error: result.error
        };
    } else {
        throw new TypeError('Must provide String/Buffer/ReadableStream for put.');
    }
};

proto.putStream = async function(fileName, stream, options) {
    options = options || {};
    options.headers = options.headers || {};

    if (options.contentLength) {
        options.headers['Content-Length'] = options.contentLength;
    } else {
        options.headers['Transfer-Encoding'] = 'chunked';
    }

    const method = options.method || 'PUT';
    const params = this._requestParams(method, fileName, options);
    params.stream = stream;
    const result = await this.request(params);
    const { code } = result;
    let { body, headers } = result.res;
    const data = {};

    if (code !== 200) {
        result.error = this.keyValueObject(body);
    } else {
        data['ETag'] = headers['etag'];
    }

    return {
        code,
        data,
        error: result.error
    };
};

proto.getBuffer = async function(ObjectKey, options) {
    if (ObjectKey.length === 0) {
        throw new Error('ObjectKey 不能为空');
    }
    options = options || {};
    const method = options.method || 'GET';
    const params = this._requestParams(method, ObjectKey, options);
    const result = await this.request(params);
    const { code } = result;
    const { body } = result.res;
    const data = {};

    if (code !== 200) {
        result.error = this.keyValueObject(body);
    } else {
        data.content = this.keyValueObject(body).toString();
    }

    return {
        code,
        data,
        error: result.error
    };
};

proto.getStream = async function(ObjectKey, options) {
    if (ObjectKey.length === 0) {
        throw new Error('ObjectKey 不能为空');
    }
    options = options || {};
    const method = options.method || 'GET';
    const params = this._requestParams(method, ObjectKey, options);
    params.streamResponse = true;
    const result = await this.request(params);

    return result;
};

proto.listObject = async function(options) {
    const params = this._requestParams('GET', null, options);
    const result = await this.request(params);
    const { code } = result;
    const { body } = result.res;
    const { Contents } = body;
    let data = {};

    if (code !== 200) {
        result.error = this.keyValueObject(body);
    } else {
        data = this.keyValueObject(body);
        data.Contents = Contents ? (Array.isArray(Contents) ? Contents : [Contents]).map((item) => {
            return this.keyValueObject(item);
        }) : [];
    }

    return {
        code,
        data,
        error: result.error
    };
};

proto.copyObject = async function(from, to, options) {
    options = options || {};
    options.headers = options.headers || {};
    options.headers['x-amz-copy-source'] = from;
    const method = options.method || 'PUT';
    const params = this._requestParams(method, null, options);
    params.pathname = to;
    const result = await this.request(params);
    const { code } = result;
    const { body } = result.res;
    let data = {};

    if (code !== 200) {
        result.error = this.keyValueObject(body);
    } else {
        data = this.keyValueObject(body);
    }

    return {
        code,
        data,
        error: result.error
    };
};

proto.getMeta = async function(ObjectKey, options) {
    options = options || {};
    const method = options.method || 'HEAD';
    const params = this._requestParams(method, ObjectKey, options);
    const result = await this.request(params);
    const { code } = result;
    let { body, headers } = result.res;
    const data = {};
    if (code !== 200) {
        result.error = this.keyValueObject(body);
    } else {
        data['ETag'] = headers['etag'];
        data['LastModified'] = headers['last-modified'];
        data['ContentType'] = headers['content-type'];
        data['ContentLength'] = headers['content-length'];
    }

    return {
        code,
        data,
        error: result.error
    };
};

proto.deleteObject = async function(ObjectKey, options) {
    options = options || {};
    const method = options.method || 'DELETE';
    const params = this._requestParams(method, ObjectKey, options);
    const result = await this.request(params);
    let { code } = result;
    const { body } = result.res;
    const data = {};

    if (code !== 204) {
        result.error = this.keyValueObject(body);
    } else {
        code = 200;
    }

    return {
        code,
        data,
        error: result.error
    };
};

proto.deleteMultiple = async function(list, options) {
    let xmlBody = {
        Delete: {
            Quiet: true,
            Object: []
        }
    };

    list.map(item => {
        xmlBody.Delete.Object.push({
            Key: item
        });
    });

    xmlBody = builder.buildObject(xmlBody);

    options = options || {};
    options.body = xmlBody;
    options.headers = {
        'Content-Type': 'text/plain'
    };
    const params = this._requestParams('POST', null, options);
    params.query = {
        delete: ''
    };
    const result = await this.request(params);
    const { code } = result;
    const { body } = result.res;
    let data = {};

    if (code !== 200) {
        result.error = this.keyValueObject(body);
    } else {
        data = this.keyValueObject(body);
    }

    return {
        code,
        data,
        error: result.error
    };
};

proto.signature = function(stringToSign) {
    debug('authorization stringToSign: %s', stringToSign);
    return util.crypto.hmac(this.options.accessKeySecret, stringToSign, 'base64', 'sha1');
};

proto.signatureUrl = async function(objectkey, options) {
    options = options || {};

    options.endpoint = options.endpoint || this.options.endpoint;
    const expires = Math.round(new Date().getTime() / 1000) + (options.expires || 1800);

    const arr = [];
    for (let key in options.query) {
        arr.push(key + '=' + options.query[key]);
    }
    const queryStr = arr.sort((a, b) => { return a < b ? -1 : 1; }).join('&');

    const resource = '/' + this.options.bucket + '/' + objectkey;

    const stringToSign = [
        options.method || 'GET',
        options['content-md5'] || '',
        options['content-type'] || '',
        expires,
        queryStr ? resource + '?' + queryStr : resource
    ].join('\n');

    const signature = this.signature(stringToSign);
    const query = Object.assign({}, {
        AWSAccessKeyId: this.options.accessKeyId,
        Expires: expires,
        Signature: signature
    }, options.query);

    const protocol = options.protocol || 'http';
    let pathUrl = url.format({
        protocol,
        query,
        auth: false,
        hostname: options.endpoint,
        pathname: resource
    });

    const res = {
        code: 200,
        data: pathUrl
    };

    return res;
};

proto._requestParams = function(method, name, options) {
    if (!this.options.bucket) {
        throw new Error('Please create a bucket first');
    }

    options = options || {};
    name = name && this._replaceChart(name) || '';
    const params = {
        pathname: `/${this.options.bucket}/${encodeURI(name)}`,
        method: method
    };

    for (let key in params) {
        options[key] = params[key];
    }

    return options;
};

proto._replaceChart = function(name) {
    return name.replace(/^\/+/, '');
};
