/* eslint-disable max-classes-per-file */

class Success {
  constructor(result = null, id = null) {
    this.jsonrpc = '2.0';
    this.result = result;
    if (id !== null) { this.id = id; }
  }
}

class Error {
  constructor(code, message = null, id = null) {
    this.jsonrpc = '2.0';
    this.error = {
      code,
      message: message || '',
    };
    if (id !== null) { this.id = id; }
  }
}

const Response = {
  success: (result = null, id = null) => new Success(result, id),
  error: (code, message = null, id = null) => new Error(code, message, id),
};

module.exports = { Success, Error, Response };
