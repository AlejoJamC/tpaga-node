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
    i18n    = require('i18n'),
    _       = require('lodash'),
    request = require('request');

/**
 * Global projects constant
 */

require('dotenv').config();
var HEADERS = {
    'Authorization' : '',
    'Content-Type'  : 'application/json'
};

/**
 * TPaga main object initialized
 */

var TPaga = {
    apiBaseUrl      : process.env.API_BASE_URL,
    apiVersion      : process.env.API_VERSION,
    isSandbox       : process.env.IS_SANDBOX,
    locale          : process.env.DEFAULT_LOCALE,
    sandboxBaseUrl  : process.env.API_BASE_URL,
    publicApiKey    : '',
    privateApiKey   : ''
};

/**
 * i18n config
 */

i18n.configure({
    locales         : ['en', 'es'],
    directory       : __dirname + '/../locales',
    extension       : '.json',
    defaultLocale   : TPaga.locale
});

/**
 * This object prepare and execute all custom HTTP headers and body details.
 */

var Requestor = function () {
    if(TPaga.isSandbox){
        this.apiUrl = TPaga.sandboxBaseUrl;
    } else {
        this.apiUrl = TPaga.apiBaseUrl;
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
};

/**
 * Base object structure
 */

var Resource = function(instance) {
    return _.extend({
        _id: null,
        childrenResources: {},
        _json: {},
        _items: [],

        /*
         * Return the representation of the resource object.
         */

        toObject: function() {
            return this._json;
        },

        /*
         * Return the array with resource objects.
         */

        toArray: function() {
            var items = [];
            _.each(this._items, function(item) {
                items.push(item.toObject());
            });
            return items;
        },

        /*
         * Method to populate attributes with
         * embedded resources.
         */

        buildChildren: function() {

            // Iterate childrenResources
            _.each(this.childrenResources, function(resource, resourceName) {

                // Iterate object json data
                _.each(this._json, function(object, key) {

                    // If childrenResources and object different, next
                    if (resourceName !== key) {
                        return;
                    }

                    if (object instanceof Array) {

                        /*
                         * Iterate array object to extend from
                         * target TPaga resource and overwrite attribute
                         */
                        var childrenObjects = [];
                        _.each(object, function(elem) {
                            var resourceInstance = _.extend({},
                                TPaga[resource]
                            );
                            childrenObjects.push(
                                _.extend(resourceInstance, {
                                    _json: elem,
                                    _id: elem.id
                                })
                            );
                        });

                        // overwrite property
                        this[key] = childrenObjects;

                    } else {
                        if (object) {
                            // overwrite property
                            this[key] = _.extend(TPaga[resource], {
                                _json: object,
                                _id: object.id
                            });
                        }
                    }
                }.bind(this));

            }.bind(this));
        },

        /*
         * Method to build GET calls.
         */

        get: function(endpoint, id, opts) {
            var uri = endpoint;
            if (id) {
                uri += '/' + id;
            }

            if (typeof opts.data == 'function') {
                opts.next = opts.data;
                opts.data = {};
            }

            new Requestor().request({
                method: 'get',
                url: [(TPaga.isSandbox === false) ? TPaga.apiBaseUrl : TPaga.sandboxBaseUrl, uri].join(''),
                data: opts.data ||  {},
                next: function(error, result) {
                    if (error) {
                        return opts.next(error, null);
                    }
                    this._json = result;
                    if (id) {
                        this._id = result.id;
                    } else {
                        _.each(result, function(item) {
                            var index = _.extend(this, {
                                _json: item,
                                _id: item._id
                            });
                            this._items.push(index);
                        }.bind(this));
                    }
                    this.buildChildren();
                    opts.next(null, this);
                }.bind(this)
            });
        },

        /*
         * Method to build complex api calls
         */

        custom: function(method, customURI, apiKeyScope, opts) {
            new Requestor().request({
                apiKeyScope : apiKeyScope,
                method      : method,
                url         : [(TPaga.isSandbox === false) ? TPaga.apiBaseUrl : TPaga.sandboxBaseUrl, customURI].join(''),
                data        : opts.data ||  {},
                next        : opts.next
            });
        }
    }, instance);
};


module.exports = TPaga;