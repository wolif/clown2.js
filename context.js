let id = 0;

module.exports = {
  resetID: () => {
    id = 0;
  },
  create: (obj = {}) => {
    const o = obj;
    o.id = id + 1;
    return o;
  },
};
