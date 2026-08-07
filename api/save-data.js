export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const { data, pdfBase64, avatarBase64, pushToGit, password } = req.body || {};
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = 'rkraj624/portfolio-main';
  const BRANCH = 'main';

  // 1. Password Security Check
  if (ADMIN_PASSWORD && password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid Admin Password' });
  }

  // 2. If pushToGit is false or GITHUB_TOKEN is missing, return early
  if (!pushToGit || !GITHUB_TOKEN) {
    return res.status(200).json({
      success: true,
      gitPushed: false,
      message: 'No GitHub push executed (Auto-Push is off or GITHUB_TOKEN missing).'
    });
  }

  try {
    let hasAnyChangesPushed = false;

    // 3. Check & Update src/data.js on GitHub only if content has actually changed
    if (data) {
      const dataJsUrl = `https://api.github.com/repos/${REPO}/contents/src/data.js`;
      const dataJsRes = await fetch(dataJsUrl, {
        headers: { Authorization: `token ${GITHUB_TOKEN}`, 'User-Agent': 'Vercel-Serverless' }
      });
      
      if (dataJsRes.ok) {
        const dataJsFile = await dataJsRes.json();
        const dataContentRaw = `export const PORTFOLIO_DATA = ${JSON.stringify(data, null, 2)};\n`;
        const dataContentBase64 = Buffer.from(dataContentRaw).toString('base64');
        
        // Normalize whitespace for exact string comparison
        const existingClean = (dataJsFile.content || '').replace(/\s/g, '');
        const newClean = dataContentBase64.replace(/\s/g, '');

        // ONLY trigger GitHub API call if the data has actually changed!
        if (existingClean !== newClean) {
          const putRes = await fetch(dataJsUrl, {
            method: 'PUT',
            headers: {
              Authorization: `token ${GITHUB_TOKEN}`,
              'Content-Type': 'application/json',
              'User-Agent': 'Vercel-Serverless'
            },
            body: JSON.stringify({
              message: `chore: update portfolio contents via dashboard [${new Date().toLocaleString()}]`,
              content: dataContentBase64,
              sha: dataJsFile.sha,
              branch: BRANCH
            })
          });

          if (!putRes.ok) {
            const errData = await putRes.json();
            throw new Error(`GitHub PUT data.js error: ${errData.message || putRes.statusText}`);
          }
          hasAnyChangesPushed = true;
        }
      }
    }

    // 4. Update public/Ravi_Raja_Resume.pdf on GitHub ONLY if new PDF uploaded
    if (pdfBase64) {
      const pdfUrl = `https://api.github.com/repos/${REPO}/contents/public/Ravi_Raja_Resume.pdf`;
      const pdfRes = await fetch(pdfUrl, {
        headers: { Authorization: `token ${GITHUB_TOKEN}`, 'User-Agent': 'Vercel-Serverless' }
      });
      const pdfFile = pdfRes.ok ? await pdfRes.json() : {};

      const putPdfRes = await fetch(pdfUrl, {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Vercel-Serverless'
        },
        body: JSON.stringify({
          message: `chore: update resume PDF via dashboard [${new Date().toLocaleString()}]`,
          content: pdfBase64,
          sha: pdfFile.sha,
          branch: BRANCH
        })
      });

      if (!putPdfRes.ok) {
        const errData = await putPdfRes.json();
        throw new Error(`GitHub PUT PDF error: ${errData.message || putPdfRes.statusText}`);
      }
      hasAnyChangesPushed = true;
    }

    // 5. Update public/avatar.jpg on GitHub ONLY if new avatar image uploaded
    if (avatarBase64) {
      const avatarUrl = `https://api.github.com/repos/${REPO}/contents/public/avatar.jpg`;
      const avatarRes = await fetch(avatarUrl, {
        headers: { Authorization: `token ${GITHUB_TOKEN}`, 'User-Agent': 'Vercel-Serverless' }
      });
      const avatarFile = avatarRes.ok ? await avatarRes.json() : {};

      const putAvatarRes = await fetch(avatarUrl, {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Vercel-Serverless'
        },
        body: JSON.stringify({
          message: `chore: update avatar profile image via dashboard [${new Date().toLocaleString()}]`,
          content: avatarBase64,
          sha: avatarFile.sha,
          branch: BRANCH
        })
      });

      if (!putAvatarRes.ok) {
        const errData = await putAvatarRes.json();
        throw new Error(`GitHub PUT avatar error: ${errData.message || putAvatarRes.statusText}`);
      }
      hasAnyChangesPushed = true;
    }

    if (!hasAnyChangesPushed) {
      return res.status(200).json({
        success: true,
        gitPushed: false,
        message: 'No changes detected. GitHub push skipped!'
      });
    }

    return res.status(200).json({
      success: true,
      gitPushed: true,
      message: 'Successfully synced changes directly to GitHub!'
    });

  } catch (error) {
    console.error('GitHub API update error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
