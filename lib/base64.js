/**
 * Copyright (c) 2016-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

'use strict';

/*
 * Simple implementation of base64 encoding using node.js Buffers.
 *
 * @param unencoded {String | Buffer} String/buffer to encode.
 * @return {String} Base64 string encoded.
 */
exports.encode = function (unencoded) {
    var buff;
    if (Buffer.isBuffer(unencoded)) {
        buff = unencoded;
    } else if (typeof unencoded === typeof('')) {
        buff = new Buffer(unencoded, 'utf8');
    } else {
        throw new Error('Expected string of buffer, instead got `' + typeof(unencoded) + '`');
    }
    return buff.toString('base64');
};

/*
 * Simple implementation of base64 decoding using node.js Buffers.
 *
 * @param encoded {String | Buffer} Base64 string encoded.
 * @return {String} Returns a string from the Buffer data using utf8 encoding format.
 */
exports.decode = function (encoded) {
    return new Buffer(encoded || '', 'base64').toString('utf8');
};