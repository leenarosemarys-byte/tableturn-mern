'use strict';
const { NoSuchBranch, NoSuchTable } = require('../errors');

/** A table's state is derived from its current seating, on every read; nothing stores it. */
function stateOf(table) {
  return table.currentSeatingId === null ? 'free' : 'seated';
}

/** A free table is exactly { no, seats, section, state }. */
function shape(table) {
  return { no: table.no, seats: table.seats, section: table.section, state: stateOf(table) };
}

function makeTableService({ repository }) {
  async function requireBranch(branch) {
    if (!(await repository.branchExists(branch))) throw new NoSuchBranch(branch);
  }

  /** The floor, optionally one section and/or one state; `free` counts the free tables among those shown. */
  async function floor(branch, { section, state } = {}) {
    await requireBranch(branch);
    const tables = (await repository.tablesOf(branch)).map(shape)
      .filter((t) => (!section || t.section === section) && (!state || t.state === state));
    return { branch, free: tables.filter((t) => t.state === 'free').length, tables };
  }

  async function table(branch, no) {
    await requireBranch(branch);
    const found = await repository.table(branch, no);
    if (!found) throw new NoSuchTable(branch, no);
    return shape(found);
  }

  return { floor, table };
}

module.exports = { makeTableService };
