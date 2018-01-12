'use strict';

let assert = require('assert');
let fs = require('fs');
let path = require('path');
let stream = require('stream');

let duplexStream = new stream.Duplex;

let filePath = path.join(__dirname, './data/test.txt');

let readStream = fs.createReadStream(filePath);

let writeStream = fs.createWriteStream(path.join(__dirname, './data/test.txt'));

let util = require('../src/util');
describe('test util', () => {
    it('objToString and typeString', done => {
        assert.equal(util.objToString([]), '[object Array]');
        assert.equal(util.objToString([]), util.typeString('Array'));
        done();
    });
    let itArr = [
        {
            fn: 'isArray',
            input: [],
            should: true
        },
        {
            fn: 'isRegExp',
            input: /test/,
            should: true
        },
        {
            fn: 'isDate',
            input: new Date,
            should: true
        },
        {
            fn: 'isError',
            input: new Error('test'),
            should: true
        },
        {
            fn: 'isFunction',
            input: function() {},
            should: true
        },
        {
            fn: 'isNull',
            input: null,
            should: true
        },
        {
            fn: 'isNumber',
            input: 1,
            should: true
        },
        {
            fn: 'isString',
            input: 'test',
            should: true
        },
        {
            fn: 'isSymbol',
            input: Symbol(1),
            should: true
        },
        {
            fn: 'isBoolean',
            input: true,
            should: true
        },
        {
            fn: 'isObject',
            input: {},
            should: true
        },
        {
            fn: 'isBuffer',
            input: new Buffer('test'),
            should: true
        },
        {
            fn: 'isPrimitive',
            input: undefined,
            should: true
        },
        {
            fn: 'isWritable',
            input: writeStream,
            should: true
        },
        {
            fn: 'isReadable',
            input: readStream,
            should: true
        },
        {
            fn: 'isDuplex',
            input: duplexStream,
            should: true
        }
    ];
    itArr.forEach(item => {
        it(item.fn, done => {
            assert.equal(util[item.fn](item.input), item.should);
            done();
        });
    });
});