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
const isFunction = require('lodash.isfunction');
const logger = require('../../lib/logger.js');

test('logger factory functionality', t => {
  var inst = logger('test');
  t.true(isFunction(logger), 'The logger module should export a function');
  t.is(inst.name, 'debug',
    'Invoking the function should return an instance of the debug module');
  t.notThrows(() => logger(),
    'Should be able to create an instance of the logger without providing a namespace');
});
