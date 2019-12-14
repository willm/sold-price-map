import test from 'tape-async';
import {server} from '../../lib/server';
import supertest from 'supertest';
import {PropertiesResponse} from '../../lib/properties';
const request = supertest(server());

test('a request to an unknown url should return a 404 not found', async assert => {
  const response = await request
    .get('/')
    .expect('Content-Type', 'application/json')
    .expect(404);

  assert.deepEqual(response.body, {message: 'not found'}, 'has expected body');
});

test('a request to /properties should return a properties response', async assert => {
  const response = await request
    .get('/properties')
    .expect('Content-Type', 'application/json')
    .expect(200);

  const body: PropertiesResponse = response.body as unknown as PropertiesResponse;
  assert.true(Array.isArray(body.priceBands), 'has price bands array');
  const priceBand = body.priceBands[0];
  assert.equal(typeof priceBand.name, 'string', 'has price band name');
  assert.true(body.priceBands[0].name.length > 0, 'price band name is not empty');
  assert.true(Array.isArray(priceBand.properties), 'price band has properties array');
  const property = priceBand.properties[0];
  assert.equal(typeof property.price, 'number', 'property has a price');
  const coordinates = property.coordinates;
  assert.equal(typeof coordinates.x, 'number', 'coordinate has an x position');
  assert.equal(typeof coordinates.y, 'number', 'coordinate has an y position');
});
