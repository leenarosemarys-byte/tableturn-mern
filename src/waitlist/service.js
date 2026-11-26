'use strict';
const { PartyTooBig } = require('../errors');
const { wholeSecond, iso } = require('../time');

const BRANCH = 'Baner';

function makeWaitlistService({ parties, tables, clock }) {
  /** A party joins the list: refused if no table here could ever seat it; its position is counted at insert. */
  async function join({ name, covers, phone }) {
    const maxCovers = await tables.largestSeats(BRANCH);
    if (covers > maxCovers) throw new PartyTooBig(covers, maxCovers);
    const joinedAt = wholeSecond(clock.now());
    const party = {
      branchId: BRANCH, partyId: await parties.nextId(BRANCH), name, covers, phone: phone || null, state: 'waiting',
      joinedAt, position: 1 + await parties.waitingCount(BRANCH),
    };
    await parties.insert(party);
    return { partyId: party.partyId, name, covers, position: party.position, joinedAt: iso(joinedAt) };
  }

  return { join };
}

module.exports = { makeWaitlistService };
