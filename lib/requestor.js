/**
 * Copyright (c) 2016-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

'use strict';

/**
 * Module dependencies.
 */

var base64  = require('./base64'),
    _       = require('lodash'),
    request = require('request');

/**
 *  Module constant.
 */

var HEADERS = {
    'Authorization' : '',
    'Content-Type'  : 'application/json'
};

/**
 * This object prepare and execute all custom HTTP headers and body details.
 */

function Requestor(TPaga) {
    if(TPaga.isSandbox){
        this.apiURL = TPaga.sandboxBaseUrl;
    } else {
        this.apiURL = TPaga.apiBaseUrl;
    }

    /*
     * Call to API resources
     */

    this.request = function (opts) {
        if(!TPaga.publicApiKey || TPaga.publicApiKey === ''){
            opts.next({
                message : 'agregar mensaje local aqui',
                code    : 'public_key_required'
            }, null);
            return;
        } else if(!TPaga.privateApiKey || TPaga.privateApiKey === ''){
            opts.next({
                message : 'agregar mensaje local aqui',
                code    : 'private_key_required'
            }, null);
            return;
        }

        // Header assignation
        if(opts.apiKeyScope === 'private'){
            HEADERS.Authorization = ['Basic ', base64.encode(TPaga.privateApiKey), ':'].join('');
        } else {
            HEADERS.Authorization = ['Basic ', base64.encode(TPaga.publicApiKey), ':'].join('');
        }

        // Request package setup and usage
        var options = {
            method: opts.method,
            headers: HEADERS,
            url: opts.url
        };

        request(options, function (err, req, res) {
            // local variables
            var error   = null,
                result  = null;

            // Check if response come as a JSON
            res = typeof res == 'object' ? res : JSON.parse(res);

            // Check HTTP status codes
            if(req.statusCode !== 200 && req.statusCode !== 201 && req.statusCode !== 202 && req.statusCode !== 204){
                error = _.extend(res, {
                    httpCode : req.statusCode
                });
            } else {
                result = res;
            }

            opts.next(error, result);
        });
    };
}

module.exports = Requestor;