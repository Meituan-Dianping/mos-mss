'use strict';

const { debuglog } = require('util');
const urlModel = require('url');

const request = require('./mos-http');
const debug = debuglog('mss-net');

const proto = {};

function createRequest(params) {
    let { method, headers, query, body, pathname, stream, timeout, streamResponse } = params;
    const methods = [
        'delete',
        'get',
        'post',
        'put',
        'head'
    ].map(function(method) {
        return method.toUpperCase();
    });

    method = methods.indexOf(method) > -1 ? method : 'GET';

    let urlPath = urlModel.format({
        query,
        pathname,
        protocol: this.options.protocol,
        auth: false,
        hostname: this.options.endpoint
    });

    //不允许 delete=、lifecycle= 结束
    urlPath = urlPath.replace(/(.*)delete=/, '$1delete').replace(/(.*)lifecycle=/, '$1lifecycle');
    let url = urlModel.parse(urlPath);

    headers = headers ? headers : {};
    headers['Host'] = url.hostname;
    headers['Content-Type'] = headers['Content-Type'] ? headers['Content-Type'] : 'application/octet-stream';
    headers['User-Agent'] = 'beam-mss-nodejs';

    const authorizationR = {
        headers,
        method,
        body,
        stream,
        path: url.path
    };
    debug('parse url %j', url);
    debug('authorizationR', authorizationR);
    const r = this.addAuthorization({
        expired: false,
        expireTime: null,
        accessKeyId: this.options.accessKeyId,
        accessKeySecret: this.options.accessKeySecret
    }, new Date(), authorizationR);
    debug('header', r.headers);
    r.headers = r.headers || {};

    const reqParams = {
        query,
        body,
        stream,
        headers,
        method,
        timeout,
        urlPath,
        streamResponse
    };

    return reqParams;
}

proto.request = function(params) {
    const reqParams = createRequest.call(this, params);
    reqParams.agent = Object.assign({
        maxSockets: 100
    }, reqParams.agent);
    return new Promise(async(resolve, reject) => {
        try {
            let result = await request(reqParams.urlPath, reqParams);
            const { status, res, data } = result;

            resolve({
                code: status,
                error: null,
                res: {
                    headers: res.headers,
                    body: data
                },
                stream: result.res
            });
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = proto;