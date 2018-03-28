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
const MessageSetMessage = require('./MessageSetMessage.js');
const MessageSink = require('./MessageSink.js');
const MessageLifecycleState = require('./MessageLifecycleState.js');
const MessageFactory = require('./MessageFactory.js');
const Transport = require('./Transport.js');
const last = require('lodash.last');
const every = require('lodash.every');
const transform = require('lodash.transform');
const errors = require('./MessageSet/errors.js');
const logger = require('./logger.js')('MessageSet');

/** 
 * A set of messages that will be grouped together and sent to the Chatbase
 * create API
 * @class MessageSet
 */
class MessageSet extends MessageFactory {
  static sortMixedResponsePayload (responses) {
    return transform(responses,
      function (acc, msgResp) {
        if (msgResp.status !== 'success') {
          acc.failed.push(msgResp);
        } else {
          acc.succeeded.push(msgResp);
        }
      }
      , {
        succeeded: []
        , failed: []
      }
    );
  }
  static validateCreateResponse (response) {
    if (!response || !response.body) {
      return new errors.EmptyCreateResponse();
    } else if (response.body.status !== 200) {
      return new errors.BadStatusCreateResponse(response.body.status);
    } else if (response.body.all_succeeded !== true) {
      return new errors.PartialPayloadFailure(MessageSet.
        sortMixedResponsePayload(response.body.responses));
    }
    return true;
  }
  static extractPayloadsFromMessageSet (messages) {
    var messagePayloadSet = [];
    for (var i = 0; i < messages.length; i++) {
      messagePayloadSet.push(messages[i].exportCreatePayload());
      if (last(messagePayloadSet) instanceof Error) {
        // return the error
        return last(messagePayloadSet);
      }
    }
    return messagePayloadSet;
  }
  constructor () {
    super();
    /**
     * @property {Array<MessageStateWrapper>} messages - the queued messages 
     * to be sent to the Chatbase API
     */
    this.messages = [];
    this._state = new MessageLifecycleState();
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
   * Set the custom session id for all new messages produced by the interface
   * @function setCustomSessionId
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
   * Rejection handler for creation errors. Wraps parent state sink method while
   * handling interface logic branching.
   * @function _handleCreateError
   * @private
   * @param {Error} error - the error that occurred during the create request
   * @param {Function} reject - the reject function for the promise given to the
   * invoking function
   * @returns {Undefined} - does not return anything
   */
  _handleCreateError (error, reject) {
    logger('Encountered an error in creation request:');
    logger(error);
    this._state.setAsCreateErrored(error);
    return reject(error.error);
  }
  getCreateResponse () {
    return this._state.getCreateResponse();
  }
  createEntryStarted () {
    return this._state.createEntryStarted();
  }
  createEntryCompleted () {
    return this._state.createEntryCompleted();
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
    const msg = new MessageSetMessage(key, id)
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
    this.messages.push(msg);
    return last(this.messages);
  }
  sendMessageSet () {
    return new Promise((resolve, reject) => {
      if (this._state.createEntryStarted()) {
        return reject(new errors.MessageSetHasAlreadyBeenSent());
      }
      const messagePayloadSet = MessageSet
        .extractPayloadsFromMessageSet(this.messages);
      if (messagePayloadSet instanceof Error) {
        return reject(messagePayloadSet);
      }
      this._state.setAsCreateStarted();
      Transport.sendMessageSet({messages: messagePayloadSet},
        this.transport_timeout)
        .then(response => {
          const e = MessageSet.validateCreateResponse(response);
          if (e instanceof Error) {
            return this._handleCreateError({response: response, error: e}, reject);
          }
          this._state.setAsCreateCompleted(response.body);
          return resolve(this);
        })
        .catch(error => this._handleCreateError({error: error}, reject));
    });
  }
}

module.exports = MessageSet;
