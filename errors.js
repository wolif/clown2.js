module.exports = {
  UNKNOWN_ERROR: 9999,
  RUNTIME_ERROR: 10000,
  INTERNAL_ERROR: 10001,
  LOGIC_ERROR: 10002,
  BAD_METHOD_CALL: 10003,
  INVALID_ARGUMENTS: 10004,

  UNKNOWN_ERROR_MSG: 'unknown error!',
  RUNTIME_ERROR_MSG: 'runtime error!',
  INTERNAL_ERROR_MSG: 'internal error!',
  LOGIC_ERROR_MSG: 'logic error!',
  BAD_METHOD_CALL_MSG: 'bad method called!',
  INVALID_ARGUMENTS_MSG: 'invalid arguments!',

  map: {
    9999: this.UNKNOWN_ERROR,
    10000: this.RUNTIME_ERROR,
    10001: this.INTERNAL_ERROR,
    10002: this.LOGIC_ERROR,
    10003: this.BAD_METHOD_CALL,
    10004: this.INVALID_ARGUMENTS,
  },

  translate: (code) => {
    let ret = 'unknown error';
    if (code in this.map) {
      ret = this.map[code.toString()];
    }
    return ret;
  },
};
