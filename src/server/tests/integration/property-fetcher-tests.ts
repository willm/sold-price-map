import test from 'tape-async';
import {fetchProperties} from '../../lib/property-fetcher';
import {writeFileSync} from 'fs';
import {tmpdir} from 'os';
import {join} from 'path';

test('it returns all properties from a valid file', async assert => {
  const path = join(tmpdir(), 'valid.txt');
  writeFileSync(path, '60 23 1422640\n58 66 3653379');

  const properties = await fetchProperties(path);
  assert.equal(properties.length, 2, 'parsed 2 properties');
  assert.deepEqual(
    properties[0],
    {
      coordinates: {x: 60, y: 23},
      price: 1422640,
    }
  );
  assert.deepEqual(
    properties[1],
    {
      coordinates: {x: 58, y: 66},
      price: 3653379,
    }
  );
});
