export interface ProjectPreset {
    name: string;
    description: string;
    files: Record<string, string>;
    dependencies: string[];
    devDependencies: string[];
    scripts: Record<string, string>;
    gitignore: string[];
}
export declare const PRESETS: Record<string, ProjectPreset>;
//# sourceMappingURL=presets.d.ts.map