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
const MessageStateWrapper = require('../../../lib/MessageStateWrapper.js');
const errors = require('../../../lib/MessageStateWrapper/errors.js');

test('validateCreateResponse', t => {
  t.true(MessageStateWrapper.validateCreateResponse(null) instanceof 
    errors.EmptyCreateResponse
    , 'Should return an instance of the EmptyCreateResponse Error class if '
      + 'the response does not have a body'
  );
  t.true(MessageStateWrapper.validateCreateResponse({}) instanceof 
    errors.EmptyCreateResponse
    , 'Should return an instance of the EmptyCreateResponse Error class if '
      + 'the response does not have a body'
  );
  t.true(MessageStateWrapper.validateCreateResponse({body: {status: 200}}) instanceof 
    errors.BadMessageIdCreateResponse
    , 'Should return an instance of the BadMessageIdCreateResponse Error class if '
      + 'the response body does not have a message_id field'
  );
  t.true(MessageStateWrapper.validateCreateResponse({body: {message_id: 'abc', status: 500}}) instanceof
    errors.BadStatusCreateResponse
    , 'Should return an instance of the BadStatusCreateResponse Error class if '
      + 'the response body does not have a status field with the value of 200'
  );
  t.true(MessageStateWrapper.validateCreateResponse({
    body: {
      status: 200
      , message_id: 'abc'
    }
  }), 'Should return true given a valid response object');
});

test('validateUpdateResponse', t => {
  t.true(MessageStateWrapper.validateUpdateResponse(null) instanceof 
    errors.EmptyUpdateResponse
    , 'Should return an instance of the EmptyUpdateResponse Error class if '
      + 'the response does not have a body'
  );
  t.true(MessageStateWrapper.validateUpdateResponse({}) instanceof 
    errors.EmptyUpdateResponse
    , 'Should return an instance of the EmptyUpdateResponse Error class if '
      + 'the response does not have a body'
  );
  t.true(MessageStateWrapper.validateUpdateResponse(
    {body: {status: 500, error: ['test', 'test1']}}) instanceof 
    errors.FieldsFailedToUpdate
    , 'Should return an instance of the FieldsFailedToUpdate Error class if '
      + 'the response body has a status that is not 200 and an error field '
      + 'that\'s an array'
  );
  t.true(MessageStateWrapper.validateUpdateResponse(
    {body: {status: 500, error: 'test'}}) instanceof 
    errors.GenericUpdateError
    , 'Should return an instance of the GenericUpdateError Error class if '
      + 'the response body has a status that is not 200 and an error field '
      + 'that\'s a string'
  );
  t.true(MessageStateWrapper.validateUpdateResponse(
    {body: {status: 500}}) instanceof 
    errors.BadStatusUpdateResponse
    , 'Should return an instance of the BadStatusUpdateResponse Error class if '
      + 'the response body has a status that is not 200 and an error field '
      + 'that\'s not a string or array'
  );
  t.true(MessageStateWrapper.validateUpdateResponse(
    {body: {status: 200}}) instanceof 
    errors.UpdateResponseDidNotHaveUpdatedList
    , 'Should return an instance of the UpdateResponseDidNotHaveUpdatedList '
      + 'Error class if the response body does not have an updated property'
  );
  t.true(MessageStateWrapper.validateUpdateResponse({
    body: {
      status: 200
      , updated: ['intent']
    }
  }), 'Should return true given a valid response object');
});

test('extractMessageId', t => {
  t.is(MessageStateWrapper.extractMessageId(), null
    , 'Should return null not given a object');
  t.is(MessageStateWrapper.extractMessageId({}), null
    , 'Should return null given the object does contain a message_id property');
  t.is(MessageStateWrapper.extractMessageId({message_id: 123}), null
    , 'Should return null given that the value of the message_id property is'
    + ' not of type string');
  t.is(MessageStateWrapper.extractMessageId({message_id: '123'}), '123'
    , 'Should return the value of the message_id property given that it is of'
    + ' type string');
});
