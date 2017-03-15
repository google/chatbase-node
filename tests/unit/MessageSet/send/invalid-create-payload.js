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
const MessageSet = require('../../../../lib/MessageSet.js');
// Errors arising in this call come from parent implmentation MessageSink
const errors = require('../../../../lib/MessageSink/errors.js');

test('Invoking send() on a message lacking necessary fields', async t => {
  const eut = new MessageSet();
  const msg = eut.newMessage();
  const error = await t.throws(eut.sendMessageSet());
  t.true(error instanceof errors.RequiredKeysNotSet,
    'The error should be an instance of the RequiredKeysNotSet class');
});
