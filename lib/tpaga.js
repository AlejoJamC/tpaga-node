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

var api = require('./api'),
    configuration = require('./configuration'),
    i18n    = require('i18n');

/**
 * TPaga main function.
 */

function TPaga() {
    /*
     * i18n config.
     */

    i18n.configure({
        locales         : ['en', 'es'],
        directory       : __dirname + '/../locales',
        extension       : '.json',
        defaultLocale   : TPaga.locale
    });

    function configure(opts) {
        api.configure(opts);
    }


}

module.exports = TPaga;