/**
 * Copyright (c) 2016-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

var assert  = require('assert'),
    base64  = require('../lib/base64'),
    tpaga   = require('../lib/tpaga');

const LOCALE            = 'es',
      PUBLIC_TEST_KEY   = 'pk_test_qvbvuthlvqpijnr0elmtg5jh',
      PRIVATE_TEST_KEY  = 'd13fr8n7vhvkuch3lq2ds5qhjnd2pdd2';