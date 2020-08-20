/* eslint-disable class-methods-use-this */
/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */
const { EventEmitter } = require('events');
const _ = require('lodash');
const { method } = require('lodash');

class ServerBase extends EventEmitter {
  constructor(options = {}) {
    super();
    this.loaders = [];
    this.methods = [];
    if (_.has(options, 'loaders')) {
      this.loaders = options.loaders;
    }
    if (_.has(options, 'loader')) {
      this.registerLoader(options.loader);
    }
  }

  registerLoader(loader) {
    this.loaders.push(loader);
  }

  registerMethod(name, method) {
    this.methods[name] = method;
  }

  load(methodName) {
    let ret = false;
    if (_.has(this.methods, methodName)) {
      ret = this.methods[methodName];
    }

    if (ret === false && this.loaders.length > 0) {
      for (const loader of this.loaders) {
        ret = loader(method);
        if (_.isFunction(ret)) {
          this.registerMethod(methodName, ret);
          break;
        }
      }
    }

    return ret;
  }

  // eslint-disable-next-line no-unused-vars
  respond(message) {}
}

module.exports = ServerBase;
