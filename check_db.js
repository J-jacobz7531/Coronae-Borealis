
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Connect to MongoDB
const MONGODB_URI = 'mongodb+srv://jamie:jamie1357@alphafold.rvhk28q.mongodb.net/Alphafold?appName=Alphafold';

const ModelSchema = new mongoose.Schema(
    {
        id: { type: String, required: true, unique: true },
        originalName: { type: String, required: true },
        path: { type: String, required: true },
        fileSize: { type: Number, required: true },
        timestamp: { type: Number, required: true },
    },
    { timestamps: true }
);

const Model = mongoose.models.Model || mongoose.model('Model', ModelSchema);

async function checkConsistency() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const models = await Model.find({});
        console.log(`Found ${models.length} models in DB`);

        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            console.log('Uploads directory does not exist!');
            return;
        }

        const files = fs.readdirSync(uploadsDir);
        console.log(`Found ${files.length} files in uploads directory`);

        let missingFiles = 0;
        for (const model of models) {
            const filePath = path.join(uploadsDir, model.path);
            if (!fs.existsSync(filePath)) {
                console.log(`❌ Missing file for model ${model.id} (${model.originalName}): ${model.path}`);
                missingFiles++;
            } else {
                console.log(`✅ File exists for model ${model.id}: ${model.path}`);
            }
        }

        console.log(`\nSummary: ${missingFiles} missing files out of ${models.length} records.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkConsistency();
