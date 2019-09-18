'use strict';

/**
 * Module dependencies
 */

const http = require('http');
const https = require('https');
const url = require('url');
const Stream = require('stream');
const { inherits, debuglog} = require('util');
const debug = debuglog('netlog');
const xml2js = require('xml2js');
const contentType = require('content-type');

const protocols = {
    'http:': http,
    'https:': https
};

const httpAgent = {
    'http:': new http.Agent(),
    'https:': new https.Agent()
};

/**
 *  Default timeout milliseconds
 *  @constant
 *  @default
 */
const TIMEOUT = 5000;

/**
 * @constructor
 * @param {Object} options
 * - {string} [method] - A string specifying the HTTP request method. Defaults to 'GET'.
 * - {string} [url] -  A request path.
 * - {ReadStream} [stream] - Upload file stream.
 * - {Object} [headers] - An object containing request headers.
 * - {Object} [body] - A send data.
 * - {Boolean} [streamResponse] - Response type.
 * - {Number} [timeout] - A number specifying the socket timeout in milliseconds. This will set the timeout before the socket is connected.
 * - {Object} [agent] - Controls Agent behavior.
 */
class Request {
    constructor(options, callback) {
        if (!(this instanceof Request)) {
            return new Request(options, callback);
        }
        this.init(options, callback);
    }
}

inherits(Request, Stream);

Request.prototype.init = function(options, callback) {
    options = options || {};

    debug('options %j', options);
    this.method = options.method || 'GET';
    this.url = options.url || '';
    this.stream = options.stream;
    this.headers = options.headers;
    this.body = options.body;
    this.callback = callback;
    this.userCallBack = options.callback;
    this.streamResponse = options.streamResponse;
    this.timeout = options.timeout;

    if (typeof this.url === 'string') {
        this.url = url.parse(this.url);
    }
    debug('url is %j', this.url);

    const agent = httpAgent[this.url.protocol];
    agent.maxSockets = 1000;
    if (options.agent) {
        for (let key in options.agent) {
            agent[key] = options.agent[key];
        }
        this.agent = agent;
    }

    const defer = setImmediate ? setImmediate : process.nextTick;

    defer(() => {
        this.end();
    });
};

Request.prototype.start = function() {
    let opts = {
        host: this.url.hostname,
        port: this.url.port || (this.url.protocol === 'http:' ? 80 : 443),
        method: this.method,
        headers: this.headers,
        path: this.url.path,
        agent: this.agent
    };
    debug('end options %j', opts);

    const httpServer = protocols[this.url.protocol];

    try {
        this.req = httpServer.request(opts);
        // this.req.setTimeout(this.timeout, () => {
        //     this.req.abort();
        //     throw new Error('TimeoutError');
        // });
    } catch (e) {
        this.callback(new Error(e));
        return;
    }

    this.req.on('response', this.onResponse.bind(this));

    this.req.on('error', (error) => {
        this.callback(new Error(error));
    });

    if (this.stream) {
        this.stream.pipe(this.req);
        return;
    } else {
        this.req.end(this.body);
    }

    this.stream = null;
};

Request.prototype.end = function() {
    this.start();
};

Request.prototype.onResponse = function(response) {
    if (this.stream) {
        this.callback(null, {}, response);
    }

    if (this.streamResponse) {
        return this.callback(null, null, response);
    }

    let { headers } = response;
    const chunks = [];
    let size = 0;

    response.on('data', function(chunk) {
        size += chunk.length;
        chunks.push(chunk);
    });

    response.on('end', () => {
        let body = Buffer.concat(chunks, size);

        const obj = contentType.parse(headers['content-type'] || 'application/xml');
        const aXml = ['application/xml', 'text/xml'];

        if (aXml.indexOf(obj.type) > -1) {
            body = this.parseXML(body);
            body.then((data) => {
                this.callback(null, data, response);
            }).catch(function(e){
                this.callback(new Error(e));
            });
        } else {
            this.callback(null, body, response);
        }
    });
};

Request.prototype.parseXML = function(chunk) {
    return new Promise((resolve, reject) => {
        if (Buffer.isBuffer(chunk)) {
            chunk = chunk.toString();
        }

        function isJson(str) {
            try {
                if (typeof JSON.parse(str) === 'object') {
                    return true;
                }
            } catch (e) {
                return false;
            }
        }

        if (isJson(chunk)) {
            let body = JSON.parse(chunk);
            resolve(body);
        } else {
            xml2js.parseString(chunk, {
                explicitRoot: false,
                explicitArray: false
            }, function(err, data) {
                if (err){
                    reject(new Error(err));
                }
                resolve(data);
            });
        }
    });
};

module.exports = Request;