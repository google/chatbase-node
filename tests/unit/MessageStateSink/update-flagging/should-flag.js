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
const MessageStateSink = require('../../../../lib/MessageStateSink.js');
const STUB = 'STUB';
var inst;

test.beforeEach(t => inst = new MessageStateSink());

test('intent while in state createCompleted w/o error', t => {
  inst._state.setAsCreateCompleted();
  t.is(inst.setIntent(STUB).intent, STUB);
  t.deepEqual(pick(inst._state.optionsManifest(), ['intent']), {
    intent: true
  });
});

test('not_handled while in state createCompleted w/o error', t => {
  inst._state.setAsCreateCompleted();
  t.is(inst.setAsHandled().not_handled, false);
  t.deepEqual(pick(inst._state.optionsManifest(), ['not_handled']), {
    not_handled: true
  });
});
test('not_handled while in state createCompleted w/o error', t => {
  inst._state.setAsCreateCompleted();
  t.is(inst.setAsNotHandled().not_handled, true);
  t.deepEqual(pick(inst._state.optionsManifest(), ['not_handled']), {
    not_handled: true
  });
});

test('version while in state createCompleted w/o error', t => {
  inst._state.setAsCreateCompleted();
  t.is(inst.setVersion(STUB).version, STUB);
  t.deepEqual(pick(inst._state.optionsManifest(), ['version']), {
    version: true
  });
});

test('feedback while in state createCompleted w/o error', t => {
  const response = {test: true};
  inst._state.setAsCreateCompleted(response);
  t.is(inst.setAsFeedback().feedback, true);
  t.deepEqual(pick(inst._state.optionsManifest(), ['feedback']), {
    feedback: true
  });
  t.is(inst.getCreateResponse(), response);
});

test('feedback while in state createCompleted w/o error', t => {
  inst._state.setAsCreateCompleted();
  t.is(inst.setAsNotFeedback().feedback, false);
  t.deepEqual(pick(inst._state.optionsManifest(), ['feedback']), {
    feedback: true
  });
});

test('getUpdateResponse API wrapper', t => {
  const respCreate = {test: true};
  const respUpdate = {test: false};
  inst._state.setAsCreateCompleted(respCreate);
  inst._state.setAsUpdateCompleted(respUpdate);
  t.is(inst.getCreateResponse(), respCreate);
  t.is(inst.getUpdateResponse(), respUpdate);
});
