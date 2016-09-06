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

var _ = require('lodash');

function Resource(instance) {
    return _.extend({
        _id: null,
        path: '',
        apiKeyScope: 'private',
        children_resources: {},
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

            // Iterate children_resources
            _.each(this.children_resources, function(resource, resourceName) {

                // Iterate object json data
                _.each(this._json, function(object, key) {

                    // If children_resource and object different, next
                    if (resourceName !== key) {
                        return;
                    }

                    if (object instanceof Array) {

                        /*
                         * Iterate array object to extend from
                         * target TPaga resource and overwrite attribute
                         */
                        var children_objects = [];
                        _.each(object, function(elem) {
                            var resource_instance = _.extend({},
                                TPaga[resource]
                            );
                            children_objects.push(
                                _.extend(resource_instance, {
                                    _json: elem,
                                    _id: elem.id
                                })
                            );
                        });

                        // overwrite property
                        this[key] = children_objects;

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

        get: function(opts, id) {
            var uri = this.path;
            if (id) {
                uri += '/' + id;
            }

            if (typeof opts.data === 'function') {
                opts.next = opts.data;
                opts.data = {};
            }

            new Requestor().request({
                method: 'get',
                url: [TPaga.api_base, uri].join(''),
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
         * Method to build POST calls.
         */

        post: function(opts, id) {
            var uri = this.path;
            if (id) {
                uri += '/' + id;
            }

            new Requestor().request({
                method: 'post',
                url: [TPaga.api_base, uri].join(''),
                data: opts.data ||  {},
                next: function(error, response) {
                    if (error) {
                        return opts.next(error, null);
                    }
                    this._json = response;
                    this._id = response.id;
                    this.buildChildren();
                    opts.next(null, this);
                }.bind(this)
            });
        },

        /*
         * Method to build PUT calls,
         * temporally uncoded, TPaga doesn't support PUT methods.
         */

        /*
         * Method to build DEL calls.
         */

        del: function(opts, id) {
            var uri = this.path;
            if (id) {
                uri += '/' + id;
            }

            new Requestor().request({
                method: 'del',
                url: [TPaga.api_base, uri].join(''),
                data: opts.data ||  {},
                next: function(error, response) {
                    if (error) {
                        return opts.next(error, null);
                    }
                    this._json = response;
                    this.buildChildren();
                    opts.next(null, this);
                }.bind(this)
            });
        },

        /*
         * Method to build complex api calls
         */

        custom: function(method, customURI, opts) {
            new Requestor().request({
                method: method,
                url: [TPaga.apiBaseUrl, customURI].join(''),
                data: opts.data ||  {},
                next: opts.next
            });
        }
    }, instance);
}

module.exports = Resource;