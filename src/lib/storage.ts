import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const HISTORY_FILE = path.join(process.cwd(), 'history.json');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

if (!fs.existsSync(HISTORY_FILE)) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify([]));
}

export interface HistoryItem {
  id: string;
  originalName: string;
  path: string;
  timestamp: number;
}

export async function saveFile(file: File): Promise<HistoryItem> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const id = uuidv4();
  const extension = path.extname(file.name);
  const fileName = `${id}${extension}`;
  const filePath = path.join(UPLOADS_DIR, fileName);

  await fs.promises.writeFile(filePath, buffer);

  const item: HistoryItem = {
    id,
    originalName: file.name,
    path: fileName,
    timestamp: Date.now(),
  };

  const history = await getHistory();
  history.unshift(item);
  await fs.promises.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));

  return item;
}

export async function getHistory(): Promise<HistoryItem[]> {
  try {
    const data = await fs.promises.readFile(HISTORY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function getFilePath(id: string): Promise<string | null> {
  const history = await getHistory();
  const item = history.find((i) => i.id === id);
  if (!item) return null;
  return path.join(UPLOADS_DIR, item.path);
}
