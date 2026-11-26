'use strict';
const { testDatabase } = require('./helpers');

const db = testDatabase('waitlist');
beforeAll(() => db.start());
afterAll(() => db.stop());

test('a party of six joins the list and gets a number, a place and a Location', async () => {
  const res = await db.api().post('/waitlist').send({ name: 'Kulkarni', covers: 6, phone: '+919876543210' });

  expect(res.status).toBe(201);
  expect(res.body.partyId).toBe('W001');
  expect(res.body.position).toBe(1);
  expect(res.headers.location).toBe('/parties/W001');
});

test('a party of nine is a 400 party-too-big naming the largest table', async () => {
  const res = await db.api().post('/waitlist').send({ name: 'Big', covers: 9 });

  expect(res.status).toBe(400);
  expect(res.body.type).toBe('/errors/party-too-big');
  expect(res.body.maxCovers).toBe(6);
});

test('a blank name is a 400 validation problem naming the field', async () => {
  const res = await db.api().post('/waitlist').send({ name: '', covers: 2 });

  expect(res.status).toBe(400);
  expect(res.body.type).toBe('/errors/validation');
  expect(res.body.errors.map((e) => e.field)).toContain('name');
});

test('a body that is not JSON at all is a 400 validation problem', async () => {
  const res = await db.api().post('/waitlist').set('content-type', 'application/json').send('{not json');

  expect(res.status).toBe(400);
  expect(res.body.type).toBe('/errors/validation');
});