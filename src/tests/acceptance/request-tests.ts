import test from 'tape-async';
import * as chaiLib from 'chai';
import chaiHttp = require('chai-http');
import {server} from '../../lib/server';
const chai = chaiLib.use(chaiHttp);

test('a request to an unknown url should return a 404 not found', async assert => {
  const response = await chai.request(server())
    .get('/');

  assert.equal(response.status, 404, 'has status 404 not found');
});
