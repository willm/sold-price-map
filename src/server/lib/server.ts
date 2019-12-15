import {createServer, ServerResponse} from 'http';
import {PropertiesResponse} from '../../common/properties';

function respond(res: ServerResponse, status: number, body?: object) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Origin': '*'
  });
  return res.end(JSON.stringify(body));
}

export function server() {
  return createServer((req, res) => {
    if (req.method === 'options') {
      return respond(res, 200, {});
    }
    if (req.url === '/properties') {
      const response: PropertiesResponse = {
        priceBands: [
          {
            name: '95% - 100%',
            properties: [
              {
                price: 500000,
                coordinates: {
                  x: 20,
                  y: 50
                }
              }
            ]
          }
        ]
      };
      return respond(res, 200, response);
    }
    return respond(res, 404, {message: 'not found'});
  });
}
