'use client';

import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { HistoryItem } from '@/lib/storage';

interface UploadButtonProps {
    onUploadComplete: (item: HistoryItem) => void;
}

export default function UploadButton({ onUploadComplete }: UploadButtonProps) {
    const [uploading, setUploading] = useState(false);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const item = await res.json();
            onUploadComplete(item);
        } catch (error) {
            console.error(error);
            alert('Upload failed');
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    }

    return (
        <div className="relative">
            <input
                type="file"
                accept=".cif,.mmcif"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
            />
            <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={uploading}
            >
                {uploading ? <Loader2 className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4" />}
                {uploading ? 'Uploading...' : 'Upload mmCIF'}
            </button>
        </div>
    );
}
