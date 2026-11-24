'use strict';
const fs = require('fs');
const path = require('path');
const tables = require('./tables/repository');

const BRANCH = 'Baner';

/** The rows of a seed CSV as objects keyed by their header (the files hold plain comma-separated values). */
function readCsv(file) {
  const [header, ...rows] = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter((line) => line.trim());
  const keys = header.split(',').map((k) => k.trim());
  return rows.map((row) => {
    const cells = row.split(',').map((c) => c.trim());
    return Object.fromEntries(keys.map((k, i) => [k, cells[i]]));
  });
}

/** Loads the Baner branch and its tables - once. A second start finds the branch and adds nothing. */
async function seed({ settings }) {
  if (await tables.branchExists(BRANCH)) return;
  await tables.addBranch({
    code: BRANCH,
    name: 'Baner',
    tables: readCsv(path.join(settings.seedDir, 'tables.csv'))
      .map((r) => ({ no: r.no, seats: Number(r.seats), section: r.section })),
  });
}

module.exports = { seed };
