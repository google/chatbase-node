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
const resp = {
  "all_succeeded": true
  , "responses": [{"message_id": 123, "status": "success"}]
  , "status": 200
};
var scope, eut, msg;

test.before(t => {
  nock.disableNetConnect();
  scope = nock(Transport.CREATE_SET_ENDPOINT)
    .post('')
    .once()
    .reply(200, resp);
  eut = (new MessageSet())
    .setApiKey('x')
    .setUserId('y')
    .setPlatform('z');
  msg = eut.newMessage().setMessage('abc');
});

test.after(t => {
  scope.done();
  nock.isDone();
  nock.cleanAll();
  nock.enableNetConnect();
});

test('Receiving a valid response', t => {
  return eut.sendMessageSet().then(eut => {
    t.deepEqual(eut.getCreateResponse(), resp);
    t.true(eut.createEntryStarted(), 'createEntryStarted flag should be true');
    t.true(eut.createEntryCompleted(), 'createEntryCompleted flag should be true');
  }).catch(e => console.error(e));
});
