'use client';

import React from 'react';
import { HistoryItem } from '@/lib/storage';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface HistoryListProps {
    history: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        onPageChange: (page: number) => void;
    };
}

export default function HistoryList({ history, onSelect, pagination }: HistoryListProps) {
    const { currentPage, totalPages, totalItems, itemsPerPage, onPageChange } = pagination || {};

    const startItem = currentPage && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = currentPage && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems || 0) : 0;

    return (
        <div className="w-full overflow-hidden flex flex-col">
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

            {pagination && totalPages && totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/30">
                    <div className="text-xs text-gray-500 dark:text-slate-400">
                        {startItem}-{endItem} of {totalItems}
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onPageChange?.(1)}
                            disabled={currentPage === 1}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-slate-300"
                            title="First page"
                        >
                            <ChevronsLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onPageChange?.((currentPage || 1) - 1)}
                            disabled={currentPage === 1}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-slate-300"
                            title="Previous page"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onPageChange?.((currentPage || 1) + 1)}
                            disabled={currentPage === totalPages}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-slate-300"
                            title="Next page"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onPageChange?.(totalPages || 1)}
                            disabled={currentPage === totalPages}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-slate-300"
                            title="Last page"
                        >
                            <ChevronsRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
