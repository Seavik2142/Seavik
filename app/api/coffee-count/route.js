import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const GOOGLE_SHEET_WEBAPP_URL = process.env.GOOGLE_SHEET_WEBAPP_URL;

const countFilePath = path.join(process.cwd(), 'data', 'coffee-count.json');

function ensureFile() {
  const dir = path.dirname(countFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(countFilePath)) {
    fs.writeFileSync(countFilePath, JSON.stringify({ count: 0 }), 'utf8');
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

export async function GET() {
  if (GOOGLE_SHEET_WEBAPP_URL) {
    const sheetCount = await sheetGet();
    if (sheetCount !== null) return NextResponse.json({ count: sheetCount });
  }

  try {
    ensureFile();
    const raw = fs.readFileSync(countFilePath, 'utf8');
    const data = JSON.parse(raw);
    return NextResponse.json({ count: data.count ?? 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}

export async function POST() {
  if (GOOGLE_SHEET_WEBAPP_URL) {
    const newCount = await sheetPost();
    if (newCount !== null) {
      return NextResponse.json({ count: newCount });
    }
  }

  try {
    ensureFile();
    const raw = fs.readFileSync(countFilePath, 'utf8');
    const data = JSON.parse(raw);
    const next = { count: (data.count ?? 0) + 1 };
    fs.writeFileSync(countFilePath, JSON.stringify(next), 'utf8');
    return NextResponse.json(next);
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
