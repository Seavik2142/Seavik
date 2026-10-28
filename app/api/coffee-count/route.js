import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

const GOOGLE_SHEET_WEBAPP_URL = process.env.GOOGLE_SHEET_WEBAPP_URL;
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Bundled baseline file (read-only on Vercel)
const bundledFilePath = path.join(process.cwd(), 'data', 'coffee-count.json');
// Writable temp file for serverless environments (Vercel / AWS Lambda / Linux / Mac)
const tmpFilePath = path.join(os.tmpdir(), 'seavik-coffee-count.json');

// Global in-memory cache across requests in the same container instance
let inMemoryCount = null;

function readBaselineCount() {
  try {
    if (fs.existsSync(bundledFilePath)) {
      const raw = fs.readFileSync(bundledFilePath, 'utf8');
      const data = JSON.parse(raw);
      if (typeof data.count === 'number' && Number.isFinite(data.count)) {
        return data.count;
      }
    }
  } catch {
    // Read fallback
  }
  return 37;
}

function getStoredLocalCount() {
  // 1. Check temp file if previously written
  try {
    if (fs.existsSync(tmpFilePath)) {
      const raw = fs.readFileSync(tmpFilePath, 'utf8');
      const data = JSON.parse(raw);
      if (typeof data.count === 'number' && Number.isFinite(data.count)) {
        return data.count;
      }
    }
  } catch {
    // Ignore error
  }

  // 2. Fall back to bundled data file
  return readBaselineCount();
}

function saveLocalCount(newCount) {
  // Try writing to local bundled path (works in local dev)
  try {
    const dir = path.dirname(bundledFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(bundledFilePath, JSON.stringify({ count: newCount }), 'utf8');
  } catch {
    // EROFS on Vercel is expected - ignore
  }

  // Always write to OS temp directory (always writable on Vercel)
  try {
    fs.writeFileSync(tmpFilePath, JSON.stringify({ count: newCount }), 'utf8');
  } catch {
    // Ignore error
  }
}

async function sheetGet() {
  if (!GOOGLE_SHEET_WEBAPP_URL) return null;
  try {
    const res = await fetch(GOOGLE_SHEET_WEBAPP_URL, {
      method: 'GET',
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    const num = Number(data.count);
    return Number.isFinite(num) ? num : null;
  } catch {
    return null;
  }
}

async function sheetPost() {
  if (!GOOGLE_SHEET_WEBAPP_URL) return null;
  try {
    const res = await fetch(GOOGLE_SHEET_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'increment' }),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    const num = Number(data.count);
    return Number.isFinite(num) ? num : null;
  } catch {
    return null;
  }
}

async function kvGet() {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const res = await fetch(`${KV_URL}/get/seavik_coffee_count`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    const val = Number(data.result);
    return Number.isFinite(val) ? val : null;
  } catch {
    return null;
  }
}

async function kvIncr() {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const res = await fetch(`${KV_URL}/incr/seavik_coffee_count`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    const val = Number(data.result);
    return Number.isFinite(val) ? val : null;
  } catch {
    return null;
  }
}

export async function GET() {
  // 1. Google Sheet WebApp
  if (GOOGLE_SHEET_WEBAPP_URL) {
    const sheetCount = await sheetGet();
    if (sheetCount !== null) {
      inMemoryCount = Math.max(sheetCount, inMemoryCount || 0);
      return NextResponse.json({ count: inMemoryCount });
    }
  }

  // 2. Vercel KV / Upstash Redis
  if (KV_URL && KV_TOKEN) {
    const kvCount = await kvGet();
    if (kvCount !== null) {
      inMemoryCount = Math.max(kvCount, inMemoryCount || 0);
      return NextResponse.json({ count: inMemoryCount });
    }
  }

  // 3. Local filesystem + /tmp + in-memory store
  const localCount = getStoredLocalCount();
  const currentCount = Math.max(localCount, inMemoryCount || 0, 37);
  inMemoryCount = currentCount;

  return NextResponse.json({ count: currentCount });
}

export async function POST(req) {
  let clientTarget = 0;
  try {
    const body = await req.json();
    if (body && typeof body.clientCount === 'number' && Number.isFinite(body.clientCount)) {
      clientTarget = body.clientCount;
    }
  } catch {
    // Non-JSON or empty POST is fine
  }

  // 1. Google Sheet WebApp
  if (GOOGLE_SHEET_WEBAPP_URL) {
    const sheetCount = await sheetPost();
    if (sheetCount !== null) {
      inMemoryCount = Math.max(sheetCount, clientTarget, inMemoryCount || 0);
      return NextResponse.json({ count: inMemoryCount });
    }
  }

  // 2. Vercel KV / Upstash Redis
  if (KV_URL && KV_TOKEN) {
    const kvCount = await kvIncr();
    if (kvCount !== null) {
      inMemoryCount = Math.max(kvCount, clientTarget, inMemoryCount || 0);
      return NextResponse.json({ count: inMemoryCount });
    }
  }

  // 3. Local + /tmp + in-memory fallback
  const currentLocal = getStoredLocalCount();
  const baseline = Math.max(currentLocal, inMemoryCount || 0, 37);
  const nextCount = Math.max(baseline + 1, clientTarget);
  inMemoryCount = nextCount;

  saveLocalCount(nextCount);

  return NextResponse.json({ count: nextCount });
}
