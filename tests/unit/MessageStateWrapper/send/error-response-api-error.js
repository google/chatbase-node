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
const MessageStateWrapper = require('../../../../lib/MessageStateWrapper.js');
const Transport = require('../../../../lib/Transport');
const errors = require('../../../../lib/MessageStateWrapper/errors.js');
var scope;

test.before(t => {
  nock.disableNetConnect();
  scope = nock(Transport.CREATE_ENDPOINT)
    .post('')
    .once()
    // Please observe the status property of the body versus the response status
    .reply(200, {status: 500});
});

test.after(t => {
  nock.isDone();
  nock.cleanAll();
  nock.enableNetConnect();
});

test('Receiving an API-specific error-body from send() invocation', async t => {
  const eut = (new MessageStateWrapper('x', 'y'))
    .setPlatform('z')
    .setMessage('abc');
  const error = await t.throws(eut.send());
  t.true(error instanceof errors.BadStatusCreateResponse,
    'The error should be an instance of the BadStatusCreateResponse class');
  t.true(eut.cannotBeUpdated().error instanceof errors.BadStatusCreateResponse);
  scope.done();
});
