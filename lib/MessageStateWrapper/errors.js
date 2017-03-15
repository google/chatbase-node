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

class EmptyCreateResponse extends Error {
  constructor () {
    super([
      'The service returned an empty response when creating the entry.'
      , 'The status and message-id of the entry are unknown; the entry,'
      , 'therefore, cannot be updated.'
    ].join('\n'));
  }
}

class BadMessageIdCreateResponse extends Error {
  constructor () {
    super([
      'The service returned a response with an empty or invalid message-id.',
      'The entry cannot be updated.'
    ].join('\n'));
  }
}

class BadStatusCreateResponse extends Error {
  constructor (status) {
    super('The service returned a create response with an empty or bad status: '
      + status);
  }
}

class MessageHasAlreadyBeenUpdated extends Error {
  constructor () {
    super('This message has already been updated');
  }
}

class MessageHasAlreadyBeenSent extends Error {
  constructor () {
    super('This message has already been sent');
  }
}

class MessageCannotBeUpdated extends Error {
  constructor () {
    super('This message cannot be updated due to a prior error in creation');
  }
}

class EmptyUpdateResponse extends Error {
  constructor () {
    super([
      'The service returned an empty response when creating the entry.'
      , 'The status of the update is therefore unknown.'
    ].join('\n'))
  }
}

class BadStatusUpdateResponse extends Error {
  constructor (status) {
    super(
      'The service returned an update response with an empty or bad status: '
      + status);
  }
}

class FieldsFailedToUpdate extends Error {
  constructor (fields) {
    super('The service reported that specific fields failed to update: \n\t'
      + fields.join('\n\t'));
  }
}

class GenericUpdateError extends Error {
  constructor (serviceError) {
    super('The service returned an error on update: ' + serviceError);
  }
}

class UpdateResponseDidNotHaveUpdatedList extends Error {
  constructor () {
    super([
      'The service responded without providing an "updated" field in the'
      , 'response. Certain fields may not have actually updated.'
    ].join('\n'));
  }
}

class MessageMustBeSentBeforeBeingUpdated extends Error {
  constructor () {
    super([
      'The message cannot be updated before it is first sent to the service.'
      , 'Please try calling send first.'
    ].join('\n'));
  }
}

module.exports = {
  EmptyCreateResponse: EmptyCreateResponse
  , BadMessageIdCreateResponse: BadMessageIdCreateResponse
  , BadStatusCreateResponse: BadStatusCreateResponse
  , MessageHasAlreadyBeenUpdated: MessageHasAlreadyBeenUpdated
  , MessageHasAlreadyBeenSent: MessageHasAlreadyBeenSent
  , MessageCannotBeUpdated: MessageCannotBeUpdated
  , EmptyUpdateResponse: EmptyUpdateResponse
  , BadStatusUpdateResponse: BadStatusUpdateResponse
  , FieldsFailedToUpdate: FieldsFailedToUpdate
  , GenericUpdateError: GenericUpdateError
  , UpdateResponseDidNotHaveUpdatedList: UpdateResponseDidNotHaveUpdatedList
  , MessageMustBeSentBeforeBeingUpdated: MessageMustBeSentBeforeBeingUpdated
};
