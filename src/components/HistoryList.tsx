'use client';

import React from 'react';
import { HistoryItem } from '@/lib/storage';

interface HistoryListProps {
    history: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
}

export default function HistoryList({ history, onSelect }: HistoryListProps) {
    return (
        <div className="w-full overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 uppercase tracking-wider text-xs font-medium">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-4 py-6 text-center text-gray-500 dark:text-slate-500">
                                    No files uploaded yet.
                                </td>
                            </tr>
                        ) : (
                            history.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white truncate max-w-[120px]" title={item.originalName}>
                                        {item.originalName}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-gray-500 dark:text-slate-400 text-xs">
                                        {item.id}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => onSelect(item)}
                                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors text-xs font-medium"
                                        >
                                            View
                                        </button>
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
