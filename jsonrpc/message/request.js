module.exports = {
  create: (method, params = [], id = null) => {
    const req = {
      jsonrpc: '2.0',
      method,
      params,
    };
    if (id != null) { req.id = id; }

    return req;
  },
};
