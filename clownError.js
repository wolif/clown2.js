const errors = require('./errors');

class ClownError extends Error {
  constructor(code = errors.INTERNAL_ERROR, message = '') {
    super(message || errors.map(code));
    this.code = code;
  }
}

module.exports = ClownError;
