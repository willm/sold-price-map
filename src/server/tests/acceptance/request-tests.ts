import test from 'tape-async';
import {server} from '../../lib/server';
import supertest from 'supertest';
import {PropertiesResponse} from '../../../common/properties';
const request = supertest(server());

test('a request to an unknown url should return a 404 not found', async assert => {
  const response = await request
    .get('/')
    .expect('Content-Type', 'application/json')
    .expect(404);

  assert.deepEqual(response.body, {message: 'not found'}, 'has expected body');
});

test('an options request should respond with a 200 ok', async assert => {
  await request
    .options('/properties')
    .expect('Content-Type', 'application/json')
    .expect(200);
});

test('a request to /properties should return a properties response', async assert => {
  const response = await request
    .get('/properties')
    .expect('Content-Type', 'application/json')
    .expect('Access-Control-Allow-Origin', '*')
    .expect('Access-Control-Allow-Methods', '*')
    .expect(200);

  const body: PropertiesResponse = response.body as unknown as PropertiesResponse;
  assert.true(Array.isArray(body.priceBands), 'has price bands array');
  const priceBand = body.priceBands[0];
  assert.equal(typeof priceBand.range, 'string', 'has price band name');
  assert.true(body.priceBands[0].range.length > 0, 'price band name is not empty');
  assert.true(Array.isArray(priceBand.properties), 'price band has properties array');
  const property = priceBand.properties[0];
  assert.equal(typeof property.price, 'number', 'property has a price');
  const coordinates = property.coordinates;
  assert.equal(typeof coordinates.x, 'number', 'coordinate has an x position');
  assert.equal(typeof coordinates.y, 'number', 'coordinate has an y position');
});

test('if an error occurs, a 500 is returned', async assert => {
  const brokenRequest = supertest(server('some-file-that-does-not-exist.txt'));
  await brokenRequest
    .get('/properties')
    .expect(500);
});
