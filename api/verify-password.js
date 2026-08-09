import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { password } = req.body || {};

  if (!password) {
    return res.status(400).json({ success: false, authenticated: false, error: 'Password required' });
  }

  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  const rawAdminPassword = process.env.ADMIN_PASSWORD;

  if (!storedHash && !rawAdminPassword) {
    return res.status(500).json({ 
      success: false, 
      authenticated: false, 
      error: 'ADMIN_PASSWORD or ADMIN_PASSWORD_HASH is not set in environment variables (.env).' 
    });
  }

  try {
    let isValid = false;

    // 1. If pre-hashed bcrypt password is provided in ADMIN_PASSWORD_HASH
    if (storedHash) {
      isValid = await bcrypt.compare(password, storedHash);
    } 
    // 2. If password (plain text or bcrypt hash string) is provided in ADMIN_PASSWORD
    else if (rawAdminPassword) {
      if (rawAdminPassword.startsWith('$2a$') || rawAdminPassword.startsWith('$2b$')) {
        isValid = await bcrypt.compare(password, rawAdminPassword);
      } else {
        isValid = (password === rawAdminPassword);
      }
    }

    if (isValid) {
      return res.status(200).json({ success: true, authenticated: true, message: 'Authentication successful' });
    } else {
      return res.status(401).json({ success: false, authenticated: false, error: 'Invalid Admin Password' });
    }
  } catch (err) {
    console.error('Bcrypt verification error:', err);
    return res.status(500).json({ success: false, authenticated: false, error: err.message });
  }
}
