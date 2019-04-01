'use strict';

const Request = require('./request');

function buildCallback(resolve, reject) {
    return function(err, data, res) {
        if (err) {
            return reject(err);
        }
        resolve({
            data: data,
            status: res.statusCode,
            res: res
        });
    };
}

function request(url, options, callback) {
    const params = Object.assign({}, options, {
        url
    });
    params.callback = callback || params.callback;

    return new Promise(function(resolve, reject) {
        new Request(params, buildCallback(resolve, reject));
    });
}

module.exports = request;
request.Request = Request;