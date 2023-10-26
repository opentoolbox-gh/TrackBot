import http from 'http';
import app from './src';
import { config } from 'dotenv';
config();

import { Swaggiffy } from 'swaggiffy';

const port:number = Number(process.env.PORT) || Number(3000);
const server:http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> = http.createServer(app);
server.listen(port, () => {
  console.log(`Server running @ ${port}`);
});