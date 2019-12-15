import {createServer, ServerResponse} from 'http';
import {mapProperties} from './properties-mapper';
import {fetchProperties} from './property-fetcher';

function respond(res: ServerResponse, status: number, body?: object) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Origin': '*',
  });
  return res.end(JSON.stringify(body));
}

export function server(propertiesFilePath = process.env.PROPERTY_DATA || './data.txt') {
  return createServer((req, res) => {
    if (req.method === 'options') {
      return respond(res, 200, {});
    }
    if (req.url === '/properties') {
      try {
        const response = mapProperties(fetchProperties(propertiesFilePath));
        return respond(res, 200, response);
      } catch(err) {
        // tslint:disable-next-line: no-console
        console.error(err);
        return respond(res, 500, {message: err.message});
      }
    }
    return respond(res, 404, {message: 'not found'});
  });
}
