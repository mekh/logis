/**
 * Serialize a log item
 */
module.exports = (data) => {
  if (data !== null && ['object', 'symbol'].includes(typeof data)) {
    try {
      return JSON.stringify(data);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  return data;
};
