import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import ModelModel from '../src/lib/models/Model';

const HISTORY_FILE = path.join(process.cwd(), 'history.json');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/molstar-viewer';

interface HistoryItem {
    id: string;
    originalName: string;
    path: string;
    timestamp: number;
}

async function migrate() {
    try {
        console.log('🔄 Starting migration from history.json to MongoDB...\n');

        // Check if history.json exists
        if (!fs.existsSync(HISTORY_FILE)) {
            console.log('❌ history.json not found. Nothing to migrate.');
            return;
        }

        // Read history.json
        const data = fs.readFileSync(HISTORY_FILE, 'utf-8');
        const history: HistoryItem[] = JSON.parse(data);

        console.log(`📁 Found ${history.length} models in history.json`);

        if (history.length === 0) {
            console.log('✅ No models to migrate.');
            return;
        }

        // Connect to MongoDB
        console.log(`🔌 Connecting to MongoDB at ${MONGODB_URI}...`);
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Migrate each item
        let successCount = 0;
        let skipCount = 0;

        for (const item of history) {
            try {
                // Check if already exists
                const existing = await ModelModel.findOne({ id: item.id });
                if (existing) {
                    console.log(`⏭️  Skipping ${item.id} (already exists)`);
                    skipCount++;
                    continue;
                }

                // Get file size
                const filePath = path.join(process.cwd(), 'uploads', item.path);
                let fileSize = 0;
                if (fs.existsSync(filePath)) {
                    const stats = fs.statSync(filePath);
                    fileSize = stats.size;
                }

                // Insert into MongoDB
                await ModelModel.create({
                    id: item.id,
                    originalName: item.originalName,
                    path: item.path,
                    fileSize,
                    timestamp: item.timestamp,
                });

                console.log(`✅ Migrated ${item.id} - ${item.originalName}`);
                successCount++;
            } catch (error) {
                console.error(`❌ Failed to migrate ${item.id}:`, error);
            }
        }

        console.log(`\n📊 Migration Summary:`);
        console.log(`   ✅ Successfully migrated: ${successCount}`);
        console.log(`   ⏭️  Skipped (already exist): ${skipCount}`);
        console.log(`   ❌ Failed: ${history.length - successCount - skipCount}`);

        // Backup history.json
        const backupPath = path.join(process.cwd(), 'history.json.backup');
        fs.copyFileSync(HISTORY_FILE, backupPath);
        console.log(`\n💾 Backed up history.json to history.json.backup`);

        console.log('\n✅ Migration completed successfully!');
        console.log('   You can now delete history.json if everything works correctly.');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

// Run migration
migrate();
