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
const MessageFactory = require('../../lib/MessageFactory');
var inst;

test.beforeEach(t => inst = new MessageFactory());

test('Initial state', t => {
  t.is(inst.api_key, null);
  t.is(inst.user_id, null);
  t.is(inst.platform, null);
  t.is(inst.type, null);
});

test('setApiKey', t => {
  t.is(inst.setApiKey('x').api_key, 'x');
  t.is(inst.newMessage().api_key, 'x');
});

test('setUserId', t => {
  t.is(inst.setUserId('x').user_id, 'x');
  t.is(inst.newMessage().user_id, 'x');
});

test('setPlatform', t => {
  t.is(inst.setPlatform('x').platform, 'x');
  t.is(inst.newMessage().platform, 'x');
});

test('setAsTypeUser', t => {
  t.is(inst.setAsTypeUser().type, 'user');
  t.is(inst.newMessage().type, 'user');
});

test('setAsTypeAgent', t => {
  t.is(inst.setAsTypeAgent().type, 'agent');
  t.is(inst.newMessage().type, 'agent');
});

test('setVersion', t => {
  const version = '1.0.2';
  t.is(inst.setVersion(version).version, version);
  t.is(inst.newMessage().version, version);
});

test('setIntent', t => {
  const intent = 'to-test';
  t.is(inst.setIntent(intent).intent, intent);
  t.is(inst.newMessage().intent, intent);
});

test('setCustomSessionId', t => {
    t.is(inst.setCustomSessionId('x').custom_session_id, 'x');
    t.is(inst.newMessage().custom_session_id, 'x');
});

test('newMessage invocation with only api_key and user_id arguments', t => {
  const msg = inst.newMessage('x', 'y');
  t.is(msg.api_key, 'x');
  t.is(msg.user_id, 'y');
});
