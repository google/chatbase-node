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
const MessageSink = require('../../lib/MessageSink.js');
const errors = require('../../lib/MessageSink/errors.js');
const STUB = 'STUB';
var inst;

test.beforeEach(t => inst = new MessageSink());

test('Should set the type as user', t => {
  t.is(inst.setAsTypeUser().type, MessageSink.messageTypes().user);
});

test('Should set the type as agent', t => {
  t.is(inst.setAsTypeAgent().type, MessageSink.messageTypes().agent);
});

test('Should set the timestamp to the given value', t => {
  const ts = Date.now().toString();
  t.is(inst.setTimestamp(ts).time_stamp, ts);
});

test('Should set the user id to the given value', t => {
  const user_id = "123-abc";
  t.is(inst.setUserId(user_id).user_id, user_id);
});

test('Should allow chaining of set message to user_id', t => {
  // Regression: https://github.com/google/chatbase-node/issues/1
  try {
    inst.setAsTypeUser()
        .setPlatform('New Line Cinema')
        .setVersion('Rebobinados')
        .setTimestamp(Date.parse('22 February 2008').toString())
        .setMessage('Be kind please rewind')
        .setUserId('Jack Black');
  } catch (e) {
    t.fail("Should not throw");
    return;
  }
  t.pass("Should not throw");
});

test('Should set the platform to the given value', t => {
  t.is(inst.setPlatform(STUB).platform, STUB);
});

test('Should set the message to the given value', t => {
  t.is(inst.setMessage(STUB).message, STUB);
});

test('Should set the intent to the given value', t => {
  t.is(inst.setIntent(STUB).intent, STUB);
});

test('Should set the response time to the given value', t => {
  const r = 1.23
  t.is(inst.setResponseTime(r).response_time, r);
});

test('Should set the instance as not handled', t => {
  t.is(inst.setAsHandled().not_handled, false);
});

test('Should set the instance as handled', t => {
  t.is(inst.setAsNotHandled().not_handled, true);
});

test('Should set the version to the given value', t => {
  t.is(inst.setVersion(STUB).version, STUB);
});

test('Should set instance feedback flag to true', t => {
  t.is(inst.setAsFeedback().feedback, true);
});

test('Should set the instance feedback flag to false', t => {
  t.is(inst.setAsNotFeedback().feedback, false);
});

test('Should set the message id on the instance', t => {
  t.is(inst.setMessageId(STUB).message_id, STUB);
});

test('validateNotHandled should return true given not_handled is false', t => {
  t.is(inst.setAsHandled().validateNotHandled(), true);
});

test(
  'validateNotHandled should return true given not_handled is true and type is user',
  t => {
    t.is(inst.setAsTypeUser().setAsNotHandled().validateNotHandled(), true);
  }
);

test(
  'validateNotHandled should return false given not_handled is true and type is agent',
  t => {
    t.is(inst.setAsTypeAgent().setAsNotHandled().validateNotHandled(), false);
  }
);

test('validateFeedback should return true given feedback is false', t => {
  t.is(inst.setAsNotFeedback().validateFeedback(), true);
});

test(
  'validateFeedback should return true given feedback is true and type is user',
  t => {
    t.is(inst.setAsTypeUser().setAsFeedback().validateFeedback(), true);
  }
);

test(
  'validateFeedback should return false given feedback is true and type is agent',
  t => {
    t.is(inst.setAsTypeAgent().setAsFeedback().validateFeedback(), false);
  }
);

test('validateCreateManifest should return false on a new instance', t => {
  t.is(inst.validateCreateManifest(), false);
});

test('validateCreateManifest should return true when all required string are set',  t => {
  inst.api_key = STUB;
  inst.user_id = STUB;
  t.is(inst.setPlatform(STUB).setMessage(STUB).validateCreateManifest(), true);
});

test('validateUpdateManifest should return false on an instance with api_key and message_id set', t => {
  t.is(inst.validateUpdateManifest(), false);
});

test('validateUpdateManifest should return true on an instance with api_key and message_id set', t => {
  inst.api_key = STUB;
  t.is(inst.setMessageId(STUB).validateUpdateManifest(), true);
});

test('exportCreatePayload should return a not handled error if applicable', t => {
  var e = inst.setAsNotHandled().setAsTypeAgent().exportCreatePayload();
  t.true(e instanceof errors.NotHandledValidationError);
});

test('exportCreatePayload should return a feedback error if applicable', t => {
  var e = inst.setAsFeedback().setAsTypeAgent().exportCreatePayload();
  t.true(e instanceof errors.FeedbackValidationError);
});

test('exportCreatePayload should return a feedback error if required keys are not set', t => {
  var e = inst.exportCreatePayload();
  t.true(e instanceof errors.RequiredKeysNotSet);
});

test('exportCreatePayload should return a valid payload given the proper fields are set', t => {
  var expected = {
    user_id: STUB
    , api_key: STUB
    , type: MessageSink.messageTypes().user
    , time_stamp: Date.now().toString()
    , platform: STUB
    , message: STUB
    , intent: STUB
    , version: STUB
  };
  inst.user_id = expected.user_id;
  inst.api_key = expected.api_key;
  inst.setTimestamp(expected.time_stamp).setPlatform(expected.platform)
    .setMessage(expected.message).setIntent(expected.intent)
    .setVersion(expected.version);
  t.deepEqual(inst.exportCreatePayload(), expected);
});

test('exportUpdatePayload should return a not handled error if applicable', t => {
  var e = inst.setAsNotHandled().setAsTypeAgent().exportUpdatePayload();
  t.true(e instanceof errors.NotHandledValidationError);
});

test('exportUpdatePayload should return a feedback error if applicable', t => {
  var e = inst.setAsFeedback().setAsTypeAgent().exportUpdatePayload();
  t.true(e instanceof errors.FeedbackValidationError);
});

test('exportUpdatePayload should return a feedback error if required keys are not set', t => {
  var e = inst.exportUpdatePayload();
  t.true(e instanceof errors.RequiredKeysNotSet);
});

test('exportUpdatePayload should return a valid payload given the proper fields are set', t => {
  var expected = {
    api_key: STUB
    , 'message_id': STUB
    , feedback: false
    , not_handled: false
  };
  inst.api_key = expected.api_key;
  t.deepEqual(
    inst.setMessageId(expected.message_id).exportUpdatePayload(), expected);
});

test('extractBooleanKeysForCreate should return stringified versions of true bools', t => {
  t.deepEqual(
    MessageSink.extractBooleanKeysForCreate(true, true)
    , {
      not_handled: 'true'
      , feedback: 'true'
    }
  );
});

test('extractBooleanKeysForCreate should return null if not true bools', t => {
  t.deepEqual(
    MessageSink.extractBooleanKeysForCreate(false, 'true')
    , {
      not_handled: null
      , feedback: null
    }
  );
});
