/* eslint-disable no-unused-vars */
const { v4: uuidV4 } = require('uuid');
const Jsonrpc = require('../../protocol/jsonrpc');
const Call = require('./call');
const HttpClient = require('../../../transport/httpClient');

class Factory {
  /**
   * @param {HttpClient} transport
   * @param {String} serializer
   * @param {Function} idGen
   */
  constructor(transport, serializer, idGen = null) {
    this.transport = transport;
    this.protocol = new Jsonrpc(serializer);
    this.idGen = idGen || uuidV4;
  }

  /**
   * @param {string} method
   * @param {Array} args
   * @returns {Call}
   */
  call(method, args) {
    return new Call(this.transport, this.protocol, method, args, this.idGen);
  }
}

module.exports = Factory;
