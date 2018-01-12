'use strict';
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';
const conf = {
    production: 'mtmss.com'
};

const endpoint = conf[process.env.NODE_ENV];

module.exports = {
    endpoint
};