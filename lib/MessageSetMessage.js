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

const MessageStateWrapper = require('./MessageStateWrapper.js');
const errors = require('./MessageSetMessage/errors.js');
const logger = require('./logger.js')('MessageSetMessage');

class MessageSetMessage extends MessageStateWrapper {
  /**
   * Creates a new instance of the MessageSetMessage class.
   * @constructor
   * @param {String} apiKey - the Chatbase API key to be used to authenticate
   * the request.
   * @param {String} userId - the ID of the end-user.
   */
  constructor (apiKey=null, userId=null) {
    super(apiKey, userId);
  }
  /**
   * Wrapper method preventing sending a single message which belongs to a set.
   * @function send
   * @virtual
   * @throws {CannotSendIndividualMessage}
   */
  send () {
    throw new errors.CannotSendIndividualMessage();
  }
  /**
   * Wrapper method preventing updating a single message which belongs to a set
   * @function update
   * @virtual
   * @throws {CannotUpdateIndividualMessage}
   */
  update () {
    throw new errors.CannotUpdateIndividualMessage();
  }
}

module.exports = MessageSetMessage;
