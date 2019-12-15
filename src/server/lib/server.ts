import {createServer, ServerResponse} from 'http';
import {mapProperties} from './properties-mapper';
import {fetchProperties} from './property-fetcher';
const propertiesFilePath = process.env.PROPERTY_DATA || './data.txt';

function respond(res: ServerResponse, status: number, body?: object) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Origin': '*',
  });
  return res.end(JSON.stringify(body));
}

export function server() {
  return createServer((req, res) => {
    if (req.method === 'options') {
      return respond(res, 200, {});
    }
    if (req.url === '/properties') {
      const response = mapProperties(fetchProperties(propertiesFilePath));
      return respond(res, 200, response);
    }
    return respond(res, 404, {message: 'not found'});
  });
}
