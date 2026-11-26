'use strict';
const express = require('express');

function makePartyRouter(service) {
  const router = express.Router();

  router.get('/parties/:partyId', async (req, res) => {
    res.json(await service.party(req.params.partyId));
  });

  return router;
}

module.exports = { makePartyRouter };
