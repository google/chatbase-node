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
const MessageLifecycleState = require('./MessageLifecycleState.js');
const merge = require('lodash.merge');

class MessageStateSink extends MessageSink {
  constructor (apiKey=null, userId=null) {
    super(apiKey, userId);
    /**
     * The internal state representation of the MessageStateSink class.
     * @type {MessageLifecycleState}
     * @private
     */
    this._state = new MessageLifecycleState();
  }
  /**
   * Wraps parent setter to determine if property being set should be
   * included in the next update payload export.
   * @function setIntent
   * @param {String} intent
   * @chainable
   */
  setIntent (intent) {
    if (this._state.createEntryCompleted() && !this._state.cannotBeUpdated()) {
      this._state.flagIntentForUpdate();
    }
    super.setIntent(intent);
    return this;
  }
  /**
   * Wraps parent setter to determine if property being set should be
   * included in the next update payload export.
   * @function setAsHandled
   * @chainable
   */
  setAsHandled () {
    if (this._state.createEntryCompleted() && !this._state.cannotBeUpdated()) {
      this._state.flagNotHandledForUpdate();
    }
    super.setAsHandled();
    return this;
  }
  /**
   * Wraps parent setter to determine if property being set should be
   * included in the next update payload export.
   * @function setAsNotHandled
   * @chainable
   */
  setAsNotHandled () {
    if (this._state.createEntryCompleted() && !this._state.cannotBeUpdated()) {
      this._state.flagNotHandledForUpdate();
    }
    super.setAsNotHandled();
    return this;
  }
  /**
   * Wraps parent setter to determine if property being set should be
   * included in the next update payload export.
   * @function setVersion
   * @param {String} version
   * @chainable
   */
  setVersion (version) {
    if (this._state.createEntryCompleted() && !this._state.cannotBeUpdated()) {
      this._state.flagVersionForUpdate();
    }
    super.setVersion(version);
    return this;
  }
  /**
   * Wraps parent setter to determine if property being set should be
   * included in the next update payload export.
   * @function setAsFeedback
   * @chainable
   */
  setAsFeedback () {
    if (this._state.createEntryCompleted() && !this._state.cannotBeUpdated()) {
      this._state.flagFeedbackForUpdate();
    }
    super.setAsFeedback();
    return this;
  }
  /**
   * Wraps parent setter to determine if property being set should be
   * included in the next update payload export.
   * @function setAsNotFeedback
   * @chainable
   */
  setAsNotFeedback () {
    if (this._state.createEntryCompleted() && !this._state.cannotBeUpdated()) {
      this._state.flagFeedbackForUpdate();
    }
    super.setAsNotFeedback();
    return this;
  }
  /**
   * Returns a boolean indicating whether or not the message creation process
   * was initiated against the service
   * @function createEntryStarted
   * @return {Boolean} - flag indicating message creation status relative to the
   * Chatbase API
   */
  createEntryStarted () {
    return this._state.createEntryStarted();
  }
  /**
   * Returns a boolean indicating whether or not the message creation process
   * was completed against the service
   * @function createEntryCompleted
   * @returns {Boolean} - flag indicating message creation completion status
   * relative to the Chatbase API
   */
  createEntryCompleted () {
    return this._state.createEntryCompleted();
  }
  /**
   * Returns a boolean indicating whether or not the message update process was
   * initiated against the service
   * @function updateEntryStarted
   * @returns {Boolean} - flag indicating message creation status relative to
   * the Chatbase API
   */
  updateEntryStarted () {
    return this._state.updateEntryStarted();
  }
  /**
   * Returns a boolean indicating whether or not the message update process was
   * completed against the service
   * @function updateEntryCompleted
   * @returns {Boolean} - flag indicating message creation status relative t
   * the Chatbase API
   */
  updateEntryCompleted () {
    return this._state.updateEntryCompleted();
  }
  /**
   * Returns a boolean indicating whether or not the message instance can be
   * updated
   * @function cannotBeUpdated
   * @returns {Boolean|Error} - false if no error has occurred otherwise will
   * return the error instance
   */
  cannotBeUpdated () {
    return this._state.cannotBeUpdated();
  }

  getCreateResponse () {
    return this._state.getCreateResponse();
  }

  getUpdateResponse () {
    return this._state.getUpdateResponse();
  }
}

module.exports = MessageStateSink;
