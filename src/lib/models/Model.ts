import mongoose, { Schema, Model } from 'mongoose';

export interface IModel {
    id: string;
    originalName: string;
    path: string;
    fileSize: number;
    timestamp: number;
}

const ModelSchema = new Schema<IModel>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        originalName: {
            type: String,
            required: true,
        },
        path: {
            type: String,
            required: true,
        },
        fileSize: {
            type: Number,
            required: true,
        },
        timestamp: {
            type: Number,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

// Prevent model recompilation during hot reload
const ModelModel: Model<IModel> =
    mongoose.models.Model || mongoose.model<IModel>('Model', ModelSchema);

export default ModelModel;
