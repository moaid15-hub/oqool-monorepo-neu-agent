import { type AIProvider } from '../ai-gateway/index.js';
export interface UIComponent {
    name: string;
    type: string;
    description: string;
    variants?: string[];
    states?: string[];
    accessibility: string[];
    code: string;
}
export interface PageDesign {
    pageName: string;
    sections: {
        name: string;
        type: 'hero' | 'features' | 'cta' | 'testimonials' | 'pricing' | 'footer' | 'custom';
        layout: string;
        components: string[];
        description: string;
    }[];
    mockup: string;
    wireframe: string;
}
export interface DesignResult {
    components: UIComponent[];
    pages: PageDesign[];
    designPrinciples: string[];
    colorScheme: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
    typography: {
        headingFont: string;
        bodyFont: string;
        scale: string[];
    };
    responsive: {
        breakpoints: Record<string, string>;
        strategy: string;
    };
    animations: {
        transitions: string[];
        microInteractions: string[];
    };
}
export declare class UIUXDesignerAgent {
    private aiAdapter;
    private provider;
    constructor(config: {
        deepseek?: string;
        claude?: string;
        openai?: string;
    }, provider?: AIProvider);
    design(requirements: {
        projectName: string;
        description: string;
        targetAudience: string;
        pages: string[];
        style?: 'modern' | 'minimal' | 'playful' | 'professional' | 'dark' | 'elegant';
        brand?: {
            colors?: string[];
            personality?: string;
        };
    }): Promise<DesignResult>;
    private designColorScheme;
    private designTypography;
    private designUIComponents;
    private designPages;
    private designSinglePage;
    private designResponsive;
    private designAnimations;
    private defineDesignPrinciples;
    private callClaude;
    private parseJSON;
    private getDefaultColors;
}
//# sourceMappingURL=ui-ux-designer-agent.d.ts.map