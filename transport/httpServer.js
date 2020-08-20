/* eslint-disable no-useless-constructor */
const http = require('http');
const _ = require('lodash');
const { EventEmitter } = require('events');

class HttpServer extends EventEmitter {
  /**
   * @param {Object} options
   * @param {Function} method
   * @param {Boolean} initImmediately
   */
  constructor(options = {}, method = null, initImmediately = true) {
    super();
    this.httpServer = null;
    this.setOptions(options);
    this.registerMethod(method);
    if (initImmediately) {
      this.init();
    }
  }

  /**
   * @param {String|Object} options
   * @param {String|Number|Boolean|Object} value
   */
  setOptions(options, value = null) {
    if (_.isObject(options)) {
      _.forIn(options, (v, k) => {
        this.options[k] = v;
      });
    } else if (_.isString(options) && value) {
      this.options[options] = value;
    }
  }

  /**
   * @param {Function} method
   */
  registerMethod(method) {
    this.method = method;
  }

  init() {
    this.httpServer = http.createServer(this.options);
  }

  /**
   * @param {Number} port
   * @param {String} host
   */
  listen(port = 80, host = '127.0.0.1') {
    this.httpServer.on('close', () => this.emit('close'));
    this.httpServer.on('error', (error) => this.emit('error', error));
    this.httpServer.on('request', ((req, resp) => {
      let requestBody = '';
      req.on('data', (chunk) => {
        requestBody += chunk;
      });
      req.on('end', async () => {
        this.emit('input', requestBody);
        const output = await this.method(requestBody, req, resp);
        resp.setHeader('content-length', output ? output.length : 0);
        resp.end(output);
      });
    }));

    this.httpServer.listen(port, host);
  }
}

module.exports = HttpServer;
