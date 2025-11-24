'use client';

import React from 'react';
import { HistoryItem } from '@/lib/storage';
import { FileText, Download, Eye } from 'lucide-react';

interface HistoryListProps {
    history: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
}

export default function HistoryList({ history, onSelect }: HistoryListProps) {
    return (
        <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">History</h3>
            {history.length === 0 ? (
                <p className="text-sm text-gray-500">No files uploaded yet.</p>
            ) : (
                <ul className="space-y-2">
                    {history.map((item) => (
                        <li
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-sm truncate" title={item.originalName}>
                                    {item.originalName}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onSelect(item)}
                                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                                    title="View"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                                <a
                                    href={`/api/download/${item.id}`}
                                    className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                                    title="Download"
                                    download
                                >
                                    <Download className="w-4 h-4" />
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
