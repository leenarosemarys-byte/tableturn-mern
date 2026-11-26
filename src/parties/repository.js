'use strict';
const mongoose = require('mongoose');

const Party = mongoose.model('Party', new mongoose.Schema({
  branchId: { type: String, required: true },
  partyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  covers: { type: Number, required: true },
  phone: { type: String, default: null },
  state: { type: String, enum: ['waiting', 'seated', 'left', 'cleared'], default: 'waiting' },
  joinedAt: { type: Date, required: true },
  position: { type: Number, required: true },
}, { collection: 'parties' }));

/** The next party id in the branch: 'W' and a number of at least three digits, W001 first. */
async function nextId(branchId) {
  const count = await Party.countDocuments({ branchId });
  return `W${String(count + 1).padStart(3, '0')}`;
}

function waitingCount(branchId) {
  return Party.countDocuments({ branchId, state: 'waiting' });
}

async function insert(party) {
  await Party.create(party);
}

function byId(branchId, partyId) {
  return Party.findOne({ branchId, partyId }).lean();
}

module.exports = { nextId, waitingCount, insert, byId };
