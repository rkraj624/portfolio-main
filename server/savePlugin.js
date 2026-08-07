import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../');
const dataJsPath = path.resolve(rootDir, 'src/data.js');
const publicResumePath = path.resolve(rootDir, 'public/Ravi_Raja_Resume.pdf');
const publicAvatarPath = path.resolve(rootDir, 'public/avatar.jpg');

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
              const { data, pushToGit, pdfBase64, avatarBase64, password } = JSON.parse(body);
              const envPassword = process.env.ADMIN_PASSWORD;

              // Password security check (if ADMIN_PASSWORD env is set)
              if (envPassword && password !== envPassword) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: false, error: 'Unauthorized: Invalid Admin Password' }));
              }
              
              // 1. Write data.js directly to disk
              const fileContent = `export const PORTFOLIO_DATA = ${JSON.stringify(data, null, 2)};\n`;
              fs.writeFileSync(dataJsPath, fileContent, 'utf-8');

              // 2. Save new Resume PDF to public/Ravi_Raja_Resume.pdf if provided
              if (pdfBase64) {
                const pdfBuffer = Buffer.from(pdfBase64, 'base64');
                fs.writeFileSync(publicResumePath, pdfBuffer);
              }

              // 3. Save new Profile Picture image to public/avatar.jpg if provided
              if (avatarBase64) {
                const avatarBuffer = Buffer.from(avatarBase64, 'base64');
                fs.writeFileSync(publicAvatarPath, avatarBuffer);
              }

              // 4. Git Auto-Commit & Push ALL workspace changes to GitHub
              if (pushToGit) {
                const commitMsg = `chore: update portfolio contents via admin dashboard [${new Date().toLocaleString()}]`;
                const gitCmd = `git add . && git commit -m "${commitMsg}" && git push origin main`;

                exec(gitCmd, { cwd: rootDir }, (error, stdout, stderr) => {
                  if (error) {
                    console.error("Git Push Warning:", stderr || error.message);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ 
                      success: true, 
                      gitPushed: false, 
                      message: 'Data saved to disk, but Git push requires manual authentication or network.' 
                    }));
                  } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ 
                      success: true, 
                      gitPushed: true, 
                      message: 'Saved to disk and successfully pushed directly to GitHub!' 
                    }));
                  }
                });
              } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, gitPushed: false, message: 'Saved to disk!' }));
              }

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
