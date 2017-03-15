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
const nock = require('nock');
const MessageSet = require('../../../../lib/MessageSet.js');
const Transport = require('../../../../lib/Transport');
const errors = require('../../../../lib/MessageSet/errors.js');
var scope;

test.before(t => {
  nock.disableNetConnect();
  scope = nock(Transport.CREATE_SET_ENDPOINT)
    .post('')
    .once()
    // On a transport-level error status-code the promises catch is invoked
    // instead of the then handler creating two immediatley-divergent error
    // paths.
    .reply(500);
});

test.after(t => {
  nock.isDone();
  nock.cleanAll();
  nock.enableNetConnect();
});

test('Receiving a Transport-specific error status-code from send() invocation', async t => {
  const eut = (new MessageSet()).setApiKey('x').setUserId('y').setPlatform('z');
  const msg = eut.newMessage().setMessage('abc');
  const error = await t.throws(eut.sendMessageSet());
  t.is(error.name, 'HTTPError',
    'The error should be a generic HTTPError instance');
  scope.done();
});
