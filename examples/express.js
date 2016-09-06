/**
 * Copyright (c) 2016-present, Alejandro Mantilla <@AlejoJamC>.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree or translated in the assets folder.
 */

'use strict';

var express = require('express');
var app = express();

var TPaga = require('../');

app.get('/', function (req, res) {
    res.send('hola!');
});

app.listen(3010,  function () {
    console.log('Express.js server running on port 3010!');
});