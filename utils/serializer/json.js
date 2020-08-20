const status = require('../../jsonrpc/constants/status');
const JsonrpcError = require('../../jsonrpc/errors/jsonrpcError');

module.exports = {
  serialize: (o) => {
    try {
      return JSON.stringify(o);
    } catch (err) {
      throw new JsonrpcError(status.INTERNAL_ERROR_MSG);
    }
  },
  deserialize: (message) => {
    try {
      return JSON.parse(message);
    } catch (err) {
      throw new JsonrpcError(status.PARSE_ERROR);
    }
  },
};
