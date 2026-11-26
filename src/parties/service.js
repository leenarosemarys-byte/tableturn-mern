'use strict';
const { NoSuchParty } = require('../errors');
const { iso } = require('../time');

const BRANCH = 'Baner';

/** A party as the API shows it (never the phone number). */
function shapeParty(p) {
  return {
    partyId: p.partyId, name: p.name, covers: p.covers, state: p.state, position: p.position, joinedAt: iso(p.joinedAt),
  };
}

function makePartyService({ repository }) {
  async function party(partyId) {
    const p = await repository.byId(BRANCH, partyId);
    if (!p) throw new NoSuchParty(partyId);
    return shapeParty(p);
  }

  return { party };
}

module.exports = { makePartyService };
