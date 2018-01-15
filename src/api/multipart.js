'use strict';

/**
 * multipart api
 * _resumeMultipart 函数逻辑参考ali-oss _resumeMultipar实现
 */
const xml2js = require('xml2js');
const fs = require('fs');

const _ = require('../util');

const builder = new xml2js.Builder();
const proto = exports;

proto.multipartUpload = async function(fileName, file, options) {
    if (options.checkpoint && options.checkpoint.uploadId) {
        return await this._resumeMultipart(options.checkpoint, options);
    }

    const partSize = options && options.partSize || 1024 * 1024 * 5; //(1024 == 1kb)
    const fileSize = await this._getFileSize(file);
    const initInfo = await this._initMultipartUpload(fileName, options);
    const checkpoint = {
        file: file,
        fileName: fileName,
        fileSize: fileSize,
        partSize: partSize,
        uploadId: initInfo.uploadId,
        doneParts: []
    };

    return await this._resumeMultipart(checkpoint, options);
};

proto._initMultipartUpload = async function(fileName, options) {
    const params = this._requestParams('POST', fileName, options);
    params.query = {
        uploads: ''
    };
    const result = await this.request(params);
    const data = result.res.body;

    return {
        bucket: data.Bucket,
        key: data.Key,
        uploadId: data.UploadId
    };
};

proto._resumeMultipart = async function(checkpoint, options) {
    let { file, fileName, fileSize, partSize, uploadId, doneParts } = checkpoint;
    const partSplice = this._divideParts(fileSize, partSize);

    const updateOnePart = async function(partStart) {
        const pi = partSplice[partStart - 1];
        const data = {
            stream: this._createStream(file, pi.start, pi.end),
            size: pi.end - pi.start
        };

        const result = await this._uploadPart(fileName, uploadId, partStart, data, options);
        const { headers } = result.res;
        if (result.code === 500) {
            throw Error(result.error);
        }
        doneParts.push({
            number: partStart,
            etag: headers.etag
        });
        checkpoint.doneParts = doneParts;
        if (options && options.progress) {
            options.progress(doneParts.length / partSplice.length, checkpoint);
        }
    };

    const all = Array.from(new Array(partSplice.length), (x, i) => i + 1);
    const done = doneParts.map(p => p.number);
    const todo = all.filter(p => done.indexOf(p) < 0);

    for (let i = 0; i < todo.length; i++) {
        console.log(i);
        await updateOnePart.call(this, todo[i]);
    }

    return await this._completeMultipartUpload(fileName, uploadId, doneParts, options);
};

proto._uploadPart = async function(name, uploadId, partNo, data, options) {
    options = options || {};
    const readStream = data.stream;
    readStream.on('error', function(error){
        console.error('readStream error:', error.message);
    });

    /**
     * Content-Length  必须与发送内容一致，否则会Error: socket hang up
     */
    options.headers = {
        'Content-Length': data.size,
        'Connection': 'keep-alive'
    };
    const params = this._requestParams('PUT', name, options);
    params.query = {
        uploadId,
        partNumber: partNo
    };
    params.stream = data.stream;

    const result = await this.request(params);

    data.stream = null;
    params.stream = null;
    return result;
};

proto._createStream = function(file, start, end) {
    if (_.isFile(file)) {
        return new WebFileReadStream(file.slice(start, end));
    } else if (_.isString(file)) {
        return fs.createReadStream(file, {
            start: start,
            end: end - 1
        });
    } else {
        throw new Error('_createStream requires File/String.');
    }
};

proto._divideParts = function(fileSize, partSize) {
    const number = Math.ceil(fileSize / partSize);
    const parts = [];

    for (let i = 0; i < number; i++) {
        const start = partSize * i;
        const end = Math.min(start + partSize, fileSize);

        parts.push({
            start: start,
            end: end
        });
    }

    return parts;
};

proto._getFileSize = async function(file) {
    if (_.isBuffer(file)) {
        return file.length;
    } else if (_.isString(file)) {
        const stat = await fs.statSync(file);
        return stat.size;
    }

    throw new Error('_getFileSize requires Buffer/File/String.');
};

proto.closeMultipartUpload = async function(fileName, uploadId) {
    return await this._dataFn('DELETE', fileName, uploadId);
};

proto.getParts = async function(fileName, uploadId) {
    return await this._dataFn('GET', fileName, uploadId);
};

proto._completeMultipartUpload = async function(name, uploadId, parts, options) {
    parts.sort((a, b) => a.number - b.number);

    let xmlBody = {
        CompleteMultipartUpload: {
            Part: []
        }
    };

    parts.map(item => {
        xmlBody.CompleteMultipartUpload.Part.push({
            PartNumber: item.number,
            ETag: item.etag
        });
    });

    xmlBody = builder.buildObject(xmlBody);

    options = options || {};
    options.body = xmlBody;
    options.headers = {
        'Content-Type': 'text/plain'
    };

    return await this._dataFn('POST', name, uploadId, options);
};

/**
 * 函数涉及到closeMultipartUpload、getParts、_completeMultipartUpload
 * 如改动，要测试充分
 */
proto._dataFn = async function(method, fileName, uploadId, options) {
    const params = this._requestParams(method, fileName, options);
    params.query = {
        uploadId
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