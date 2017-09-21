/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

import test from 'ava';
const isEmpty = require('lodash.isempty');
const chatbase = require('../../index.js');
const logger = require('../../lib/logger.js')('integration-runner');

/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!!!!!!!!!!!!!!! WARNING !!!!!!!!!!!!!!!!
 * !!! THIS KEY IS REQUIRED TO BE SET IN !!!
 * !!!! ORDER TO RUN THE FOLLOWING TEST !!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
const KEY = process.env.CHATBASE_API_KEY;

function acceptanceTest (t) {
  chatbase.newMessage(KEY, 'user-x')
    .setPlatform('Twitter')
    .setMessage('The flight was easy to book!!')
    .setIntent('book-flight')
    .setResponseTime(1.03)
    .setAsNotHandled()
    .setAsFeedback()
    .send()
    .then(function (msg) {
      t.pass('Should create the message');
      logger('Got response from message creation: \n %O', msg.getCreateResponse());
      msg.setIntent('book-hotel')
        .update()
        .then(function (msg) {
          t.pass('Should update the message');
          logger('Got response from message update: \n %O',
            msg.getUpdateResponse());
          t.end();
        })
        .catch(function (err) {
          logger('Got Update Error:');
          logger(err);
          t.fail('Error in updating message through API');
          t.end();
        });
    })
    .catch(function (err) {
      logger('Got Create Error:');
      logger(err);
      t.fail('Error in sending message to API');
      t.end();
    });
}


if (isEmpty(KEY)) {
  logger('Cannot find necessary environment variables, exiting..');
  test.skip('Cannot find necessary environment variables, exiting..', acceptanceTest);
} else {
  test.cb('Authenticated create & update message lifecycle', acceptanceTest);
}
