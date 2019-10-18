'use strict';
const conf = {
    production: 'mtmss.com'
};

const endpoint = conf[process.env.NODE_ENV || 'production'];

module.exports = {
    endpoint
};