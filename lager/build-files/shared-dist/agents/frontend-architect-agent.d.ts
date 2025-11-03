import { type AIProvider } from '../ai-gateway/index.js';
export interface ComponentStructure {
    name: string;
    type: 'page' | 'layout' | 'component' | 'hook' | 'util' | 'context';
    path: string;
    dependencies: string[];
    props?: Record<string, string>;
    state?: string[];
    description: string;
}
export interface DesignSystem {
    colors: Record<string, Record<string, string> | string>;
    typography: Record<string, any>;
    spacing: Record<string, string>;
    components: string[];
    tokens: Record<string, any>;
}
export interface FrontendArchitecture {
    framework: 'react' | 'vue' | 'angular' | 'svelte' | 'nextjs';
    structure: ComponentStructure[];
    designSystem: DesignSystem;
    routing: {
        type: 'file-based' | 'config-based';
        routes: Array<{
            path: string;
            component: string;
        }>;
    };
    stateManagement: {
        solution: 'redux' | 'zustand' | 'context' | 'recoil' | 'mobx' | 'none';
        stores: string[];
    };
    styling: {
        solution: 'tailwind' | 'css-modules' | 'styled-components' | 'emotion' | 'sass';
        approach: string;
    };
    fileStructure: string;
    recommendations: string[];
}
export declare class FrontendArchitectAgent {
    private aiAdapter;
    private provider;
    constructor(config: {
        deepseek?: string;
        claude?: string;
        openai?: string;
    }, provider?: AIProvider);
    design(requirements: {
        description: string;
        features: string[];
        pages?: string[];
        framework?: string;
        styling?: string;
    }): Promise<FrontendArchitecture>;
    private designComponentStructure;
    private createDesignSystem;
    private planRouting;
    private chooseStateManagement;
    private planStyling;
    private generateFileStructure;
    private generateRecommendations;
    private pageToRoute;
    private callClaude;
    private parseComponents;
    private parseDesignSystem;
    private getDefaultDesignSystem;
}
//# sourceMappingURL=frontend-architect-agent.d.ts.map