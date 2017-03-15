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

class MessageSetHasAlreadyBeenSent extends Error {
  constructor () {
    super('The message set has already been sent for creation to the service');
  }
}

class EmptyCreateResponse extends Error {
  constructor () {
    super([
      'The service returned an empty response when creating the message set.'
      , 'The status of the message set is unknown; and cannot be updated.'
    ].join('\n'));
  }
}

class BadStatusCreateResponse extends Error {
  constructor (status) {
    super('The service returned a create response with an empty or bad status: '
      + status);
  }
}

class PartialPayloadFailure extends Error {
  constructor (payload) {
    super([
      'The service returned a partial success response for message set'
      , 'creation. Messages that failed in creation will not be eligible for'
      , 'subsequent updating.'
    ].join('\n'))
    this.response = payload;
  }
}

module.exports = {
  MessageSetHasAlreadyBeenSent: MessageSetHasAlreadyBeenSent
  , EmptyCreateResponse: EmptyCreateResponse
  , BadStatusCreateResponse: BadStatusCreateResponse
  , PartialPayloadFailure: PartialPayloadFailure
};
