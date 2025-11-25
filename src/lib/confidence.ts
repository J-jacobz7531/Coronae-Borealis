export type ConfidenceBand = 'Very high' | 'Confident' | 'Low' | 'Very low';

export interface PlddtBandResult {
    band: ConfidenceBand;
    color: string;
}

/**
 * Map a pLDDT value (0–100) to a confidence band and hex colour
 * consistent with the Alphafold legend.
 */
export function getPlddtBand(plddt: number): PlddtBandResult {
    if (plddt > 90) {
        // Very high
        return { band: 'Very high', color: '#0053D6' }; // blue
    } else if (plddt > 70) {
        // Confident
        return { band: 'Confident', color: '#00C9FF' }; // cyan
    } else if (plddt > 50) {
        // Low
        return { band: 'Low', color: '#FFE71A' }; // yellow
    } else {
        // Very low
        return { band: 'Very low', color: '#FF9100' }; // orange
    }
}
