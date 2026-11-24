'use strict';
const { seed } = require('../src/seed');
const { clock, testDatabase } = require('./helpers');

const db = testDatabase('floor');
beforeAll(() => db.start());
afterAll(() => db.stop());

test('starting twice still gives 22 tables, all free', async () => {
  await seed({ settings: db.settings, clock });
  await seed({ settings: db.settings, clock });

  const res = await db.api().get('/branches/Baner/tables');

  expect(res.status).toBe(200);
  expect(res.body.tables).toHaveLength(22);
  expect(res.body.free).toBe(22);
});

test('the Garden filter gives only Garden tables', async () => {
  const res = await db.api().get('/branches/Baner/tables?section=Garden');

  expect(res.body.tables.length).toBeGreaterThan(0);
  expect(res.body.tables.every((t) => t.section === 'Garden')).toBe(true);
});

test('an unknown section is a 400 validation problem', async () => {
  const res = await db.api().get('/branches/Baner/tables?section=Roof');

  expect(res.status).toBe(400);
  expect(res.body.type).toBe('/errors/validation');
});

test('an unknown table is a 404 no-such-table problem', async () => {
  const res = await db.api().get('/branches/Baner/tables/T99');

  expect(res.status).toBe(404);
  expect(res.body.type).toBe('/errors/no-such-table');
});