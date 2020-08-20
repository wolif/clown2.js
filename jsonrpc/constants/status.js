module.exports = {
  SUCCESS: 0,
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  SERVER_ERROR: -32000,

  SUCCESS_MSG: 'success',
  PARSE_ERROR_MSG: 'Invalid JSON was received by the server.',
  INVALID_REQUEST_MSG: 'The JSON sent is not a valid Request object.',
  METHOD_NOT_FOUND_MSG: 'The method does not exist / is not available.',
  INVALID_PARAMS_MSG: 'Invalid method parameter(s).',
  INTERNAL_ERROR_MSG: 'Internal error.',
  SERVER_ERROR_MSG: 'server error',

  map: {
    0: this.SUCCESS_MSG,
    '-32700': this.PARSE_ERROR_MSG,
    '-32600': this.INVALID_REQUEST_MSG,
    '-32601': this.METHOD_NOT_FOUND_MSG,
    '-32602': this.INVALID_PARAMS_MSG,
    '-32603': this.INTERNAL_ERROR_MSG,
    '-32000': this.SERVER_ERROR_MSG,
  },

  translate: (code) => {
    let ret = 'unknown error';
    if (code in this.map) {
      ret = this.map[code.toString()];
    }
    return ret;
  },
};
