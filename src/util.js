'use strict';

const stream = require('stream');

function isStream(obj) {
    return obj instanceof stream.Stream;
}

function isReadable(obj) {
    return isStream(obj) && typeof obj._read === 'function' && typeof obj._readableState === 'object';
}

function isWritable(obj) {
    return isStream(obj) && typeof obj._write === 'function' && typeof obj._writableState === 'object';
}

function isDuplex(obj) {
    return isReadable(obj) && isWritable(obj);
}

const is = module.exports = {
    objToString: (obj) => {
        return Object.prototype.toString.call(obj);
    },
    typeString: (type) => {
        return `[object ${type}]`;
    },
    isArray: (arr) => {
        return Array.isArray ? Array.isArray(arr) : is.objToString(arr) === is.typeString('Array');
    },
    isRegExp: (t) => {
        return is.objToString(t) === is.typeString('RegExp');
    },
    isDate: (t) => {
        return is.objToString(t) === is.typeString('Date');
    },
    isError: (t) => {
        return is.objToString(t) === is.typeString('Error') || t instanceof Error;
    },
    isFunction: (t) => {
        return typeof t === 'function';
    },
    isNull: (t) => {
        return t === null;
    },
    isNumber: (t) => {
        return typeof t === 'number';
    },
    isString: (t) => {
        return typeof t === 'string';
    },
    isSymbol: (t) => {
        return typeof t === 'symbol';
    },
    isBoolean: (t) => {
        return typeof t === 'boolean';
    },
    isObject: (t) => {
        return typeof t === 'object' && t !== null;
    },
    isBuffer: (t) => {
        return Buffer.isBuffer.call(null, t);
    },
    isFile: (t) => {
        return typeof(File) !== 'undefined' && t instanceof File;
    },
    isPrimitive: (t) => {
        const typeList = ['boolean', 'number', 'string', 'symbol', 'undefined'];

        return t === null || typeList.indexOf(typeof t) > -1;
    }
};

is.isReadable = isReadable;
is.isWritable = isWritable;
is.isDuplex = isDuplex;
