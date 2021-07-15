'use strict';
const errLogger = require('../utils/logger').errLogger;

module.exports = () =>
  function *error(next) {
    try {
      yield next;
    } catch (err) {
      errLogger.error({ err, req: this.req });
      this.status = err.status || 500;
      this.body = {
        error_message: err.response ? err.response.text : err.message,
      };
      this.app.emit('error', err, this);
    }
  };
