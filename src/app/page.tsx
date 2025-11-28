'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import UploadButton from '@/components/UploadButton';
import HistoryList from '@/components/HistoryList';
import ThemeToggle from '@/components/ThemeToggle';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';

import { HistoryItem } from '@/lib/storage';
import { Dna, HelpCircle } from 'lucide-react';

const Viewer = dynamic(() => import('@/components/Viewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[600px] flex items-center justify-center bg-gray-100 dark:bg-slate-900 text-gray-500">
      Loading Viewer...
    </div>
  ),
});

export default function Home() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<string | undefined>();
  const [currentFile, setCurrentFile] = useState<HistoryItem | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

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
    setHistory(prev => [item, ...prev]);
    setCurrentPage(1); // Reset to first page on new upload
    handleSelect(item);
  }

  function handleSelect(item: HistoryItem) {
    const url = `/api/view/${item.id}`;
    setSelectedUrl(url);
    setCurrentFile(item);
  }

  // Pagination Logic
  const totalItems = history.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentHistory = history.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  const titleWords = [
    {
      text: "Alphafold",
      className: "text-red-800 dark:text-red-600",
    },
    {
      text: "VR",
      className: "text-red-800 dark:text-red-600",
    },
    {
      text: "Model",
      className: "text-red-800 dark:text-red-600",
    },
    {
      text: "Viewer",
      className: "text-red-800 dark:text-red-600",
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground p-8 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center">
              <Dna className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <TypewriterEffectSmooth
                words={titleWords}
                className="text-4xl font-black tracking-tight"
              />
              <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
                Upload a 3D model in mmCIF format to visualize its protein structure in real-time.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="p-2 text-gray-400 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-slate-800">
              <HelpCircle className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Action Bar */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
            <span className="font-medium text-gray-500 dark:text-slate-400">Viewing:</span>
            <span className="font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded text-sm">
              {currentFile ? currentFile.originalName : 'No model loaded'}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={currentFile ? `/api/download/${currentFile.id}` : '#'}
              className={`px-6 py-2.5 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-colors text-center ${!currentFile ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                }`}
              download={currentFile ? currentFile.originalName : undefined}
            >
              Download
            </a>
            <UploadButton onUploadComplete={handleUploadComplete} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Viewer Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden h-[600px] relative group transition-colors duration-300">
              <Viewer url={selectedUrl} />
              {/* Overlay Controls Placeholder */}
              <div className="absolute bottom-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Model Details Panel */}
            {currentFile && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm transition-colors duration-300">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Model details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-slate-400">File name</span>
                    <span
                      className="text-gray-900 dark:text-slate-200 truncate max-w-[150px]"
                      title={currentFile.originalName}
                    >
                      {currentFile.originalName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-slate-400">ID</span>
                    <span className="text-gray-900 dark:text-slate-200 font-mono">
                      {currentFile.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-slate-400">Uploaded</span>
                    <span className="text-gray-900 dark:text-slate-200">
                      {new Date(currentFile.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>


              </div>

            )}

            {/* History List */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
              <div className="p-4 border-b border-gray-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upload history
                </h3>
              </div>
              <div className="p-0">
                <HistoryList
                  history={currentHistory}
                  onSelect={handleSelect}
                  pagination={{
                    currentPage,
                    totalPages,
                    totalItems,
                    itemsPerPage: ITEMS_PER_PAGE,
                    onPageChange: handlePageChange
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
