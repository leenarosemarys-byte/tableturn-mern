'use strict';
const express = require('express');
const tableRepository = require('./tables/repository');
const partyRepository = require('./parties/repository');
const { makeTableService } = require('./tables/service');
const { makeTableRouter } = require('./tables/router');
const { makeWaitlistService } = require('./waitlist/service');
const { makeWaitlistRouter } = require('./waitlist/router');
const { makePartyService } = require('./parties/service');
const { makePartyRouter } = require('./parties/router');
const { notFound, errorHandler } = require('./errors/middleware');

/** Builds the Express app. It never connects to the database and never listens: server.js and tests do that. */
function createApp({ settings, clock }) {
  const app = express();
  const tables = makeTableService({ repository: tableRepository });
  const waitlist = makeWaitlistService({ parties: partyRepository, tables: tableRepository, clock });
  const parties = makePartyService({ repository: partyRepository });

  app.use(express.json());
  app.use(makeTableRouter(tables));
  app.use(makeWaitlistRouter(waitlist));
  app.use(makePartyRouter(parties));
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };