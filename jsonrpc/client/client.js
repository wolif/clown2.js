/* eslint-disable no-unused-vars */
const { EventEmitter } = require('events');
const Call = require('./call/call');
const Factory = require('./call/factory');

class Client extends EventEmitter {
  /**
   * @param {Factory} factory
   */
  constructor(factory) {
    super();
    this.factory = factory;
  }

  /**
   * call method
   * @param {string} method
   * @param {Array} args
   * @returns {Call}
   */
  call(method, args) {
    return this.factory.call(method, args);
  }
}

module.exports = Client;
