'use client';

import React from 'react';

const SEGMENTS = [
    {
        label: 'Very high (pLDDT > 90)',
        color: '#0053D6', // blue
    },
    {
        label: 'Confident (90 > pLDDT > 70)',
        color: '#00C9FF', // cyan
    },
    {
        label: 'Low (70 > pLDDT > 50)',
        color: '#FFE71A', // yellow
    },
    {
        label: 'Very low (pLDDT < 50)',
        color: '#FF9100', // orange
    },
];

export function PlddtLegend() {
    return (
        <div className="flex flex-wrap gap-6 text-xs sm:text-sm items-center justify-center sm:justify-start">
            {SEGMENTS.map((segment) => (
                <div key={segment.label} className="flex flex-col items-center">
                    <div
                        className="h-1.5 w-24 sm:w-32 rounded-full"
                        style={{ backgroundColor: segment.color }}
                    />
                    <span className="mt-1 text-slate-600 dark:text-slate-300 text-center text-[10px] sm:text-xs">
                        {segment.label}
                    </span>
                </div>
            ))}
        </div>
    );
}
