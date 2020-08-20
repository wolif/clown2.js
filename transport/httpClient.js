/* eslint-disable no-shadow */
const _ = require('lodash');
const http = require('http');
const { EventEmitter } = require('events');

class HttpClient extends EventEmitter {
  constructor(options = {}) {
    super();
    this.setOptions(options);
  }

  setOptions(options, value = null) {
    if (_.isObject(options)) {
      _.forIn((v, k) => {
        this.options[k] = v;
      });
    } else if ((_.isString(options) || _.isArray(options)) && value) {
      _.set(this.options, options, value);
    }
  }

  setHeaders(headers, value = null) {
    if (_.isObject(headers)) {
      _.forIn((v, k) => {
        this.options.headers[k] = v;
      });
    } else if (_.isString(headers) && value) {
      this.options.headers[headers] = value;
    }
  }

  async send(data, options = {}, headers = {}) {
    this.setOptions(options);
    this.setHeaders(headers);

    const p = new Promise((resolve, reject) => {
      let responseBody = '';
      const req = http.request(this.options, (resp) => {
        resp.setEncoding('utf-8');
        resp.on('data', (chunk) => {
          responseBody += chunk;
        });
        resp.on('end', () => {
          resp.destroy();
          resolve(responseBody);
        });
      });

      req.on('error', (err) => {
        this.emit('error', err);
        reject(err);
      });

      req.write(data);
      req.end();
    });

    const response = await p;
    return response;
  }
}

module.exports = HttpClient;
