import fs from 'fs';
import path from 'path';
import Redis from 'ioredis';

const METRICS_FILE = process.env.VERCEL ? '/tmp/metrics.json' : path.resolve(process.cwd(), 'server/metrics.json');

// 1. Support direct REDIS_URI / REDIS_URL (rediss:// or redis://)
const REDIS_URI = process.env.REDIS_URI || process.env.REDIS_URL;

// 2. Support Upstash REST API fallback (KV_REST_API_URL & KV_REST_API_TOKEN)
const KV_REST_API_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

let redisClient = null;

function getRedisInstance() {
  if (!redisClient && REDIS_URI) {
    try {
      redisClient = new Redis(REDIS_URI, {
        connectTimeout: 5000,
        maxRetriesPerRequest: 1,
        lazyConnect: true
      });
    } catch (e) {
      console.error('Redis Init Error:', e);
    }
  }
  return redisClient;
}

async function getKvMetrics() {
  // Option A: ioredis via REDIS_URI / REDIS_URL
  const client = getRedisInstance();
  if (client) {
    try {
      if (client.status === 'wait') await client.connect();
      const val = await client.get('portfolio_metrics');
      if (val) {
        return typeof val === 'string' ? JSON.parse(val) : val;
      }
    } catch (e) {
      console.error('Redis Client Read Error:', e);
    }
  }

  // Option B: Upstash REST API via KV_REST_API_URL & TOKEN
  if (KV_REST_API_URL && KV_REST_API_TOKEN) {
    try {
      const res = await fetch(`${KV_REST_API_URL}/get/portfolio_metrics`, {
        headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
        }
      }
    } catch (e) {
      console.error('KV REST Read Error:', e);
    }
  }

  // Option C: Local file / /tmp fallback
  try {
    if (fs.existsSync(METRICS_FILE)) {
      return JSON.parse(fs.readFileSync(METRICS_FILE, 'utf-8'));
    }
  } catch (e) {}

  return { pageViews: 0, audioListens: 0, audioCompletions: 0, lastUpdated: new Date().toISOString() };
}

async function saveKvMetrics(metrics) {
  // Option A: ioredis via REDIS_URI
  const client = getRedisInstance();
  if (client) {
    try {
      if (client.status === 'wait') await client.connect();
      await client.set('portfolio_metrics', JSON.stringify(metrics));
    } catch (e) {
      console.error('Redis Client Write Error:', e);
    }
  }

  // Option B: Upstash REST API
  if (KV_REST_API_URL && KV_REST_API_TOKEN) {
    try {
      await fetch(`${KV_REST_API_URL}/set/portfolio_metrics`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
        body: JSON.stringify(metrics)
      });
    } catch (e) {
      console.error('KV REST Write Error:', e);
    }
  }

  // Option C: Sync to local disk / /tmp file
  try {
    const dir = path.dirname(METRICS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(METRICS_FILE, JSON.stringify(metrics, null, 2), 'utf-8');
  } catch (e) {}
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const isConfigured = !!(REDIS_URI || (KV_REST_API_URL && KV_REST_API_TOKEN));
  const metrics = await getKvMetrics();

  // GET: Fetch current counts
  if (req.method === 'GET') {
    return res.status(200).json({ success: true, metrics, isKvConfigured: isConfigured });
  }

  // POST: Increment metric
  if (req.method === 'POST') {
    const { type } = req.body || {};

    if (type === 'pageview') {
      metrics.pageViews = (metrics.pageViews || 0) + 1;
    } else if (type === 'audio_listen') {
      metrics.audioListens = (metrics.audioListens || 0) + 1;
    } else if (type === 'audio_completion') {
      metrics.audioCompletions = (metrics.audioCompletions || 0) + 1;
    }

    metrics.lastUpdated = new Date().toISOString();
    await saveKvMetrics(metrics);

    return res.status(200).json({ success: true, metrics, isKvConfigured: isConfigured });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
