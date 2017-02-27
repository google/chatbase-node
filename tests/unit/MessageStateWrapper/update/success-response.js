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
const query = {
  message_id: 'abc'
  , api_key: 'x'
};
const resp = {
  status: 200
  , updated: ['intent']
};
const intent = ['test', Date.now()].join('-');
var scope, eut;

test.before(t => {
  nock.disableNetConnect();
  scope = nock(Transport.UPDATE_ENDPOINT)
    .put('', {
      intent: intent
    })
    .query(query)
    .once()
    .reply(200, resp);
  eut = (new MessageStateWrapper(query.api_key, 'y'))
    .setMessageId(query.message_id)
    // The following two lines will trigger the intent field to be provided in
    // the update request body but they must be in order of setting completed
    // first and then setting the field that is wanted in the update body.
    .setAsCreateCompleted()
    .setIntent(intent);
});

test.after(t => {
  scope.done();
  nock.isDone();
  nock.cleanAll();
  nock.enableNetConnect();
});

test('Receiving a valid response', t => {
  return eut.update().then(eut => {
    t.true(eut.updateEntryStarted(), 'updateEntryStarted flag should be true');
    t.true(eut.updateEntryCompleted(), 'updateEntryCompleted flag should be true');
  });
});
