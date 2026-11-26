'use strict';
const express = require('express');
const { z } = require('zod');
const { parse } = require('../validate');

const joinBody = z.object({
  name: z.string().max(60).refine((name) => name.trim().length > 0, 'must not be blank'),
  covers: z.number().int().min(1).max(20),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'must be a phone number in E.164 form, e.g. +919876543210').optional(),
});

function makeWaitlistRouter(service) {
  const router = express.Router();

  router.post('/waitlist', async (req, res) => {
    const party = await service.join(parse(joinBody, req.body));
    res.status(201).location(`/parties/${party.partyId}`).json(party);
  });

  return router;
}

module.exports = { makeWaitlistRouter };
