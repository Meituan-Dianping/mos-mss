'use strict';

const { MSS_APP_KEY, MSS_APP_SECRET, ENDPOINT } = process.env;

let config = {
    endpoint: ENDPOINT,
    accessKeyId: MSS_APP_KEY,
    accessKeySecret: MSS_APP_SECRET
    // signerVersion: 'default v2'
};

module.exports = config;