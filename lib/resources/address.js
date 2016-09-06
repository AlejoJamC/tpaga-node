/**
 * Copyright (c) 2016-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

'use strict';

function Address(opts) {
    this.addressLine1 = opts.addressLine1s;
    this.addressLine2 = opts.addressLine2;
    this.postalCode = opts.postalCode;
    this.city = require('./city');
}

module.exports = Address;