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
const MessageStateWrapper = require('../../../../lib/MessageStateWrapper.js');
const errors = require('../../../../lib/MessageStateWrapper/errors.js');

test('Invoking send() on an already sent message', async t => {
  const eut = new MessageStateWrapper('x', 'y');
  eut._state.setAsCreateStarted();
  const error = await t.throws(eut.send());
  t.true(error instanceof errors.MessageHasAlreadyBeenSent,
    'The error should be an instance of the MessageHasAlreadyBeenSent class');
});
