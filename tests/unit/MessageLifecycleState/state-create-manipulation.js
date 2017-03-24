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
const MessageLifecycleState = require('../../../lib/MessageLifecycleState.js');
var inst;

test.beforeEach(t => inst = new MessageLifecycleState());

test('Invoking setAsCreateStarted', t => {
  t.is(inst.setAsCreateStarted().createEntryStarted(), true,
    'Should set the create.started property to true');
});

test('setAsCreateCompleted without responseBody', t => {
  inst.setAsCreateCompleted(null);
  t.is(inst.createEntryCompleted(), true,
    'Should have set the create.completed property to true');
  t.is(inst.getCreateResponse(), null,
    'The value of the response should be the IV given at invocation');
});

test('setAsCreateCompleted with responseBody', t => {
  const bdy = {message_id: '123'};
  inst.setAsCreateCompleted(bdy);
  t.is(inst.createEntryCompleted(), true,
    'Should have set the create.completed property to true');
  t.deepEqual(inst.getCreateResponse(), bdy,
    'The value of the response should be the IV given at invocation');
});

test('setAsCreateErrored', t => {
  const err = new Error('500');
  inst.setAsCreateErrored(err);
  t.is(inst.createEntryError(), err,
    'Should have the Error IV set as the create error');
  t.is(inst.cannotBeUpdated(), err,
    'cannotBeUpdated should return the offending error given as an IV');
});

test('cannotBeUpdated - create-derived error', t => {
  const err = new Error('500');
  t.is(inst.setAsCreateErrored(err).cannotBeUpdated(), err,
    'Should return the creation error as the return-value of invocation');
});
