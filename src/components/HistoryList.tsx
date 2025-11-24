'use client';

import React from 'react';
import { HistoryItem } from '@/lib/storage';
import { Eye, Trash2 } from 'lucide-react';

interface HistoryListProps {
    history: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
}

export default function HistoryList({ history, onSelect }: HistoryListProps) {
    function formatDate(timestamp: number) {
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
        });
    }

    return (
        <div className="w-full overflow-hidden rounded-lg border border-slate-700 bg-slate-900 text-slate-200 shadow-xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-800 text-slate-400 uppercase tracking-wider text-xs font-medium">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Date Uploaded</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                    No files uploaded yet.
                                </td>
                            </tr>
                        ) : (
                            history.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">
                                        {item.originalName}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-slate-400">
                                        {item.id}
                                    </td>
                                    <td className="px-6 py-4 text-slate-400">
                                        {formatDate(item.timestamp)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => onSelect(item)}
                                                className="text-slate-400 hover:text-blue-400 transition-colors"
                                                title="View"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                className="text-slate-400 hover:text-red-400 transition-colors"
                                                title="Delete (Not Implemented)"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
