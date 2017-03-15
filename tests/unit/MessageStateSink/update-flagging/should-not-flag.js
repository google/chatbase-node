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

test('intent for update without state prerequisites', t => {
  t.is(inst.setIntent(STUB).intent, STUB);
  t.deepEqual(pick(inst._state.optionsManifest(), ['intent']), {
    intent: false
  });
});
test('intent while in state cannotBeUpdated', t => {
  inst._state.setAsCreateCompleted();
  inst._state.setAsCreateErrored(new Error(STUB));
  t.is(inst.setIntent(STUB).intent, STUB);
  t.deepEqual(pick(inst._state.optionsManifest(), ['intent']), {
    intent: false
  });
});

test('not_handled for update without state prerequisites', t => {
  t.is(inst.setAsHandled().not_handled, false);
  t.deepEqual(pick(inst._state.optionsManifest(), ['not_handled']), {
    not_handled: false
  });
});
test('not_handled while in state cannotBeUpdated', t => {
  inst._state.setAsCreateCompleted();
  inst._state.setAsCreateErrored(new Error(STUB));
  t.is(inst.setAsHandled().not_handled, false);
  t.deepEqual(pick(inst._state.optionsManifest(), ['not_handled']), {
    not_handled: false
  });
});

test('not_handled for update without state prerequisites', t => {
  t.is(inst.setAsNotHandled().not_handled, true);
  t.deepEqual(pick(inst._state.optionsManifest(), ['not_handled']), {
    not_handled: false
  });
});
test('not_handled while in state cannotBeUpdated', t => {
  inst._state.setAsCreateCompleted();
  inst._state.setAsCreateErrored(new Error(STUB));
  t.is(inst.setAsNotHandled().not_handled, true);
  t.deepEqual(pick(inst._state.optionsManifest(), ['not_handled']), {
    not_handled: false
  });
});

test('version for update without state prerequisites', t => {
  t.is(inst.setVersion(STUB).version, STUB);
  t.deepEqual(pick(inst._state.optionsManifest(), ['version']), {
    version: false
  });
});
test('version while in state cannotBeUpdated', t => {
  inst._state.setAsCreateCompleted();
  inst._state.setAsCreateErrored(new Error(STUB));
  t.is(inst.setVersion(STUB).version, STUB);
  t.deepEqual(pick(inst._state.optionsManifest(), ['version']), {
    version: false
  });
});

test('feedback for update without state prerequisites', t => {
  t.is(inst.setAsFeedback().feedback, true);
  t.deepEqual(pick(inst._state.optionsManifest(), ['feedback']), {
    feedback: false
  });
});
test('feedback while in state cannotBeUpdated', t => {
  inst._state.setAsCreateCompleted();
  inst._state.setAsCreateErrored(new Error(STUB));
  t.is(inst.setAsFeedback().feedback, true);
  t.deepEqual(pick(inst._state.optionsManifest(), ['feedback']), {
    feedback: false
  });
});

test('feedback for update without state prerequisites', t => {
  t.is(inst.setAsNotFeedback().feedback, false);
  t.deepEqual(pick(inst._state.optionsManifest(), ['feedback']), {
    feedback: false
  });
});
test('feedback while in state cannotBeUpdated', t => {
  inst._state.setAsCreateCompleted();
  inst._state.setAsCreateErrored(new Error(STUB));
  t.is(inst.setAsNotFeedback().feedback, false);
  t.deepEqual(pick(inst._state.optionsManifest(), ['feedback']), {
    feedback: false
  });
});
