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
const MessageSink = require('./MessageSink.js');

/** 
 * Class which can produce and default select message fields to user-provided
 * input.
 * @class MessageFactory
 */
class MessageFactory {
  constructor () {
    /** @property {Null|String} api_key - the Chatbase api key */
    this.api_key = null;
    /** @property {Null|String} user_id - the Chatbase user id */
    this.user_id = null;
    /** @property {Null|String} platform - origin platform */
    this.platform = null;
    /** @property {Null|ChatbaseMessageTypes} type - Chatbase message types */
    this.type = null;
    /** @property {Null|String} version - the bot version */
    this.version = null;
    /** @property {Null|String} intent - the dialog intent */
    this.intent = null;
    /** @property {Null|String} custom_session_id - the session id*/
    this.custom_session_id = null;
    /** @property {Number} transport_timeout [5000] the number of Milliseconds to let a request operate for */
    this.transport_timeout = 5000;
  }
  /**
   * Set the API Key field for all new messages produced by this interface
   * @function setApiKey
   * @param {String} apiKey - the Chatbase API key
   * @chainable
   */
  setApiKey (apiKey) {
    this.api_key = apiKey;
    return this;
  }
  /**
   * Set the user id field for all new messages produced by this interface
   * @function setUserId
   * @param {String} userId - the user id for this client instance
   * @chainable
   */
  setUserId (userId) {
    this.user_id = userId;
    return this;
  }
  /**
   * Set the platform field for all new messages produced by the interface
   * @function setPlatform
   * @param {String} platform - the platform the client is operating on
   * @chainable
   */
  setPlatform (platform) {
    this.platform = platform;
    return this;
  }
  /**
   * Set the user type field for all new messages produced by the interface
   * @function setAsTypeUser
   * @chainable
   */
  setAsTypeUser () {
    this.type = MessageSink.messageTypes().user;
    return this;
  }
  /**
   * Set the user type field for all new messages produced by the interface
   * @function setAsTypeAgent
   * @chainable
   */
  setAsTypeAgent () {
    this.type = MessageSink.messageTypes().agent;
    return this;
  }
  /**
   * Set the version for all new messages produced by the interface
   * @function setVersion
   * @chainable
   */
  setVersion (version) {
    this.version = version;
    return this;
  }
  /**
   * Set the intent for all new messages produced by the interface
   * @function setInent
   * @chainable
   */
  setIntent (intent) {
    this.intent = intent;
    return this;
  }
  /**
   * Set the customSessionId field for all new messages produced by the interface
   * @function setCustomSessionId
   * @param {String} customSessionId - the session id of current bot conversation
   * @chainable
   */
  setCustomSessionId (customSessionId) {
      this.custom_session_id = customSessionId;
      return this;
  }
  /**
   * Set the timeout for requests to the Chatbase API.
   * @function setClientTimeout
   * @param {Number} customSessionId - the session id of current bot conversation
   * @chainable
   */
  setClientTimeout (t) {
    this.transport_timeout = t;
    return this;
}
  /**
   * Create a new message instance which will have any default values set on
   * the interface by any applicable setters exposed publically. Optionally, API
   * key and User Id can be supplied at function invocation to override any
   * values set for these fields on the interface.
   * @function newMessage
   * @param {String} [apiKey] - the Chatbase API key
   * @param {String} [userId] - the Chatbase user id
   * @returns {MessageStateWrapper} - a new instance of MessageStateWrapper
   */
  newMessage (apiKey=null, userId=null) {
    const key = apiKey ? apiKey : this.api_key;
    const id = userId ? userId  : this.user_id;
    const msg = new MessageStateWrapper(key, id)
      .setPlatform(this.platform)
      .setVersion(this.version)
      .setIntent(this.intent)
      .setCustomSessionId(this.custom_session_id)
      .setClientTimeout(this.transport_timeout);
    if (this.type === MessageSink.messageTypes().agent) {
      msg.setAsTypeAgent();
    } else if (this.type === MessageSink.messageTypes().user) {
      msg.setAsTypeUser();
    }
    return msg;
  }
}

module.exports = MessageFactory;
