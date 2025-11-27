import fs from 'fs';
import path from 'path';
import connectDB from './db';
import ModelModel from './models/Model';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export interface HistoryItem {
  id: string;
  originalName: string;
  path: string;
  timestamp: number;
  fileSize?: number;
}

export async function saveFile(file: File): Promise<HistoryItem> {
  await connectDB();

  const buffer = Buffer.from(await file.arrayBuffer());

  // Generate a unique 4-character alphanumeric ID
  let id = '';
  let isUnique = false;

  while (!isUnique) {
    id = Math.random().toString(36).substring(2, 6).toUpperCase();
    const existing = await ModelModel.findOne({ id });
    if (!existing) {
      isUnique = true;
    }
  }

  const extension = path.extname(file.name);
  const fileName = `${id}${extension}`;
  const filePath = path.join(UPLOADS_DIR, fileName);

  await fs.promises.writeFile(filePath, buffer);

  const item = {
    id,
    originalName: file.name,
    path: fileName,
    fileSize: buffer.length,
    timestamp: Date.now(),
  };

  // Save to MongoDB
  try {
    console.log('🔄 Attempting to save to MongoDB:', item);
    const savedModel = await ModelModel.create(item);
    console.log('✅ Successfully saved to MongoDB:', savedModel);
  } catch (error) {
    console.error('❌ Error saving to MongoDB:', error);
    throw error;
  }

  return item;
}

export async function getHistory(): Promise<HistoryItem[]> {
  try {
    await connectDB();
    console.log('🔍 Fetching history from MongoDB...');

    const models = await ModelModel.find()
      .sort({ timestamp: -1 })
      .lean();

    console.log(`📊 Found ${models.length} models in MongoDB`);

    return models.map((model) => ({
      id: model.id,
      originalName: model.originalName,
      path: model.path,
      timestamp: model.timestamp,
      fileSize: model.fileSize,
    }));
  } catch (error) {
    console.error('❌ Error reading history from MongoDB:', error);
    return [];
  }
}

export async function getFilePath(id: string): Promise<string | null> {
  try {
    await connectDB();

    const model = await ModelModel.findOne({ id }).lean();
    if (!model) return null;

    return path.join(UPLOADS_DIR, model.path);
  } catch (error) {
    console.error('Error getting file path:', error);
    return null;
  }
}
