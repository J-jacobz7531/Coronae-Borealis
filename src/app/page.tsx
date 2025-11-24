'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import UploadButton from '@/components/UploadButton';
import HistoryList from '@/components/HistoryList';
import { HistoryItem } from '@/lib/storage';

const Viewer = dynamic(() => import('@/components/Viewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[600px] flex items-center justify-center bg-gray-100 text-gray-500">
      Loading Viewer...
    </div>
  ),
});

export default function Home() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<string | undefined>();

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  }

  function handleUploadComplete(item: HistoryItem) {
    setHistory((prev) => [item, ...prev]);
    handleSelect(item);
  }

  function handleSelect(item: HistoryItem) {
    // Construct the URL for the file
    // Since the file is served via the download API, we can use that URL
    // But Mol* might need a direct file URL or we can fetch it and pass data.
    // For simplicity, let's use the download URL which serves the file content.
    // However, Mol* download builder expects a URL that returns the file.
    // Our /api/download/[id] returns the file with octet-stream.
    // Let's try passing that URL.
    const url = `/api/download/${item.id}`;
    setSelectedUrl(url);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Mol* Viewer</h1>
          <UploadButton onUploadComplete={handleUploadComplete} />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <HistoryList history={history} onSelect={handleSelect} />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden h-[600px]">
              <Viewer url={selectedUrl} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
