/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
const _ = require('lodash');
const promise = require('bluebird');
const ServerBase = require('../../server/serverBase');
const Jsonrpc = require('../protocol/jsonrpc');
const ClownError = require('../../clownError');
const { ErrorResult, creator: ERCreator } = require('../../ErrorResult');
const status = require('../constants/status');
const Context = require('../../context');
const { Response } = require('../message/response');
const JsonrpcError = require('../errors/jsonrpcError');

class Server extends ServerBase {
  constructor(options = {}) {
    super(options);
    this.protocol = new Jsonrpc();
    if ('error_handler' in options) {
      const { errorHandler } = options;
      this.errorHandler = (err) => {
        const errEntity = errorHandler(err);
        if (errEntity instanceof ErrorResult) {
          return [errEntity, null];
        }
        return [this.defaultErrHandler(err), null];
      };
    } else {
      this.errorHandler = (err) => [this.defaultErrHandler(err), null];
    }
  }

  defaultErrHandler(err) {
    if (err instanceof ClownError) {
      return ERCreator.fromError(err);
    }
    return ERCreator.fromObject({
      code: status.INTERNAL_ERROR,
      message: status.INTERNAL_ERROR_MSG,
    });
  }

  dispatch(ctx, req) {
    this.emit('server.beforeDispatch', ctx, this);

    let err; let result; let resp;
    try {
      const method = this.load(req.method);
      if (!_.isFunction(method)) {
        throw new JsonrpcError(status.METHOD_NOT_FOUND);
      }
      result = method(...(_.isObject(req.params) ? [req.params] : req.params));
    } catch (error) {
      [err, result] = this.errorHandler(error);
    }

    if (err) {
      resp = Response.error(err.code);
      this.emit('server.afterDispatch', ctx, req, err, null, this);
    } else {
      resp = Response.success(result);
      this.emit('server.afterDispatch', ctx, req, null, result, this);
    }

    if (_.has(req, 'id')) {
      resp.id = req.id;
    }

    return resp;
  }

  async respond(message) {
    const ctx = Context.create();
    this.emit('server.beforeHandleRequest', ctx, this);

    let err; let result; let req; let resp;

    try {
      req = this.protocol.unpackRequest(message);
    } catch (error) {
      [err, result] = this.errorHandler(error);
    }

    if (!err) {
      if (_.isArray(req)) {
        resp = await promise.map(req, (r) => this.dispatch(ctx, r));
      } else {
        resp = this.dispatch(ctx, req);
      }
    }

    try {
      return this.protocol.packResponse(err ? Response.error(err.code, err.message) : resp);
    } catch (error) {
      [err, result] = this.errorHandler(error);
      return this.protocol.packResponse(err ? Response.error(err.code, err.message) : Response.success(result));
    } finally {
      this.emit('server.afterHandleRequest', ctx, this);
    }
  }
}

module.exports = Server;
