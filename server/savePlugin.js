import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataJsPath = path.resolve(__dirname, '../src/data.js');

export default function saveApiPlugin() {
  return {
    name: 'save-data-js-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save-data', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });

          req.on('end', () => {
            try {
              const updatedData = JSON.parse(body);
              const fileContent = `export const PORTFOLIO_DATA = ${JSON.stringify(updatedData, null, 2)};\n`;
              
              fs.writeFileSync(dataJsPath, fileContent, 'utf-8');
              
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'data.js file updated directly on disk!' }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end();
        }
      });
    }
  };
}
