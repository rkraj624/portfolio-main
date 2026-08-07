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
              
              // 1. Read existing data.js to compare content
              const newFileContent = `export const PORTFOLIO_DATA = ${JSON.stringify(data, null, 2)};\n`;
              let existingContent = '';
              if (fs.existsSync(dataJsPath)) {
                existingContent = fs.readFileSync(dataJsPath, 'utf-8');
              }

              // Clean whitespace for exact diff check
              const isDataChanged = existingContent.replace(/\s/g, '') !== newFileContent.replace(/\s/g, '');

              // If NO changes were made to data, PDF, or avatar photo, skip git push & disk write!
              if (!isDataChanged && !pdfBase64 && !avatarBase64) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ 
                  success: true, 
                  gitPushed: false, 
                  message: 'No changes detected. Git push skipped!' 
                }));
              }

              // Save data.js directly to disk if changed
              if (isDataChanged) {
                fs.writeFileSync(dataJsPath, newFileContent, 'utf-8');
              }

              // Save new Resume PDF to public/Ravi_Raja_Resume.pdf if provided
              if (pdfBase64) {
                const pdfBuffer = Buffer.from(pdfBase64, 'base64');
                fs.writeFileSync(publicResumePath, pdfBuffer);
              }

              // Save new Profile Picture image to public/avatar.jpg if provided
              if (avatarBase64) {
                const avatarBuffer = Buffer.from(avatarBase64, 'base64');
                fs.writeFileSync(publicAvatarPath, avatarBuffer);
              }

              // Git Auto-Commit & Push ONLY if changes occurred and pushToGit is enabled
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
                      message: 'Data saved to disk, but Git push skipped or requires manual authentication.' 
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
