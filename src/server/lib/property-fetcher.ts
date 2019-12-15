import {Property} from '../../common/properties';
import {readFileSync, fstat} from 'fs';
import {EOL} from 'os';

export function fetchProperties(sourceFilePath: string): Property[] {
  /*
  TODO: a lot of bad stuff can happen here that should be handled:
    * file system read errors
    * invalid data
    * missing data
  */
  const lines = readFileSync(sourceFilePath).toString('utf8').split(EOL);
  const values = lines.map(line => line.split(' ').map(Number));
  return values.map(v => ({
    coordinates: {x: v[0], y: v[1]},
    price: v[2]
  }));
}
