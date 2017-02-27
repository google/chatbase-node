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
const MessageStateSink = require('../../../lib/MessageStateSink.js');
var inst;

test.beforeEach(t => inst = new MessageStateSink());

test('Invoking setAsUpdateStarted', t => {
  t.is(inst.setAsUpdateStarted().updateEntryStarted(), true,
    'Should set the update.started property to true');
});

test('setAsUpdateCompleted', t => {
  const bdy = {ack: true};
  inst.setAsUpdateCompleted(bdy);
  t.is(inst.updateEntryCompleted(), true,
    'Should have set the update.completed property to true');
  t.deepEqual(inst.getUpdateResponse(), bdy,
    'The value of the response should be the IV given at invocation');
});

test('setAsCreateErrored', t => {
  const err = new Error('500');
  inst.setAsUpdateErrored(err);
  t.is(inst.updateEntryError(), err,
    'Should have the Error IV set as the create error');
  t.is(inst.cannotBeUpdated(), err,
    'cannotBeUpdated should return the offending error given as an IV');
});

test('flagIntentForUpdate', t => {
  t.is(inst.flagIntentForUpdate().optionsManifest().intent, true,
    'Should set the optionsManifest.intent to the value of the IV');
});

test('flagNotHandledForUpdate', t => {
  t.is(inst.flagNotHandledForUpdate().optionsManifest().not_handled, true,
    'Should set the update optionsManifest.not_handled to the value of the IV');
});

test('flagVersionForUpdate', t => {
  t.is(inst.flagVersionForUpdate().optionsManifest().version, true,
    'Should set the update optionsManifest.version to the value of the IV');
});

test('flagFeedbackForUpdate', t => {
  t.is(inst.flagFeedbackForUpdate().optionsManifest().feedback, true,
    'Should set the update optionsManifest.feedback to the value of the IV');
});

test('cannotBeUpdated - update-derived error', t => {
  const err = new Error('500');
  t.is(inst.setAsUpdateErrored(err).cannotBeUpdated(), err,
    'Should return the update error as the return-value of invocation');
});

test('Wrapper - setIntent', t => {
  const IV = 'x';
  inst.setIntent(IV);
  t.is(inst.optionsManifest().intent, false,
    'Given that not completed optionsManifest.intent will not be set to true');
  inst.setAsCreateErrored(new Error('x'));
  inst.setAsCreateCompleted();
  inst.setIntent(IV);
  t.is(inst.optionsManifest().intent, false,
    'Given that completed but cannotBeUpdated is set to true optionsManifest.intent will not be set to true');
  inst = (new MessageStateSink()).setAsCreateCompleted();
  inst.setIntent(IV);
  t.is(inst.optionsManifest().intent, true,
    'Given that completed and successful optionsManifest.intent will be set to true');
});

test('Wrapper - setAsHandled', t => {
  inst.setAsHandled();
  t.is(inst.optionsManifest().not_handled, false,
    'Given that not completed optionsManifest.not_handled will not be set to true');
  inst.setAsCreateErrored(new Error('x'));
  inst.setAsCreateCompleted();
  inst.setAsHandled();
  t.is(inst.optionsManifest().not_handled, false,
    'Given that completed but cannotBeUpdated is set to true optionsManifest.not_handled will not be set to true');
  inst = (new MessageStateSink()).setAsCreateCompleted();
  inst.setAsHandled();
  t.is(inst.optionsManifest().not_handled, true,
    'Given that completed and successful optionsManifest.not_handled will be set to true');
});

test('Wrapper - setAsNotHandled', t => {
  inst.setAsNotHandled();
  t.is(inst.optionsManifest().not_handled, false,
    'Given that not completed optionsManifest.not_handled will not be set to true');
  inst.setAsCreateErrored(new Error('x'));
  inst.setAsCreateCompleted();
  inst.setAsNotHandled();
  t.is(inst.optionsManifest().not_handled, false,
    'Given that completed but cannotBeUpdated is set to true optionsManifest.not_handled will not be set to true');
  inst = (new MessageStateSink()).setAsCreateCompleted();
  inst.setAsNotHandled();
  t.is(inst.optionsManifest().not_handled, true,
    'Given that completed and successful optionsManifest.not_handled will be set to true');
});

test('Wrapper - setVersion', t => {
  const IV = 'x';
  inst.setVersion(IV);
  t.is(inst.optionsManifest().version, false,
    'Given that not completed optionsManifest.version will not be set to true');
  inst.setAsCreateErrored(new Error('x'));
  inst.setAsCreateCompleted();
  inst.setVersion(IV);
  t.is(inst.optionsManifest().version, false,
    'Given that completed but cannotBeUpdated is set to true optionsManifest.version will not be set to true');
  inst = (new MessageStateSink()).setAsCreateCompleted();
  inst.setVersion(IV);
  t.is(inst.optionsManifest().version, true,
    'Given that completed and successful optionsManifest.version will be set to true');
});


test('Wrapper - setAsFeedback', t => {
  inst.setAsFeedback();
  t.is(inst.optionsManifest().feedback, false,
    'Given that not completed optionsManifest.feedback will not be set to true');
  inst.setAsCreateErrored(new Error('x'));
  inst.setAsCreateCompleted();
  inst.setAsFeedback();
  t.is(inst.optionsManifest().feedback, false,
    'Given that completed but cannotBeUpdated is set to true optionsManifest.feedback will not be set to true');
  inst = (new MessageStateSink()).setAsCreateCompleted();
  inst.setAsFeedback();
  t.is(inst.optionsManifest().feedback, true,
    'Given that completed and successful optionsManifest.feedback will be set to true');
});

test('Wrapper - setAsNotFeedback', t => {
  inst.setAsNotFeedback();
  t.is(inst.optionsManifest().feedback, false,
    'Given that not completed optionsManifest.feedback will not be set to true');
  inst.setAsCreateErrored(new Error('x'));
  inst.setAsCreateCompleted();
  inst.setAsNotFeedback();
  t.is(inst.optionsManifest().feedback, false,
    'Given that completed but cannotBeUpdated is set to true optionsManifest.feedback will not be set to true');
  inst = (new MessageStateSink()).setAsCreateCompleted();
  inst.setAsNotFeedback();
  t.is(inst.optionsManifest().feedback, true,
    'Given that completed and successful optionsManifest.feedback will be set to true');
});
