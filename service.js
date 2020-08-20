const { EventEmitter } = require('events');
const ClownError = require('./clownError');
const errors = require('./errors');
const HttpClient = require('./transport/httpClient');
const Client = require('./jsonrpc/client/client');
const Factory = require('./jsonrpc/client/call/factory');

class Service extends EventEmitter {
  constructor(opts = {}) {
    super();
    this.opts = opts;
    this.service = {};
  }

  /**
   * get client
   * @param {string} service
   * @returns {Client}
   */
  client(service) {
    if (service in this.service) {
      return this.service[service];
    }

    if (service in this.opts) {
      let serializer; let transport;

      const opt = this.opts[service];
      switch (opt.type) {
        case 'jsonrpc':
        default:
          serializer = 'serializer' in opt ? opt.serializer : 'json';

          switch (opt.transport) {
            case 'http':
            default:
              transport = new HttpClient(opt.options);
          }

          this.service[service] = new Client(new Factory(
            transport, serializer, null,
          ));

          break;
      }

      return this.service[service];
    }

    throw new ClownError(errors.INVALID_ARGUMENTS);
  }
}

module.exports = Service;
