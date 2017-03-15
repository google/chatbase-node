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

test('create.started', t => {
  t.is(inst.createEntryStarted(), false, 'should be false');
});

test('create.completed', t => {
  t.is(inst.createEntryCompleted(), false, 'should be false');
});

test('create.error', t => {
  t.is(inst.createEntryError(), null, 'should be null');
});

test('create.responseBody', t => {
  t.is(inst.getCreateResponse(), null, 'should be null');
});

test('update.started', t => {
  t.is(inst.updateEntryStarted(), false, 'should be false');
});

test('update.completed', t => {
  t.is(inst.updateEntryCompleted(), false, 'should be false');
});

test('update.cannotBeUpdated', t => {
  t.is(inst.cannotBeUpdated(), false, 'should be false');
});

test('update.error', t => {
  t.is(inst.updateEntryError(), null, 'should be null');
});

test('update.responseBody', t => {
  t.is(inst.getUpdateResponse(), null, 'should be null');
});

test('update.optionsManifest', t => {
  t.deepEqual(inst.optionsManifest(), {
    intent: false
    , not_handled: false
    , version: false
    , feedback: false
  }, 'Each optionsManifest property should be set as false');
});
