import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load local .env variables into process.env
dotenv.config();

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
      server.middlewares.use((req, res, next) => {
        // Route 1: /api/save-data
        if (req.url.startsWith('/api/save-data')) {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          }

          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });

          req.on('end', async () => {
            try {
              const { data, pushToGit, pdfBase64, avatarBase64, password } = JSON.parse(body || '{}');
              const envHash = process.env.ADMIN_PASSWORD_HASH;
              const envPassword = process.env.ADMIN_PASSWORD;

              let isPasswordValid = false;
              if (envHash) {
                isPasswordValid = await bcrypt.compare(password || '', envHash);
              } else if (envPassword) {
                if (envPassword.startsWith('$2a$') || envPassword.startsWith('$2b$')) {
                  isPasswordValid = await bcrypt.compare(password || '', envPassword);
                } else {
                  isPasswordValid = (password === envPassword);
                }
              }

              if (!isPasswordValid) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: false, error: 'Unauthorized: Invalid Admin Password' }));
              }

              const newFileContent = `export const PORTFOLIO_DATA = ${JSON.stringify(data, null, 2)};\n`;
              let existingContent = '';
              if (fs.existsSync(dataJsPath)) {
                existingContent = fs.readFileSync(dataJsPath, 'utf-8');
              }

              const isDataChanged = existingContent.replace(/\s/g, '') !== newFileContent.replace(/\s/g, '');

              if (!isDataChanged && !pdfBase64 && !avatarBase64) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ 
                  success: true, 
                  gitPushed: false, 
                  message: 'No changes detected. Git push skipped!' 
                }));
              }

              if (isDataChanged) {
                fs.writeFileSync(dataJsPath, newFileContent, 'utf-8');
              }

              if (pdfBase64) {
                const pdfBuffer = Buffer.from(pdfBase64, 'base64');
                fs.writeFileSync(publicResumePath, pdfBuffer);
              }

              if (avatarBase64) {
                const avatarBuffer = Buffer.from(avatarBase64, 'base64');
                fs.writeFileSync(publicAvatarPath, avatarBuffer);
              }

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
          return;
        }

        // Route 2: /api/track-event
        if (req.url.startsWith('/api/track-event')) {
          const metricsFile = path.resolve(rootDir, 'server/metrics.json');
          let metrics = { pageViews: 120, audioListens: 45, audioCompletions: 28, lastUpdated: new Date().toISOString() };
          if (fs.existsSync(metricsFile)) {
            try { metrics = JSON.parse(fs.readFileSync(metricsFile, 'utf-8')); } catch (e) {}
          }

          if (req.method === 'GET') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ success: true, metrics }));
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                const { type } = JSON.parse(body || '{}');
                if (type === 'pageview') metrics.pageViews = (metrics.pageViews || 0) + 1;
                if (type === 'audio_listen') metrics.audioListens = (metrics.audioListens || 0) + 1;
                if (type === 'audio_completion') metrics.audioCompletions = (metrics.audioCompletions || 0) + 1;
                metrics.lastUpdated = new Date().toISOString();
                fs.writeFileSync(metricsFile, JSON.stringify(metrics, null, 2), 'utf-8');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, metrics }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
            return;
          }
        }

        // Route 3: /api/comments
        if (req.url.startsWith('/api/comments')) {
          const commentsFile = path.resolve(rootDir, 'server/comments.json');
          const srcCommentsFile = path.resolve(rootDir, 'src/comments.js');
          
          let comments = [
            {
              id: 'c_sample1',
              name: 'Sarah Chen',
              email: 'sarah@techlead.io',
              type: 'connect',
              message: 'Impressive backend work on high-throughput microservices and Kafka distributed locks! Would love to connect.',
              createdAt: '2026-08-08T14:20:00.000Z'
            }
          ];

          if (fs.existsSync(commentsFile)) {
            try { comments = JSON.parse(fs.readFileSync(commentsFile, 'utf-8')); } catch (e) {}
          }

          if (req.method === 'GET') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ success: true, comments }));
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                const { name, email, linkedin, type, message } = JSON.parse(body || '{}');
                if (!message || !message.trim()) {
                  res.statusCode = 400;
                  return res.end(JSON.stringify({ success: false, error: 'Message cannot be empty.' }));
                }

                const newComment = {
                  id: 'c_' + Date.now(),
                  name: name && name.trim() ? name.trim() : 'Anonymous Visitor',
                  email: email && email.trim() ? email.trim() : '',
                  linkedin: linkedin && linkedin.trim() ? linkedin.trim() : '',
                  type: type || 'feedback',
                  message: message.trim(),
                  createdAt: new Date().toISOString()
                };

                comments.unshift(newComment);
                fs.writeFileSync(commentsFile, JSON.stringify(comments, null, 2), 'utf-8');
                fs.writeFileSync(srcCommentsFile, `export const COMMENTS = ${JSON.stringify(comments, null, 2)};\n`, 'utf-8');

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, comment: newComment, comments }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
            return;
          }
        }

        // Route 4: /api/verify-password
        if (req.url.startsWith('/api/verify-password')) {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', async () => {
              try {
                const { password } = JSON.parse(body || '{}');
                const envHash = process.env.ADMIN_PASSWORD_HASH;
                const envPassword = process.env.ADMIN_PASSWORD;

                let isValid = false;
                if (envHash) {
                  isValid = await bcrypt.compare(password || '', envHash);
                } else if (envPassword) {
                  if (envPassword.startsWith('$2a$') || envPassword.startsWith('$2b$')) {
                    isValid = await bcrypt.compare(password || '', envPassword);
                  } else {
                    isValid = (password === envPassword);
                  }
                } else {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ 
                    success: false, 
                    authenticated: false, 
                    error: 'ADMIN_PASSWORD or ADMIN_PASSWORD_HASH environment variable is not set.' 
                  }));
                }

                if (isValid) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ success: true, authenticated: true }));
                } else {
                  res.statusCode = 401;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ success: false, authenticated: false, error: 'Incorrect Admin Password' }));
                }
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
            return;
          }
        }

        // Fallback: non-API request, delegate to next middleware in Vite stack
        return next();
      });
    }
  };
}
