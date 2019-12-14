import {createServer} from 'http';

export function server() {
  return createServer((req, res) => {
    res.writeHead(404);
    return res.end();
  });
}
