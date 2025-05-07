export interface Issue {
    sector: number;
    zonesAffected: string[];
    thermalAgent: string;
    description: string;
    estimatedRestart: Date;
}
