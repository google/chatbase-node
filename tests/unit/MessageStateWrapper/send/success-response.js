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
const resp = {
  status: 200
  , message_id: 'abc'
};
var scope, eut;

test.before(t => {
  nock.disableNetConnect();
  scope = nock(Transport.CREATE_ENDPOINT)
    .post('')
    .once()
    .reply(200, resp);
  eut = (new MessageStateWrapper('x', 'y'))
    .setPlatform('z')
    .setMessage('abc');
});

test.after(t => {
  scope.done();
  nock.isDone();
  nock.cleanAll();
  nock.enableNetConnect();
});

test('Receiving a valid response', t => {
  return eut.send().then(eut => {
    t.is(eut.message_id, resp.message_id,
      'Should propagate the message-id of the response object to the message instance');
    t.true(eut.createEntryStarted(), 'createEntryStarted flag should be true');
    t.true(eut.createEntryCompleted(), 'createEntryCompleted flag should be true');
  });
});
