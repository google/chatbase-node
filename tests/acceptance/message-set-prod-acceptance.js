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
const logger = require('../../lib/logger.js')('acceptance-message-set');
const every = require('lodash.every');

/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!!!!!!!!!!!!!!! WARNING !!!!!!!!!!!!!!!!
 * !!! THIS KEY IS REQUIRED TO BE SET IN !!!
 * !!!! ORDER TO RUN THE FOLLOWING TEST !!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
const KEY = process.env.CHATBASE_API_KEY;

function acceptanceTest (t) {
  const set = chatbase.newMessageSet()
    .setApiKey(KEY)
    .setUserId('message-set-prod-acceptance')
    .setPlatform('cb-acceptance-test-node');
  const msgOne = set.newMessage()
    .setMessage('This acceptance test went great!')
    .setIntent('book-flight')
    .setAsFeedback();
  const msgTwo = set.newMessage()
    .setMessage('This acceptance test was terrible!')
    .setIntent('book-hotel')
    .setResponseTime(5)
    .setAsNotHandled()
    .setAsFeedback();
  set.sendMessageSet()
    .then(function (set) {
      t.pass('Should create the message-set');
      t.deepEqual(set.getCreateResponse().all_succeeded, true,
        'Thee all_succeeded property should be true');
      t.deepEqual(set.getCreateResponse().responses.length, 2, 
        'There should be two create response objects in the responses array');
      t.true(every(set.getCreateResponse().responses, {status: 'success'}),
        'Every status property in responses array should be set to "success"');
      t.deepEqual(set.getCreateResponse().status, 200,
        'The create response object should have a status property with a value of'
        + ' 200');
      logger('Got response from set creation: \n %0', set.getCreateResponse());
      t.end();
    })
    .catch(function (err) {
      logger('Got Create Error:');
      logger(err);
      t.fail('Error in creating message set with API');
      t.end();
    });
}


if (isEmpty(KEY)) {
  logger('Cannot find necessary environment variables, exiting..');
  test.skip('Cannot find necessary environment variables, exiting..', acceptanceTest);
} else {
  test.cb('Authenticated create & update message lifecycle', acceptanceTest);
}
