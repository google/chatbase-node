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

const isString = require('lodash.isstring');
const isEmpty = require('lodash.isempty');
const pickBy = require('lodash.pickby');
const has = require('lodash.has');
const MessageStateSink = require('./MessageStateSink.js');
const Transport = require('./Transport.js');
const errors = require('./MessageStateWrapper/errors.js');
const logger = require('./logger.js')('MessageStateWrapper');

class MessageStateWrapper extends MessageStateSink {
  /**
   * Creates a new instance of the Message state wrapper.
   * @constructor
   * @param {String} apiKey - the Chatbase API key to be used to authenticate
   * the request.
   * @param {String} userId - the ID of the end-user.
   */
  constructor (apiKey=null, userId=null) {
    super(apiKey, userId);
    /** @property {Number} transport_timeout [5000] the number of Milliseconds to let a request operate for */
    this.transport_timeout = 5000;
  }
  static extractMessageId (body) {
    if (!body || !isString(body.message_id)) {
      return null;
    }
    return body.message_id;
  }
  /**
   * Validates the shape of the response to the create request provided by the
   * Chatbase API.
   * @function validateCreateResponse
   * @static
   * @param {Any} response - the response to the create request
   * @returns {Error|Boolean} - Will return true if the response is valid or an
   * instance of Error describing why the response is not valid
   */
  static validateCreateResponse (response) {
    if (!response || !response.body) {
      return new errors.EmptyCreateResponse();
    } else if (response.body.status !== 200) {
      return new errors.BadStatusCreateResponse(response.body.status);
    } else if (!response.body.message_id) {
      return new errors.BadMessageIdCreateResponse();
    }
    return true;
  }
  /**
   * Validates the shape of the response to update request provided by the
   * Chatbase API.
   * @function validateUpdateResponse
   * @static
   * @param {Any} response - the response to the update request
   * @returns {Error|Boolean} - Will return true if the response is valid or an
   * instance of Error describing why the response is not valid
   */
  static validateUpdateResponse (response) {
    if (!response || !response.body) {
      return new errors.EmptyUpdateResponse();
    } else if (response.body.status !== 200) {
      if (Array.isArray(response.body.error)) {
        return new errors.FieldsFailedToUpdate(response.body.error);
      } else if (isString(response.body.error)) {
        return new errors.GenericUpdateError(response.body.error);
      }
      return new errors.BadStatusUpdateResponse(response.body.status);
    } else if (!has(response.body, 'updated')) {
      return new errors.UpdateResponseDidNotHaveUpdatedList();
    }
    return true;
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
  /**
   * Rejection handler for update errors. Wraps parent state sink method while
   * handling logic branching.
   * @function _handleUpdateError
   * @private
   * @param {Error} error - the error that occurred during the update request
   * @param {Function} reject - the reject function for the promise given to the
   * invoking function
   * @returns {Undefined} - does not return anything
   */
  _handleUpdateError (error, reject) {
    logger(
      'Encountered an error in update request for ID ' + this.message_id + ':');
    logger(error);
    this._state.setAsUpdateErrored(error);
    return reject(error.error);
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
   * Attempts to export and send the message instance to the Chatbase service
   * for message creation.
   * @function send
   * @returns {Promise} - a promise that will be resolved or reject depending
   * upon instance exportability and Chatbase service response.
   */
  send () {
    return new Promise((resolve, reject) => {
      if (this._state.createEntryStarted()) {
        return reject(new errors.MessageHasAlreadyBeenSent());
      }
      const payload = super.exportCreatePayload();
      if (payload instanceof Error) {
        return reject(payload);
      }
      this._state.setAsCreateStarted();
      Transport.sendMessage(payload, this.transport_timeout)
        .then(response => {
          const e = MessageStateWrapper.validateCreateResponse(response);
          if (e instanceof Error) {
            return this._handleCreateError({response: response, error: e}, reject);
          }
          this._state.setAsCreateCompleted(response.body);
          this.setMessageId(
            MessageStateWrapper.extractMessageId(response.body));
          return resolve(this);
        })
        .catch(error => this._handleCreateError({error: error}, reject));
    });
  }
  /**
   * Attempts to export and send the message instance update payload to the
   * Chatbase service for message update.
   * @function update
   * @returns {Promise} - a promise that will be resolved or reject depending
   * upon instance exportability and Chatbase service response.
   */
  update () {
    return new Promise((resolve, reject) => {
      if (this._state.cannotBeUpdated()) {
        return reject(new errors.MessageCannotBeUpdated());
      } else if (!this._state.createEntryCompleted()) {
        return reject(new errors.MessageMustBeSentBeforeBeingUpdated());
      } else if (this._state.updateEntryStarted()) {
        return reject(new errors.MessageHasAlreadyBeenUpdated());
      }
      const payload = super.exportUpdatePayload();
      if (payload instanceof Error) {
        return reject(payload);
      }
      const query = {
        api_key: payload.api_key
        , message_id: payload.message_id
      };
      this._state.setAsUpdateStarted();
      const opts = this._state.optionsManifest();
      Transport.sendUpdate(query, pickBy(payload, (v, key) => opts[key]),
        this.transport_timeout)
        .then(response => {
          const e = MessageStateWrapper.validateUpdateResponse(response);
          if (e instanceof Error) {
            return this._handleUpdateError({response: response, error: e}, reject);
          }
          this._state.setAsUpdateCompleted(response.body);
          return resolve(this);
        })
        .catch(error => this._handleUpdateError({error: error}, reject));
    });
  }
}

module.exports = MessageStateWrapper;
