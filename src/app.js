'use strict';
const express = require('express');
const tableRepository = require('./tables/repository');
const { makeTableService } = require('./tables/service');
const { makeTableRouter } = require('./tables/router');
const { notFound, errorHandler } = require('./errors/middleware');

/** Builds the Express app. It never connects to the database and never listens: server.js and tests do that. */
function createApp({ settings, clock }) {
  const app = express();
  const tables = makeTableService({ repository: tableRepository });

  app.use(makeTableRouter(tables));
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
