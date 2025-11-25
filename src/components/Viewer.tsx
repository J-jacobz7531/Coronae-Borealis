'use client';

import React, { useEffect, useRef } from 'react';
import { DefaultPluginSpec } from 'molstar/lib/mol-plugin/spec';
import { createPluginUI } from 'molstar/lib/mol-plugin-ui';
import { PluginUIContext } from 'molstar/lib/mol-plugin-ui/context';
import { renderReact18 } from 'molstar/lib/mol-plugin-ui/react18';
import 'molstar/lib/mol-plugin-ui/skin/light.scss';

interface ViewerProps {
    url?: string;
}

export default function Viewer({ url }: ViewerProps) {
    const parentRef = useRef<HTMLDivElement>(null);
    const pluginRef = useRef<PluginUIContext | null>(null);
    const isInitializedRef = useRef<boolean>(false);

    useEffect(() => {
        async function init() {
            if (!parentRef.current || pluginRef.current || isInitializedRef.current) return;

            isInitializedRef.current = true;

            if (parentRef.current) {
                parentRef.current.innerHTML = '';
            }

            try {
                const plugin = await createPluginUI({
                    target: parentRef.current,
                    spec: DefaultPluginSpec(),
                    render: renderReact18,
                });

                pluginRef.current = plugin;

                if (url) {
                    loadStructure(url);
                }
            } catch (error) {
                console.error('Failed to initialize Mol* viewer', error);
                isInitializedRef.current = false;
            }
        }

        init();

        return () => {
            if (pluginRef.current) {
                pluginRef.current.dispose();
                pluginRef.current = null;
            }
            isInitializedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (pluginRef.current && url) {
            pluginRef.current.clear();
            loadStructure(url);
        }
    }, [url]);

    async function loadStructure(structureUrl: string) {
        if (!pluginRef.current) return;

        try {
            // Load CIF
            const data = await pluginRef.current.builders.data.download(
                { url: structureUrl },
                { state: { isGhost: true } }
            );

            const trajectory = await pluginRef.current.builders.structure.parseTrajectory(data, 'mmcif');

            // IMPORTANT: Use correct preset for AlphaFold models
            await pluginRef.current.builders.structure.hierarchy.applyPreset(
                trajectory,
                'default'
            );

            // Get the loaded structure
            const structureRef = pluginRef.current.managers.structure.hierarchy.current.structures[0];

            // Apply proper pLDDT confidence theme
            if (structureRef) {
                await pluginRef.current.managers.structure.component.updateRepresentationsTheme(
                    structureRef.components,
                    {
                        color: 'plddt' as any
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
