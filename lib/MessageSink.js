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

const isBoolean = require('lodash.isboolean');
const isString = require('lodash.isstring');
const isEmpty = require('lodash.isempty');
const isNull = require('lodash.isnull');
const pickBy = require('lodash.pickby');
const omitBy = require('lodash.omitby');
const every = require('lodash.every');
const merge = require('lodash.merge');
const pick = require('lodash.pick');
const errors = require('./MessageSink/errors.js');

const MSG_CREATE_EXPORT_KEYS = ['api_key', 'user_id', 'type', 'time_stamp', 
  'platform', 'message', 'intent', 'version', 'response_time', 'custom_session_id'];
const REQUIRED_MSG_CREATE_EXPORT_KEYS = ['api_key', 'type', 'user_id',
  'time_stamp', 'platform', 'message'];
const MSG_UPDATE_EXPORT_KEYS = ['api_key', 'message_id', 'intent',
  'feedback', 'version'];
const REQUIRED_MSG_UPDATE_EXPORT_KEYS = ['api_key', 'message_id'];

/**
 * Chatbase Message data sink. Basic data/schema validation class which can be
 * used as a structured API to creating local Chatbase Message objects and
 * validate certain content properties of these objects.
 * @class MessageSink
 */
class MessageSink {
  /**
   * Returns an enum containing the available message types that can be set on
   * each message.
   * @function messageTypes
   * @memberof MessageSink
   * @static
   * @returns ChatbaseMessageTypes
   */
  static messageTypes () {
    /**
     * Enum for Chatbase message types.
     * @name ChatbaseMessageTypes
     * @readonly
     * @enum {String}
     */
    return {
      user: 'user'
      , agent: 'agent'
    };
  }
  static extractBooleanKeysForCreate (not_handled, feedback) {
    return {
      not_handled: (not_handled === true) ? not_handled.toString()
        : null
      , feedback: (feedback === true) ? feedback.toString() : null
    };
  }
  static extractBooleanKeysForUpdate (not_handled, feedback) {
    return {
      not_handled: not_handled
      , feedback: feedback
    };
  }
  /**
   * Creates a new instance of the Message data sink.
   * @constructor
   * @param {String} apiKey - the Chatbase API key to be used to authenticate
   * the request.
   * @param {String} userId - the ID of the end-user.
   */
  constructor (apiKey=null, userId=null) {
    /**
     * REQUIRED: If left null at time of serialization will cause the serializer
     * to error.
     * The Chatbase ID of the agent.
     * @type {String}
     * @memberof MessageSink
     * @instance
     * @default null
     */
    this.api_key = apiKey;
    /**
     * REQUIRED: If left null at time of serialization will cause the serializer
     * to error.
     * The ID of the end-user.
     * @type {String}
     * @memberof MessageSink
     * @instance
     * @default null
     */
    this.user_id = userId;
    /**
     * REQUIRED: If left unchanged from its default, message will be of type
     * 'user'.
     * The message type. Possible values correspond to object options returned
     * by static Message.messageTypes function.
     * @type {String}
     * @memberof MessageSink
     * @instance
     * @default 'user'
     */
    this.type = MessageSink.messageTypes().user;
    /**
     * REQUIRED: If left unchanged from its default, message will have a
     * timestamp reflecting the time of sink instantiation.
     * MS since UNIX epoch, used to sequence messages.
     * @type {String}
     * @memberof MessageSink
     * @instance
     * @default Date.now()
     */
    this.time_stamp = Date.now().toString();
    /**
     * REQUIRED: If left null at time of serialization will cause the serializer
     * to error.
     * The messaging platform this message is being propagated from.
     * @type {String}
     * @memberof MessageSink
     * @instance
     * @default null
     */
    this.platform = null;
    /**
     * REQUIRED: If left null at time of serialization will cause the serializer
     * to error.
     * The body of the message being submitted.
     * @type {String}
     * @memberof MessageSink
     * @instance
     * @default null
     */
    this.message = null;
    /**
     * OPTIONAL: This is an optional field which will be omitted from the
     * serialized message given that its value remains unchanged from its
     * default.
     * The message intent. A unique string used to group multiple messages into
     * reports.
     * @type {String}
     * @memberof MessageSink
     * @instance
     * @default null
     */
    this.intent = null;
    /**
     * OPTIONAL: This is an optional field which will be omitted from the
     * serialized message given that its value remains unchanged from its
     * default.
     * WARNING: Set only to 'true' for message with type as 'user'. If set for
     * any other message type and/or with any other value flag will cause
     * serializer to error.
     * Flag indicating whether or not the agent was able to handle the message.
     * @type {String}
     * @memberof MessageSink
     * @instance
     * @default null
     */
    this.not_handled = false;
    /**
    * OPTIONAL: This is an optional field which will be omitted from the
     * serialized message given that its value remains unchanged from its
     * default.
     * * WARNING: Set only to 'true' for message with type as 'user'. If set for
     * any other message type and/or with any other value flag will cause
     * serializer to error.
     */
    this.feedback = false;
    /**
     * OPTIONAL: This is an optional field which will be omitted from the
     * serialized message given that its value remains unchanged from its
     * default.
     * WARNING: This field can be optionally set for both 'user' and 'agent'
     * message types.
     * The version of the agent processing the message.
     * @type {String}
     * @memberof MessageSink
     * @instance
     * @default
     */
    this.version = null;
    /**
     * REQUIRED: This field is required ONLY on attempting to update a previous
     * message.
     * The message id of the message to update with new data
     * @type {String}
     * @memberof MessageSink
     * @instance
     * @default
     */
    this.message_id = null;
    /**
     * OPTIONAL: This is an optional field which will be omitted from the
     * serialized message given that its value remains unchanged from its
     * default.
     * The response time of the agent to the user message.
     * @type {Number}
     * @memberof MessageSink
     * @instance
     * @default
     */
    this.response_time = null;

    /**
     * OPTIONAL: This is an optional field which will be omitted from the
     * serialized message given that its value remains unchanged from its
     * default.
     * The custom sessionId. A unique string used to define the scope of each individual interaction with bot.
     * @type {String}
     * @memberof MessageSink
     * @instance
     * @default null
     */
    this.custom_session_id = null;
  }
  /**
   * Sets the message instances type to user.
   * @function setAsTypeUser
   * @chainable
   */
  setAsTypeUser () {
    this.type = MessageSink.messageTypes().user;
    return this;
  }
  /**
   * Sets the message instances type to agent.
   * @function setTypeAsAgent
   * @chainable
   */
  setAsTypeAgent () {
    this.type = MessageSink.messageTypes().agent;
    return this;
  }
  /**
   * Sets the timestamp on the instance
   * @function setTimestamp
   * @chainable
   */
  setTimestamp (ts) {
    this.time_stamp = ts;
    return this;
  }
  /**
   * Sets the platform on the instance
   * @function setPlatform
   * @param {String} platform - the name of the platform
   * @chainable
   */
  setPlatform (platform) {
    this.platform = platform;
    return this;
  }
  /**
   * Sets the message on the instance 
   * @function setMessage
   * @param {String} message - the message body
   * @chainable
   */
  setMessage (message) {
    this.message = message;
    return this;
  }
  /**
   * Sets the intent on the instance
   * @function setIntent
   * @chainable
   */
  setIntent (intent) {
    this.intent = intent;
    return this;
  }
  /**
   * Sets the instances not_handled property to null; omitting it from
   * serialization
   * @function setAsHandled
   * @chainable
   */
  setAsHandled () {
    this.not_handled = false;
    return this;
  }
  /**
   * Sets the instances not_handled property as 'true'
   * @function setAsNotHandled
   * @chainable
   */
  setAsNotHandled () {
    this.not_handled = true;
    return this;
  }
  /**
   * Sets the version on the instance
   * @function setVersion
   * @chainable
   */
  setVersion (version) {
    this.version = version;
    return this;
  }
  /**
   * Sets the instances feedback property as true
   * @function setAsFeedback
   * @chainable
   */
  setAsFeedback () {
    this.feedback = true;
    return this;
  }
   /**
   * Sets the instances feedback property as false
   * @function setAsFeedback
   * @chainable
   */
  setAsNotFeedback () {
    this.feedback = false;
    return this;
  }
  /**
   * Sets the instance message_id field to the given isstring
   * @function setMessageId
   * @param {String} messageId - the message id of the message one would like to
   * update.
   * @chainable
   */
  setMessageId (messageId) {
    this.message_id = messageId;
    return this;
  }
  /**
   * Sets the instance message_id field to the given isstring
   * @function setUserId
   * @param {String} userId - the user id of the user being interacted with.
   * @chainable
   */
  setUserId (userId) {
    this.user_id = userId;
    return this;
  }
  /**
   * Sets the instance response_time field to the given number
   * @function setUserId
   * @param {Number} responseTime - the response time of the agent to the user
   *  message.
   * @chainable
   */
  setResponseTime (responseTime) {
    this.response_time = responseTime;
    return this;
  }
  /**
   * Sets the instance custom_session_id field to the given string
   * @function setCustomSessionId
   * @param {String} customSessionId - the session id of current interaction with the bot
   *
   * @chainable
   */
  setCustomSessionId (customSessionId) {
      this.custom_session_id = customSessionId;
      return this;
  }
  /**
   * Validates instance properties to determine whether or not the not_handled
   * and user fields are correctly set on the instance
   * @function validateNotHandled
   * @returns {Boolean} - returns a boolean indicating whether or not the
   *  instances not_handled properties are set properly
   */
  validateNotHandled () {
    return !this.not_handled 
      || (this.type === MessageSink.messageTypes().user);
  }
  /**
   * Validates instance properties to determine whether or not the feedback and
   * user fields are correctly set on the instance
   * @function validateFeedback
   * @returns {Boolean} - returns a boolean indicating whether or not the
   *  instances feedback properties are set properly
   */
  validateFeedback () {
    return !this.feedback
      || (this.type === MessageSink.messageTypes().user);
  }
  /**
   * Validates that the keys required for basic message creation are set on
   * the target object and that each key's value is of the correct type.
   * @function validateCreateManifest
   * @returns {Boolean} - returns a boolean indicating whether or not the
   *  instances required keys are correctly set for creation payload export
   */
  validateCreateManifest () {
    return every(pick(this, REQUIRED_MSG_CREATE_EXPORT_KEYS), isString);
  }
  /**
   * Validates that the keys required for message update are set on the target
   * object and that each key's value is of the correct type.
   * @function validateUpdateManifest
   * @returns {Boolean} - returns a boolean indicating whether or not the
   *  instances required keys are correctly set for the update payload export
   */
  validateUpdateManifest () {
    return every(pick(this, REQUIRED_MSG_UPDATE_EXPORT_KEYS), isString);
  }
  /**
   * Returns an object payload representing the instances message creation
   * information or returns an Error denoting why the instance could not be
   * exported for message creation.
   * @function exportCreatePayload
   * @returns {Object|Error} - returns either an object representing the message
   * creation payload or an error denoting why the payload could not be exported
   */
  exportCreatePayload () {
    if (!this.validateNotHandled()) {
      return new errors.NotHandledValidationError();
    } else if (!this.validateFeedback()) {
      return new errors.FeedbackValidationError();
    } else if (!this.validateCreateManifest()) {
      return new errors.RequiredKeysNotSet(
        REQUIRED_MSG_CREATE_EXPORT_KEYS.join(', '));
    }
    return omitBy(merge(
      MessageSink.extractBooleanKeysForCreate(this.not_handled, this.feedback),
      pick(this, MSG_CREATE_EXPORT_KEYS)), isNull);
  }
  /**
   * Returns an object payload representing the instances message update
   * information or returns an Error denoting why the instance could not be
   * exported for message update.
   * @function exportUpdatePayload
   * @returns {Object|Error} - returns either an object representing the message
   * update payload or an error denoting why the payload could not be exported
   */
  exportUpdatePayload () {
    if (!this.validateNotHandled()) {
      return new errors.NotHandledValidationError();
    } else if (!this.validateFeedback()) {
      return new errors.FeedbackValidationError();
    } else if (!this.validateUpdateManifest()) {
      return new errors.RequiredKeysNotSet(
        REQUIRED_MSG_UPDATE_EXPORT_KEYS.join(', '));
    }
    return omitBy(merge(pick(this, MSG_UPDATE_EXPORT_KEYS),
      MessageSink.extractBooleanKeysForUpdate(this.not_handled, this.feedback))
      , isNull);
  }
}

module.exports = MessageSink;
