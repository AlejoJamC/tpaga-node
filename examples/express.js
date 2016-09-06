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
    // Use tpaga pkg to create an customer
    var response = {
        step1: 'Creating a customer using TPaga Sandbox'
    };

    // Initialize TPaga package
    TPaga.isSandbox = true;
    TPaga.privateApiKey = 'd13fr8n7vhvkuch3lq2ds5qhjnd2pdd2';
    TPaga.publicApiKey = 'pk_test_qvbvuthlvqpijnr0elmtg5jh';

    TPaga.Customer.create({
        id: 'string',
        firstName: 'string',
        lastName: 'string',
        email: 'alejandromantilla7@hotmail.com',
        gender: 'M',
        phone: 'string',
        address: {
            addressLine1: 'string',
            addressLine2: 'string',
            postalCode: 'string',
            city: {
                name: 'Bucaramanga',
                country: 'CO'
            }
        }
    }, function (err, res) {
        if(err){
            console.log('Error creating a customer');
            return;
        }
        console.log(res.toObject());
        response.step2 = res.toObject();
    });

    res.json(response);
});

app.listen(3010,  function () {
    console.log('Express.js server running on port 3010!');
});