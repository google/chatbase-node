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

class NotHandledValidationError extends Error {
  constructor () {
    super('The message cannot be set as not_handled and not be of type user.');
  }
}

class FeedbackValidationError extends Error {
  constructor () {
    super('The message cannot have feedback set if it is not of type user');
  }
}

class RequiredKeysNotSet extends Error {
  constructor (requiredKeys) {
    super(
      'One or more required fields were not set on the message, please check '
        + 'the documentation on how to set the following message fields:\n'
        + requiredKeys
    );
  }
}

module.exports = {
  NotHandledValidationError: NotHandledValidationError,
  FeedbackValidationError: FeedbackValidationError,
  RequiredKeysNotSet: RequiredKeysNotSet
};
