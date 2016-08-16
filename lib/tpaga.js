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
    os      = require('os'),
    request = require('request');

/**
 * Global projects constant
 */

require('dotenv').config();

/**
 * i18n config
 */

i18n.configure({
    locales     : ['en', 'es'],
    directory   : __dirname + '/../locales'
});

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