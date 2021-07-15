const { config } = require('t-koa-metrics');
const monk = require('monk');
const db = monk(config.db_url, config.db.options);

module.exports = db;
