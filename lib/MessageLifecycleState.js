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

const MessageSink = require('./MessageSink.js');
const merge = require('lodash.merge');

class MessageLifecycleState {
  constructor (apiKey=null, userId=null) {
    /**
     * The internal state representation of the MessageLifecycleState class.
     * @typedef {Object} MessageLifecycleState~State
     * @property {Object} create - The state object containing interaction and
     * response details stemming from the messages registration with the
     * Chatbase service.
     * @property {Boolean} create.started - Whether or not a request to create
     * the message with the Chatbase service has been initiated.
     * @property {Boolean} create.completed - Whether or not a request to create
     * the message with the Chatbase service succeeded.
     * @property {Null|Error} create.error - Set as an instance of the Error
     * class given that an errored occured in attempting to create the message
     * with the Chatbase service.
     * @property {Null|Object} create.responseBody - The raw response body from
     * the Chatbase service when attempting to create the message with the
     * service.
     * @property {Object} update - The state object containing interaction and
     * response details stemming from the messages update on the Chatbase
     * service by the client.
     * @property {Boolean} update.started - Whether or not the update attempt
     * has been started.
     * @property {Boolean} update.completed - Whether or not the update attempt
     * was completed successfully.
     * @property {Null|Error} update.error - Set as an instance of the error
     * class given that an error has occured during the update process with the
     * service.
     * @property {Null|Object} update.responseBody - The raw response body from
     * the Chatbase service when attempting to update a the message with the
     * service.
     * @property {Object} update.optionsManifest - Key-value store of Sink 
     * properties applicable for update after message creation with service.
     * These fields are automatically set by the instance itself.
     * @property {Boolean} update.optionsManifest.intent - Flag indicating
     * whether or not the setter on the intent property was called on the
     * message instance after creation with the service, thereby making it
     * applicable for inclusion in the messages update request.
     * @property {Boolean} update.optionsManifest.not_handled - Flag indicating
     * whether or not the setter on the not_handled property was called on the
     * message instance after creation with the service, thereby making it
     * applicable for inclusion in the messages update request.
     * @property {Boolean} update.optionsManifest.version - Flag indicating
     * whether or not the setter on the version property was called on the
     * message instance after creation with the service, thereby making it
     * applicable for inclusion in the messages update request.
     * @property {Boolean} update.optionsManifest.feedback - Flag indicating
     * whether or not the setter on the feedback property was called on the
     * message instance after creation with the service, thereby making it
     * applicable for inclusion in the messages update request.
     */
    this._state = {
      create: {
        started: false
        , completed: false
        , error: null
        , responseBody: null
      }
      , update: {
        started: false
        , completed: false
        , error: null
        , responseBody: null
        , optionsManifest: {
          intent: false
          , not_handled: false
          , version: false
          , feedback: false
        }
      }
    };
  }
  /**
   * Sets the internal state object create.started property to true
   * @function setAsCreateStarted
   * @private
   * @chainable
   */
  setAsCreateStarted () {
    this._state.create.started = true;
    return this;
  }
  /**
   * Sets the internal state object create.completed property to true and sets
   * the given responseBody on the instance. Will also invoke the response
   * message id extractor.
   * @function setAsCreateCompleted
   * @private
   * @chainable
   */
  setAsCreateCompleted (responseBody) {
    this._state.create.completed = true;
    this._state.create.responseBody = responseBody;
    return this;
  }
  /**
   * Sets the internal state object create.error property to the given error.
   * @function setAsCreateErrored
   * @private
   * @chainable
   */
  setAsCreateErrored (err) {
    this._state.create.error = err;
    return this;
  }
  /**
   * Sets the internal state object update.started property to true.
   * @function setAsUpdateStarted
   * @private
   * @chainable
   */
  setAsUpdateStarted () {
    this._state.update.started = true;
    return this;
  }
  /**
   * Sets the internal state object update.completed property to true.
   * @function setAsUpdateCompleted
   * @private
   * @chainable
   */
  setAsUpdateCompleted (responseBody) {
    this._state.update.completed = true;
    this._state.update.responseBody = responseBody;
    return this;
  }
  /**
   * Sets the internal state object update.error property to the given error
   * value.
   * @function setAsUpdateErrored
   * @private
   * @chainable
   */
  setAsUpdateErrored (err) {
    this._state.update.error = err;
    return this;
  }
  /**
   * Flags the intent property to be included on the next potential update
   * payload export.
   * @function flagIntentForUpdate
   * @private
   * @chainable
   */
  flagIntentForUpdate () {
    this._state.update.optionsManifest.intent = true;
    return this;
  }
  /**
   * Flags the not_handled property to be included on the next potential update
   * payload export.
   * @function flagNotHandledForUpdate
   * @private
   * @chainable
   */
  flagNotHandledForUpdate () {
    this._state.update.optionsManifest.not_handled = true;
    return this;
  }
  /**
   * Flags the version property to be included on the next potential update
   * payload export.
   * @function flagFeedbackForUpdate
   * @private
   * @chainable
   */
  flagVersionForUpdate () {
    this._state.update.optionsManifest.version = true;
    return this;
  }
  /**
   * Flags the feedback property to be included on the next potential update
   * payload export.
   * @function flagFeedbackForUpdate
   * @private
   * @chainable
   */
  flagFeedbackForUpdate () {
    this._state.update.optionsManifest.feedback = true;
    return this;
  }
  /**
   * Returns the private state property create.started
   * @function createEntryStarted
   * @public
   * @returns {Boolean} - indicating whether or not the message create request
   * was started by the client
   */
  createEntryStarted () {
    return this._state.create.started;
  }
  /**
   * Returns the private state property create.completed
   * @function createEntryCompleted
   * @public
   * @returns {Boolean} - indicating whether or not the message create request
   * was completed successfully by the client
   */
  createEntryCompleted () {
    return this._state.create.completed;
  }
  /**
   * Returns the private state property create.error
   * @function createEntryError
   * @public
   * @returns {Null|Error} - as null indicates no error has yet occurred during
   * the message creation request. Otherwise may be an instance of Error
   * describing the error which occurred during the message creation process.
   */
  createEntryError () {
    return this._state.create.error;
  }
  /**
   * Returns the response body from the message create request
   * @function getCreateResponse
   * @public
   * @returns {Null|Object} - returns the create response body if present
   */
  getCreateResponse () {
    return this._state.create.responseBody;
  }
  /**
   * Returns the private property update.started
   * @function updateEntryStarted
   * @public
   * @returns {Boolean} - indicating whether or not the client has started the
   * message update request
   */
  updateEntryStarted () {
    return this._state.update.started;
  }
  /**
   * Returns the private property update.completed
   * @function updateEntryCompleted
   * @public
   * @returns {Boolean} - indicating whether or not the client has successfully
   * finished the message update request
   */
  updateEntryCompleted () {
    return this._state.update.completed;
  }
  /**
   * Returns the private state property update.error
   * @function updateEntryError
   * @public
   * @returns {Null|Error} - as null indicates no error has yet occurred during
   * the message update request. Otherwise may be an instance of Error
   * describing the error which occurred during the message update process.
   */
  updateEntryError () {
    return this._state.update.error;
  }
  /**
   * Returns the response body from the message update request
   * @function getUpdateResponse
   * @public
   * @returns {Null|Object} - returns the update response body if present
   */
  getUpdateResponse () {
    return this._state.update.responseBody;
  }
  /**
   * Returns a boolean indicating whether or not the message instance can be
   * updated with the service. If the message failed in creation or failed on
   * previous update the message will enter the cannotBeUpdated state wherein
   * requests to update the message instance will always locally fail before
   * reaching the transport-layer.
   * @function cannotBeUpdated
   * @public
   * @returns {Boolean} - indicating whether or not the message instance can
   * be updated
   */
  cannotBeUpdated () {
    if (this._state.create.error) {
      return this._state.create.error;
    } else if (this._state.update.error) {
      return this._state.update.error;
    }
    return false;
  }
  /**
   * Returns a new object which is a copy of the current options manifest for
   * the next update export
   * @function optionsManifest
   * @returns {Object} - a copy of the instances update.optionsManifest property
   */
  optionsManifest () {
    return merge({}, this._state.update.optionsManifest);
  }
}

module.exports = MessageLifecycleState;
