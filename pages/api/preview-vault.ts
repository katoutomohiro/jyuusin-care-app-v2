import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

type DailyPreviewMeta = {
  userId: string;
  dateKey: string; // YYYY-MM-DD
  year: number;
  month: number; // 1-12
  pdfUrl: string;
  bytes?: number;
  createdAt: string;
  updatedAt?: string;
};

const root = process.cwd();
const dataDir = path.join(root, '.data', 'preview-vault');
async function ensureDir(dir: string) { try { await fs.mkdir(dir, { recursive: true }); } catch {} }
function filePath(userId: string, year: number) { return path.join(dataDir, userId, `${year}.json`); }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const userId = String(req.query.userId ?? '');
    const year = Number(req.query.year ?? new Date().getFullYear());
    if (!userId) return res.status(400).json({ error: 'userId required' });
    await ensureDir(path.join(dataDir, userId));
    const fp = filePath(userId, year);
    try {
      const raw = await fs.readFile(fp, 'utf-8');
      const items = JSON.parse(raw) as DailyPreviewMeta[];
      return res.status(200).json({ userId, year, items });
    } catch {
      return res.status(200).json({ userId, year, items: [] });
    }
  }
  if (req.method === 'POST') {
    const meta = req.body as DailyPreviewMeta;
    if (!meta?.userId || !meta?.dateKey || !meta?.year || !meta?.month || !meta?.pdfUrl) {
      return res.status(400).json({ error: 'invalid meta' });
    }
    await ensureDir(path.join(dataDir, meta.userId));
    const fp = filePath(meta.userId, meta.year);
    let items: DailyPreviewMeta[] = [];
    try {
      const raw = await fs.readFile(fp, 'utf-8');
      items = JSON.parse(raw) as DailyPreviewMeta[];
    } catch {}
    const now = new Date().toISOString();
    const up = { ...meta, updatedAt: now, createdAt: meta.createdAt ?? now };
    const ix = items.findIndex(i => i.dateKey === meta.dateKey);
    if (ix >= 0) items[ix] = up; else items.push(up);
    await fs.writeFile(fp, JSON.stringify(items, null, 2), 'utf-8');
    return res.status(200).json(up);
  }
  res.setHeader('Allow', 'GET, POST');
  return res.status(405).end('Method Not Allowed');
}
