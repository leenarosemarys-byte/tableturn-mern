'use strict';
const mongoose = require('mongoose');

const Branch = mongoose.model('Branch', new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
}, { collection: 'branches' }));

const tableSchema = new mongoose.Schema({
  branchId: { type: String, required: true },
  no: { type: String, required: true },
  seats: { type: Number, enum: [2, 4, 6], required: true },
  section: { type: String, enum: ['Window', 'Garden', 'Indoor'], required: true },
  currentSeatingId: { type: String, default: null },
  clearedAt: { type: Date, default: null },
}, { collection: 'tables' });
tableSchema.index({ branchId: 1, no: 1 }, { unique: true });
const Table = mongoose.model('Table', tableSchema);

function branchExists(code) {
  return Branch.exists({ code });
}

async function addBranch({ code, name, tables }) {
  await Branch.create({ code, name });
  await Table.insertMany(tables.map((t) => ({ branchId: code, no: t.no, seats: t.seats, section: t.section })));
}

/** A branch's tables in table-number order, as plain objects. */
function tablesOf(branchId) {
  return Table.find({ branchId }).sort({ no: 1 }).lean();
}

function table(branchId, no) {
  return Table.findOne({ branchId, no }).lean();
}

module.exports = { branchExists, addBranch, tablesOf, table };
