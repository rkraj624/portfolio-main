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

  const { data, pdfBase64, pushToGit } = req.body || {};
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = 'rkraj624/portfolio-main';
  const BRANCH = 'main';

  // If no GitHub Token is provided in Vercel Environment Variables, notify user
  if (!GITHUB_TOKEN) {
    return res.status(200).json({
      success: true,
      gitPushed: false,
      message: 'Saved in session! To enable direct auto-push from Vercel to GitHub, add GITHUB_TOKEN in your Vercel Project Environment Variables.'
    });
  }

  try {
    // 1. Fetch current file SHA for src/data.js from GitHub API
    const dataJsUrl = `https://api.github.com/repos/${REPO}/contents/src/data.js`;
    const dataJsRes = await fetch(dataJsUrl, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, 'User-Agent': 'Vercel-Serverless' }
    });
    const dataJsFile = await dataJsRes.json();

    // 2. Update src/data.js on GitHub
    const dataContentBase64 = Buffer.from(
      `export const PORTFOLIO_DATA = ${JSON.stringify(data, null, 2)};\n`
    ).toString('base64');

    await fetch(dataJsUrl, {
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

    // 3. Update public/Ravi_Raja_Resume.pdf on GitHub if new PDF provided
    if (pdfBase64) {
      const pdfUrl = `https://api.github.com/repos/${REPO}/contents/public/Ravi_Raja_Resume.pdf`;
      const pdfRes = await fetch(pdfUrl, {
        headers: { Authorization: `token ${GITHUB_TOKEN}`, 'User-Agent': 'Vercel-Serverless' }
      });
      const pdfFile = await pdfRes.json();

      await fetch(pdfUrl, {
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
    }

    return res.status(200).json({
      success: true,
      gitPushed: true,
      message: 'Successfully updated src/data.js directly on GitHub via Vercel Serverless API!'
    });

  } catch (error) {
    console.error('GitHub API update error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
