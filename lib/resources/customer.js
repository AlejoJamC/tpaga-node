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

 function Customer(options, Resource) {
     var customer = new Resource({
         classUrl: '/customers',
         children_resources: {
             'cards': 'Card',
             'subscription': 'Subscription'
         },
         where: function(data, next) {
             this.get({
                 data: data,
                 next: next
             });
         },
         find: function(id, next) {
             this.get({
                 next: next
             }, id);
         },
         create: function(data, next) {
             this.post({
                 data: data,
                 next: next
             });
         },
         update: function(data, next) {
             this.put({
                 data: data,
                 next: next
             }, this._id);
         },
         delete: function(next) {
             this.del({
                 data: {},
                 next: next
             }, this._id);
         },
         createCard: function(data, next) {
             this.custom('post', [this.classUrl, this._id, 'cards'].join('/'), {
                 data: data,
                 next: function(err, res) {
                     if (err) {
                         return next(err, null);
                     }
                     this._json.cards.push(res);
                     this.buildChildren();
                     var card = _.extend(Card, {
                         _json: res,
                         _id: res.id
                     });
                     next(null, card);
                 }.bind(this)
             });
         },
         createSubscription: function(data, next) {
             this.custom('post', [this.classUrl, this._id, 'subscription'].join('/'), {
                 data: data,
                 next: function(err, res) {
                     if (err) {
                         return next(err, null);
                     }
                     this._json.subscription = res;
                     this.buildChildren();
                     var subscription = _.extend(Subscription, {
                         _json: res,
                         _id: res.id
                     });
                     next(null, subscription);
                 }.bind(this)
             });
         }
     });

     return customer;
 }

module.exports = Customer;