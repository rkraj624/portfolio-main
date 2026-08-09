import fs from 'fs';
import path from 'path';

const COMMENTS_FILE = process.env.VERCEL ? '/tmp/comments.json' : path.resolve(process.cwd(), 'server/comments.json');
const DATA_JS_COMMENTS_FILE = path.resolve(process.cwd(), 'src/comments.js');

function getLocalComments() {
  try {
    if (fs.existsSync(COMMENTS_FILE)) {
      return JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf-8'));
    }
  } catch (e) {}

  return [
    {
      id: 'c_sample1',
      name: 'Sarah Chen',
      email: 'sarah@techlead.io',
      type: 'connect',
      message: 'Impressive backend work on high-throughput microservices and Kafka distributed locks! Would love to connect.',
      createdAt: '2026-08-08T14:20:00.000Z'
    }
  ];
}

function saveLocalComments(comments) {
  try {
    const dir = path.dirname(COMMENTS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2), 'utf-8');
  } catch (e) {}

  // Also maintain src/comments.js as JS export
  try {
    const jsContent = `export const COMMENTS = ${JSON.stringify(comments, null, 2)};\n`;
    fs.writeFileSync(DATA_JS_COMMENTS_FILE, jsContent, 'utf-8');
  } catch (e) {}
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const comments = getLocalComments();

  // GET: Fetch all feedback & connection comments
  if (req.method === 'GET') {
    return res.status(200).json({ success: true, comments });
  }

  // POST: Add new feedback / connect request
  if (req.method === 'POST') {
    const { name, email, linkedin, type, message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty.' });
    }

    const newComment = {
      id: 'c_' + Date.now(),
      name: name && name.trim() ? name.trim() : 'Anonymous Visitor',
      email: email && email.trim() ? email.trim() : '',
      linkedin: linkedin && linkedin.trim() ? linkedin.trim() : '',
      type: type || 'feedback', // 'connect' | 'feedback' | 'general'
      message: message.trim(),
      createdAt: new Date().toISOString()
    };

    comments.unshift(newComment);
    saveLocalComments(comments);

    return res.status(200).json({ success: true, comment: newComment, comments });
  }

  // DELETE: Remove comment (from Admin dashboard)
  if (req.method === 'DELETE') {
    const { id } = req.query || {};
    const updated = comments.filter(c => c.id !== id);
    saveLocalComments(updated);
    return res.status(200).json({ success: true, comments: updated });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
