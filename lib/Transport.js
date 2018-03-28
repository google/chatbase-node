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

const got = require('got');
const merge = require('lodash.merge');
const logger = require('./logger.js')('Transport');
const CREATE_ENDPOINT = 'https://chatbase-area120.appspot.com/api/message';
const CREATE_SET_ENDPOINT = 'https://chatbase-area120.appspot.com/api/messages';
const UPDATE_ENDPOINT = 'https://chatbase-area120.appspot.com/api/message/update';

/**
 * Transport class providing wrapped net methods which provide basic request
 * setup options.
 * @class Transport
 */
class Transport {
  /**
   * Sends a object as the JSON body to the Chatbase create URL
   * @function sendMessage
   * @static
   * @param {Object} messageBody - the message create payload
   * @param {Number} t - the TTL in milliseconds for the request
   * @returns {Promise} - returns a promise that will be resolved/rejected upon
   * request completion/error
   */
  static sendMessage (messageBody, t) {
    logger('Sending Create Message \n %O', messageBody);
    return got(
      CREATE_ENDPOINT
      , merge({
          method: 'POST'
          , timeout: t
          , json: true
          , headers: {
            'Content-Type': 'application/json'
          }
        }, {body: JSON.stringify(messageBody)})
    );
  }
  /**
   * Sends a query-string and JSON message body to the Chatbase update URL
   * @function sendUpdate
   * @static
   * @param {Object} params - single topology key-value object which will be
   * converted to a query-string
   * @param {Object} messageBody - the message update payload
   * @param {Number} t - the TTL in milliseconds for the request
   * @returns {Promise} - returns a promise that will be resolved/rejected upon
   * request completion/error
   */
  static sendUpdate (params, messageBody, t) {
    logger('Sending Update Message:');
    logger('Query \n %O', params);
    logger('Body \n %O', messageBody);
    return got(
      UPDATE_ENDPOINT
      , merge({
        method: 'PUT'
        , timeout: t
        , json: true
        , query: params
        , headers: {
          'Content-Type': 'application/json'
        }
      }, {body: JSON.stringify(messageBody)})
    );
  }
  /**
   * Sends a query-string and JSON message body to the Chatbase update URL
   * @function sendUpdate
   * @static
   * @param {Object} params - single topology key-value object which will be
   * converted to a query-string
   * @param {Object} messageBody - the message update payload
   * @param {Number} t - the TTL in milliseconds for the request
   * @returns {Promise} - returns a promise that will be resolved/rejected upon
   * request completion/error
   */
  static sendMessageSet (messageSet, t) {
    logger('Sending Create Message Set \n %O', messageSet);
    return got(
      CREATE_SET_ENDPOINT
      , merge({
        method: 'POST'
        , timeout: t
        , json: true
        , headers: {
          'Content-Type': 'application/json'
        }
      }, {body: JSON.stringify(messageSet)})
    );
  }
}

Transport.CREATE_ENDPOINT = CREATE_ENDPOINT;
Transport.CREATE_SET_ENDPOINT = CREATE_SET_ENDPOINT;
Transport.UPDATE_ENDPOINT = UPDATE_ENDPOINT;

module.exports = Transport;
