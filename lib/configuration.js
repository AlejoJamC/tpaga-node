/**
 * Copyright (c) 2016-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

'use strict';

/**
 *  Projects constant.
 */

require('dotenv').config();

var apiBaseUrl      = (process.env.IS_SANDBOX) ? process.env.SANDBOX_BASE_URL : process.env.PRODUCTION_BASE_URL;
var defaultOptions  = {
    apiBaseUrl      : apiBaseUrl,
    apiVersion      : process.env.API_VERSION,
    locale          : process.env.DEFAULT_LOCALE,
    publicApiKey    : '',
    privateApiKey   : ''
};
var sdkVersion      = require('../package.json').version;

exports.sdkVersion =  sdkVersion;
exports.defaultOptions = defaultOptions;