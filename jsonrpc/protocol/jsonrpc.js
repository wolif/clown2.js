/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
const _ = require('lodash');
const json = require('../../utils/serializer/json');
const { Success: RespSuccess, Error: RespError, Response: ClownResponse } = require('../message/response');
const ClownRequest = require('../message/request');
const JsonrpcError = require('../errors/jsonrpcError');
const status = require('../constants/status');

class Jsonrpc {
  /**
   * @param {String} type
   */
  constructor(type) {
    switch (type) {
      case 'json':
      default:
        this.serializer = json;
    }
  }

  /**
   * @param {ClownRequest|Array<ClownRequest>} req
   * @returns {String}
   */
  packRequest(req) {
    return this.serializer.serialize(req);
  }

  parseSingeRequest(row) {
    if (!_.isObject(row)) {
      throw new JsonrpcError(status.INVALID_PARAMS, `unexpected jsonrpc schema request, given [${row}]`);
    }

    if (!_.has(row, 'method')) {
      throw new JsonrpcError(status.INVALID_PARAMS, 'unexpected jsonrpc schema request and method is not set');
    }

    const ret = ClownRequest.create(row.method);

    if (_.has(row, 'params')) {
      if (_.isArray(row.params)) {
        ret.params = row.params;
      } else {
        ret.params = [row.params];
      }
    }

    if (_.has(row, 'id')) {
      ret.id = row.id;
    }

    return ret;
  }

  /**
   * @param {String} buffer
   * @returns {ClownRequest|Array<ClownRequest>}
   */
  unpackRequest(buffer) {
    const data = this.serializer.deserialize(buffer);

    let ret = null;
    if (_.isObject(data) && _.has(data, 'method')) {
      ret = this.parseSingeRequest(data);
    } else if (_.isArray(data)) {
      ret = [];
      data.forEach((row) => {
        ret.push(this.parseSingeRequest(row));
      });
    } else {
      throw new JsonrpcError(status.INVALID_PARAMS, 'unexpected jsonrpc schema request');
    }

    return ret;
  }

  /**
   * @param {RespSuccess|Array<RespSuccess>|RespError|Array<RespError>} resp
   * @returns {String}
   */
  packResponse(resp) {
    return this.serializer.serialize(resp);
  }

  parseSingleResponse(row) {
    if (!_.isObject(row)) {
      throw new JsonrpcError(status.INTERNAL_ERROR, 'unexpected jsonrpc schema response');
    }

    let ret = null;
    if (_.has(row, 'result')) {
      ret = ClownResponse.success(row.result);
    } else if (_.has(row, 'error')) {
      ret = ClownResponse.error(row.error);
    } else {
      throw new JsonrpcError(status.INTERNAL_ERROR, 'unexpected jsonrpc schema response');
    }

    if (_.has(row, 'id')) {
      ret.id = row.id;
    }
    return ret;
  }

  /**
   * @param {String} buffer
   * @returns {RespSuccess|Array<RespSuccess>|RespError|Array<RespError>}
   */
  unpackResponse(buffer) {
    const data = this.serializer.deserialize(buffer);

    if (_.isObject(data) && (_.has(data, 'result') || _.has(data, 'error'))) {
      return this.parseSingleResponse(data);
    }
    if (_.isArray(data)) {
      const ret = [];
      data.forEach((row) => {
        ret.push(this.parseSingleResponse(row));
      });
      return ret;
    }
    throw new JsonrpcError(status.INTERNAL_ERROR, 'unexpected jsonrpc schema response');
  }
}

module.exports = Jsonrpc;
