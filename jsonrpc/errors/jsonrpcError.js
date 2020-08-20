const status = require('../constants/status');
const ClownError = require('../../clownError');

class JsonrpcError extends ClownError {
  constructor(code, message = '') {
    super(code, message || status.translate(code));
  }
}

module.exports = JsonrpcError;
