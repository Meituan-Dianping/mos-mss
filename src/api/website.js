'use strict';

/**
 * Website api
 */

const xml2js = require('xml2js');

const builder = new xml2js.Builder();
const proto = exports;

proto.PutBucketWebsite = async function(bucket, options) {
    this.options.bucket = bucket;

    const xml = builder.buildObject({
        WebsiteConfiguration: options.WebsiteConfiguration
    });

    const params = this._requestBucketParams('PUT', options);
    params.query = {
        website: ''
    };
    params.body = xml;

    const result = await this.request(params);
    const { code } = result;
    let { body } = result.res;
    const data = {};

    if (code !== 200) {
        result.error = this.keyValueObject(body);
    }

    return {
        code,
        data,
        error: result.error
    };
};

proto.PutBucketDomain = async function(bucket, options) {
    this.options.bucket = bucket;

    const xml = builder.buildObject({
        DescribeDomain: options.DescribeDomain
    });

    const params = this._requestBucketParams('PUT', options);
    params.query = {
        domain: ''
    };
    params.body = xml;

    const result = await this.request(params);
    const { code } = result;
    let { body } = result.res;
    const data = {};

    if (code !== 200) {
        result.error = this.keyValueObject(body);
    }

    return {
        code,
        data,
        error: result.error
    };
};

proto.GetBucketInfo = function(info) {
    return async function(bucket, options) {
        options = options || {};
        this.options.bucket = bucket;
        const params = this._requestBucketParams('GET', options);
        params.query = {};
        params.query[info] = '';
        params.headers = params.headers || {};
        params.headers['Content-Type'] = 'application/json';
        const result = await this.request(params);
        const { code } = result;
        const { body } = result.res;
        let data = {};

        if (code !== 200) {
            result.error = this.keyValueObject(body);
        } else {
            data = body;
        }

        return {
            code,
            data,
            error: result.error
        };
    };
};

const infoList = ['website', 'domain'];

infoList.forEach((item) => {
    proto['GetBucket' + item.substring(0, 1).toUpperCase() + item.substring(1)] = proto.GetBucketInfo(item);
});

proto.DeleteBucketDomain = async function(bucket, options) {
    this.options.bucket = bucket;

    const xml = builder.buildObject({
        DescribeDomain: options.DescribeDomain
    });

    const params = this._requestBucketParams('DELETE', options);
    params.query = {
        domain: ''
    };
    params.body = xml;

    params.headers = Object.assign({}, params.headers);
    params.headers['Content-Length'] = params.body.length;
    const result = await this.request(params);
    const { code } = result;
    let { body } = result.res;
    const data = {};

    if (code !== 200) {
        result.error = this.keyValueObject(body);
    }

    return {
        code,
        data,
        error: result.error
    };
};

proto.DeleteBucketWebsite = async function(bucket, options) {
    return await this._deleteBucketFn('website', bucket, options);
};

proto._requestBucketParams = function(method, options) {
    if (!this.options.bucket) {
        throw new Error('Please create a bucket first');
    }

    options = options || {};
    const params = {
        pathname: `/${this.options.bucket}`,
        method: method
    };

    for (let key in params) {
        options[key] = params[key];
    }

    return options;
};