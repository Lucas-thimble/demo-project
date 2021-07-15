"use strict";
const Tracer = require("t-koa-metrics").Tracker;

const tracer = new Tracer({
    service:'myproject',
    config: {
        enable: false,
    },
    monitor: {
        interval:60,
    },
});

module.exports = tracer;