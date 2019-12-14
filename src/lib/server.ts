import {createServer} from 'http';
import {PropertiesResponse} from './properties';

function respond(res, status: number, body?) {
  res.writeHead(status, {'Content-Type': 'application/json'});
  return res.end(JSON.stringify(body));
}

export function server() {
  return createServer((req, res) => {
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
