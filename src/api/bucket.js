'use strict';

/**
 * Bucket api
 */

const xml2js = require('xml2js');
const _ = require('../util');

const builder = new xml2js.Builder();
const proto = exports;

proto.createBucket = async function(bucket, options) {
    options = options || {};
    this.options.bucket = bucket;
    const params = this._requestBucketParams('PUT', options);
    const result = await this.request(params);
    const { code } = result;
    let { body, headers } = result.res;
    const data = {};

    if (code !== 200) {
        result.error = this.keyValueObject(body);
    } else {
        data['x-mss-trace-id'] = headers['x-mss-trace-id'];
    }

    return {
        code,
        data,
        error: result.error
    };
};

proto.keyValueObject = function(object) {
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            const value = object[key];
            if (_.isArray(value) && value.length === 1) {
                object[key] = value[0];
                this.keyValueObject(object[key]);
            }
        }
    }
    return object;
};

proto.listBucket = async function() {
    const result = await this.request({
        pathname: '/',
        method: 'GET'
    });
    const { code } = result;
    const { body } = result.res;
    const data = {};

    if (code !== 200) {
        result.error = this.keyValueObject(body);
    } else {
        let { Owner, Buckets } = body;

        if (Owner) {
            data.Owner = this.keyValueObject(Owner);
        }
        if (Buckets) {
            data.Buckets = Array.isArray(Buckets.Bucket) ? Buckets.Bucket.map((item) => {
                return this.keyValueObject(item);
            }) : [this.keyValueObject(Buckets.Bucket)];
        }
    }

    return {
        code,
        data,
        error: result.error
    };
};

proto.getBucket = async function(bucket, options) {
    options = options || {};
    this.options.bucket = bucket;
    const params = this._requestBucketParams('HEAD', options);
    const result = await this.request(params);
    const { code } = result;
    const data = {};
    if (code === 404) {
        result.error = 'Not Found';
    } else if (code === 403) {
        result.error = 'Forbidden';
    }

    return {
        code,
        data,
        error: result.error
    };
};

proto.deleteBucket = async function(bucket, options) {
    options = options || {};
    this.options.bucket = bucket;
    const params = this._requestBucketParams('DELETE', options);
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

proto.getBucketACL = async function(bucket, options) {
    options = options || {};
    this.options.bucket = bucket;
    const params = this._requestBucketParams('GET', options);
    params.query = {
        acl: ''
    };
    const result = await this.request(params);
    const { code } = result;
    const { body } = result.res;
    const data = {};

    if (code !== 200) {
        result.error = this.keyValueObject(body);
    } else {
        let { Owner, AccessControlList } = body;
        if (Owner) {
            data.Owner = this.keyValueObject(Owner);
        }
        if (AccessControlList) {
            data.Grantee = AccessControlList.Grant.map((item) => {
                return this.keyValueObject(item);
            });
        }
    }

    return {
        code,
        data,
        error: result.error
    };
};

proto.putBucketACL = async function(bucket, acl, options) {
    options = options || {};
    this.options.bucket = bucket;
    const params = this._requestBucketParams('PUT', options);
    params.query = {
        acl: ''
    };
    params.headers = {
        'x-amz-acl': acl
    };
    const result = await this.request(params);
    const { code } = result;
    const { body } = result.res;
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

proto.putBucketLifecycle = async function(bucket, options) {
    options = options || {};

    if (!options.lifecycleConfig) {
        throw new Error('options.lifecycleConfig is must be.');
    }

    const xml = builder.buildObject({
        LifecycleConfiguration: options.lifecycleConfig
    });
    this.options.bucket = bucket;
    const params = this._requestBucketParams('PUT', options);
    params.query = {
        lifecycle: ''
    };
    params.body = xml;
    const result = await this.request(params);
    const { code } = result;
    const { body } = result.res;
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

proto.getBucketLifecycle = async function(bucket, options) {
    options = options || {};
    this.options.bucket = bucket;
    const params = this._requestBucketParams('GET', options);
    params.query = {
        lifecycle: ''
    };
    const result = await this.request(params);
    const { code } = result;
    const { body } = result.res;
    const { Rule } = body;
    const data = {};

    if (code !== 200) {
        result.error = this.keyValueObject(body);
    } else if (Array.isArray(Rule)) {
        data.Rule = Rule.map((item) => {
            return this.keyValueObject(item);
        });
    }
    return {
        code,
        data,
        error: result.error
    };
};

proto.getBucketPolicy = async function(bucket, options) {
    options = options || {};
    this.options.bucket = bucket;
    const params = this._requestBucketParams('GET', options);
    params.query = {
        policy: ''
    };
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

proto.putBucketPolicy = async function(bucket, options) {
    options = options || {};
    //policy
    if (!options.policy) {
        throw new Error('options.policy is must be.');
    }

    this.options.bucket = bucket;
    const params = this._requestBucketParams('PUT', options);
    params.query = {
        policy: ''
    };
    params.body = JSON.stringify(options.policy);
    const result = await this.request(params);
    let { code } = result;
    const { body } = result.res;
    const data = {};

    if (code === 204) {
        code = 200;
    } else {
        result.error = this.keyValueObject(body);
    }

    return {
        code,
        data,
        error: result.error
    };
};

proto.getBucketCors = async function(bucket, options) {
    options = options || {};
    this.options.bucket = bucket;
    const params = this._requestBucketParams('GET', options);
    params.query = {
        cors: ''
    };
    const result = await this.request(params);

    const { code } = result;
    const { body } = result.res;
    const { CORSRule } = body;
    const data = {};

    if (code !== 200) {
        result.error = this.keyValueObject(body);
    } else if (Array.isArray(CORSRule)) {
        data.CORSRule = CORSRule.map((item) => {
            return this.keyValueObject(item);
        });
    } else {
        data.CORSRule = [CORSRule];
    }

    return {
        code,
        data,
        error: result.error
    };
};

proto.putBucketCors = async function(bucket, options) {
    options = options || {};

    if (!options.CORSConfiguration) {
        throw new Error('options.CORSConfiguration is must be.');
    }

    const xml = builder.buildObject({
        CORSConfiguration: options.CORSConfiguration
    });
    this.options.bucket = bucket;
    const params = this._requestBucketParams('PUT', options);
    params.query = {
        cors: ''
    };
    params.body = xml;
    const result = await this.request(params);
    const { code } = result;
    const { body } = result.res;
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

proto.deleteBucketCors = async function(bucket, options) {
    return await this._deleteBucketFn('cors', bucket, options);
};

proto.deleteBucketLifecycle = async function(bucket, options) {
    return await this._deleteBucketFn('lifecycle', bucket, options);
};

proto._deleteBucketFn = async function(query, bucket, options) {
    options = options || {};
    this.options.bucket = bucket;
    const params = this._requestBucketParams('DELETE', options);
    params.query = {};
    params.query[query] = '';
    const result = await this.request(params);
    let { code } = result;
    const { body } = result.res;
    const data = {};

    if (code === 204) {
        code = 200;
    } else {
        result.error = this.keyValueObject(body);
    }

    return {
        code,
        data,
        error: result.error
    };
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

proto.use = function(name, region) {
    this.options.bucket = name;
    this.options.region = region || '';
    return this;
};