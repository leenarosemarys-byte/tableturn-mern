'use strict';
const express = require('express');
const { z } = require('zod');
const { parse } = require('../validate');

const floorQuery = z.object({
  section: z.enum(['Window', 'Garden', 'Indoor']).optional(),
  state: z.enum(['free', 'seated', 'uncleared']).optional(),
});

function makeTableRouter(service) {
  const router = express.Router();

  router.get('/branches/:branch/tables', async (req, res) => {
    res.json(await service.floor(req.params.branch, parse(floorQuery, req.query)));
  });

  router.get('/branches/:branch/tables/:no', async (req, res) => {
    res.json(await service.table(req.params.branch, req.params.no));
  });

  return router;
}

module.exports = { makeTableRouter };
