/* eslint-disable no-unused-vars */
const { EventEmitter } = require('events');
const _ = require('lodash');
const { Error } = require('../../message/response');
const JsonrpcError = require('../../errors/jsonrpcError');
const ErrorResult = require('../../../ErrorResult');
const Request = require('../../message/request');
const HttpClient = require('../../../transport/httpClient');
const Jsonrpc = require('../../protocol/jsonrpc');

class Call extends EventEmitter {
  /**
   * @param {HttpClient} transport
   * @param {Jsonrpc} protocol
   * @param {String} method
   * @param {Array} params
   * @param {Function} idGen
   */
  constructor(transport, protocol, method, params, idGen = null) {
    super();
    this.transport = transport;
    this.protocol = protocol;
    this.method = method;
    this.params = params;
    this.idGen = idGen;
  }

  async send() {
    const request = this.protocol.packRequest(
      Request.create(this.method, this.params, _.isFunction(this.idGen) ? this.idGen() : null),
    );
    this.emit('client.beforeCall', this.ctx, this);
    const resp = await this.transport.send(request);
    return resp;
  }

  /**
   * @returns {String}
   */
  async wait() {
    try {
      const resp = this.protocol.unpackResponse(await this.send());
      if (resp instanceof Error) {
        throw new JsonrpcError(resp.error.code, resp.error.message);
      }

      this.rep = resp.result;
      this.emit('client.afterCall', this.ctx, this, this.rep, null);
    } catch (err) {
      this.rep = ErrorResult.creator.fromError(err);
      this.emit('client.afterCall', this.ctx, this, null, this.rep);
      throw err;
    }

    return this.rep;
  }
}

module.exports = Call;
