'use strict';
const path = require('path');
const koa = require('koa');
const fs = require('fs');
const body = require('koa-better-body');
const tracer = require('./utils/tracing');
const app = tracer.createKoaV1(koa());
const route = app.router;
const { config } = require('t-koa-metrics');

app.use(body());
const routesPath = path.join(__dirname, 'routes')
fs.readdirSync(routesPath).forEach(file => {
    if (file[0] === '.') return;
    require(`${routesPath}/${file}`)(app, route);
  });

if (config.consul && config.consul.service) {
  registerService(config.consul);
}

app.start(config.server.port, () => {
  app.server.keepAliveTimeout = 61 * 1000;
  app.server.headersTimeout = 65 * 1000;
});
module.exports = app;
