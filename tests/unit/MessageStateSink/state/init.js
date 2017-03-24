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
import pick from 'lodash.pick';
import every from 'lodash.every';
const MessageStateSink = require('../../../../lib/MessageStateSink.js');
const STUB = 'STUB';
var inst;

test.beforeEach(t => inst = new MessageStateSink());

test('Accept apiKey and userId as arguments to construction', t => {
  const API_KEY = 'xyz';
  const USER_ID = 'abc';
  var constructed = new MessageStateSink(API_KEY, USER_ID);
  t.deepEqual({
    api_key: API_KEY
    , user_id: USER_ID 
  }, pick(constructed, ['api_key', 'user_id']));
});

test('apiKey and userId as null if not given as arguments to ' +
  'construction', t => {
    t.deepEqual({
      api_key: null
      , user_id: null
    }, pick(inst, ['api_key', 'user_id']));
  });

test('Update manifest in which each property is set to false', t => {
  t.false(every(inst._state.optionsManifest()));
});

test('createEntryStarted', t => t.false(inst.createEntryStarted()));

test('createEntryCompleted', t => t.false(inst.createEntryCompleted()));

test('updateEntryStarted', t => t.false(inst.updateEntryStarted()));

test('updateEntryCompleted', t => t.false(inst.updateEntryCompleted()));

test('cannotBeUpdated', t => t.false(inst.cannotBeUpdated()));

test('getCreateResponse', t => t.is(inst.getCreateResponse(), null));

test('getUpdateResponse', t => t.is(inst.getUpdateResponse(), null));
