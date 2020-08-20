class ErrorResult {
  constructor(code, message = null) {
    this.code = code;
    this.message = message;
  }
}

module.exports = {
  ErrorResult,
  creator: {
    fromError: (err) => new ErrorResult(err.code, err.message),
    fromObject: (o) => new ErrorResult(o.code, o.message),
  },
};
