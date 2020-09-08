module.exports = (fn) => {
  return (req, res, next, ...params) => {
    Promise.resolve(fn(req, res, next, ...params)).catch(next);
  };
};