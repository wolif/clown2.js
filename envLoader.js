const fs = require('fs');

module.exports = {
  data: {},

  /**
   * @param {String} name
   * @param {String|Number} value
   * @returns {String|Number}
   */
  get: (name = null, value = null) => {
    if (name === null) {
      return this.data;
    }
    if (name in this.data) {
      return this.data[name];
    }

    return value;
  },

  /**
   * @param {String} file
   */
  load: (file) => {
    if (!fs.existsSync(file)) {
      throw new Error(`file [${file}] not found`);
    }
    const self = this;
    fs.readFileSync(file, 'utf-8').toString().split('/\r|\n|\r\n/').forEach((line) => {
      const matches = line.match(/^\s*([\w.-]+)\s*=(.*)\s*$/);
      if (matches.length > 1) {
        self.data[matches[1].trim()] = matches[2].trim() || '';
      }
    });
  },
};
