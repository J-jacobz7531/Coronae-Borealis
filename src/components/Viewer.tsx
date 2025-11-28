'use client';

import React, { useEffect, useRef } from 'react';
import { DefaultPluginSpec } from 'molstar/lib/mol-plugin/spec';
import { createPluginUI } from 'molstar/lib/mol-plugin-ui';
import { PluginUIContext } from 'molstar/lib/mol-plugin-ui/context';
import { renderReact18 } from 'molstar/lib/mol-plugin-ui/react18';
import { Color } from 'molstar/lib/mol-util/color';
import { ColorTheme } from 'molstar/lib/mol-theme/color';
import { ParamDefinition as PD } from 'molstar/lib/mol-util/param-definition';
import { TableLegend } from 'molstar/lib/mol-util/legend';
import 'molstar/lib/mol-plugin-ui/skin/light.scss';

interface ViewerProps {
    url?: string;
}

// Define pLDDT confidence color scheme matching Unity implementation
const pLDDTColors = {
    highConfidence: Color.fromRgb(0, 83, 214),      // pLDDT > 90 (Blue)
    confident: Color.fromRgb(101, 203, 243),        // pLDDT 70-90 (Light Blue)
    lowConfidence: Color.fromRgb(255, 219, 19),     // pLDDT 50-70 (Yellow)
    veryLowConfidence: Color.fromRgb(255, 125, 69), // pLDDT < 50 (Orange)
};

// Custom pLDDT Color Theme Provider
const pLDDTColorThemeProvider: ColorTheme.Provider<any, any> = {
    name: 'plddt-confidence',
    label: 'pLDDT Confidence',
    category: ColorTheme.Category.Validation,
    factory: (ctx: any, props: any) => {
        return {
            granularity: 'group',
            color: (location: any) => {
                // Get pLDDT value from the atom location
                const pLDDT = location?.unit?.model?.atomicConformation?.B_iso_or_equiv?.value(location.element) || 0;

                // Map pLDDT to confidence colors
                if (pLDDT >= 90) return pLDDTColors.highConfidence;
                if (pLDDT >= 70) return pLDDTColors.confident;
                if (pLDDT >= 50) return pLDDTColors.lowConfidence;
                return pLDDTColors.veryLowConfidence;
            },
            legend: TableLegend([
                ['High Confidence (≥90)', pLDDTColors.highConfidence],
                ['Confident (70-90)', pLDDTColors.confident],
                ['Low Confidence (50-70)', pLDDTColors.lowConfidence],
                ['Very Low (<50)', pLDDTColors.veryLowConfidence],
            ]),
        };
    },
    getParams: () => ({}),
    defaultValues: PD.getDefaultValues({}),
    isApplicable: () => true,
};

export default function Viewer({ url }: ViewerProps) {
    const parentRef = useRef<HTMLDivElement>(null);
    const pluginRef = useRef<PluginUIContext | null>(null);

    useEffect(() => {
        async function init() {
            // Prevent double initialization
            if (!parentRef.current || pluginRef.current) return;

            try {
                const plugin = await createPluginUI({
                    target: parentRef.current,
                    spec: DefaultPluginSpec(),
                    render: renderReact18,
                });

                // Register custom pLDDT color theme
                plugin.representation.structure.themes.colorThemeRegistry.add(
                    pLDDTColorThemeProvider as any
                );

                pluginRef.current = plugin;

                if (url) {
                    await loadStructure(plugin, url);
                }
            } catch (error) {
                console.error('Failed to initialize Mol* viewer', error);
            }
        }

        init();

        // Cleanup function
        return () => {
            if (pluginRef.current) {
                pluginRef.current.dispose();
                pluginRef.current = null;
            }
        };
    }, []); // Empty dependency array - only run once

    useEffect(() => {
        if (pluginRef.current && url) {
            loadStructure(pluginRef.current, url);
        }
    }, [url]); // Only re-run when URL changes

    async function loadStructure(plugin: PluginUIContext, structureUrl: string) {
        try {
            // Clear previous structure
            await plugin.clear();

            // Load CIF
            const data = await plugin.builders.data.download(
                { url: structureUrl },
                { state: { isGhost: true } }
            );

            const trajectory = await plugin.builders.structure.parseTrajectory(data, 'mmcif');

            // Apply default preset to create structure hierarchy
            await plugin.builders.structure.hierarchy.applyPreset(
                trajectory,
                'default'
            );

            // Get the loaded structure
            const structureRef = plugin.managers.structure.hierarchy.current.structures[0];

            // Apply custom pLDDT confidence color theme
            if (structureRef) {
                await plugin.managers.structure.component.updateRepresentationsTheme(
                    structureRef.components,
                    {
                        color: 'plddt-confidence' as any, // Use our custom theme
                    }
                );
            }
        } catch (e) {
            console.error('Failed to load structure', e);
        }
    }

    return (
        <div ref={parentRef} className="relative w-full h-full min-h-[600px]" />
    );
}