import { type AIProvider } from '../ai-gateway/index.js';
import type { GeneratedCode, CodeFile } from '../core/god-mode.js';
export interface SecurityVulnerability {
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    category: 'injection' | 'xss' | 'auth' | 'crypto' | 'sensitive-data' | 'access-control' | 'csrf' | 'dos' | 'dependency' | 'config';
    file: string;
    line?: number;
    cwe?: string;
    description: string;
    exploit: string;
    remediation: string;
    references?: string[];
    fixed?: boolean;
}
export interface SecurityResults {
    vulnerabilitiesFound: number;
    vulnerabilitiesFixed: number;
    securityScore: number;
    vulnerabilities: SecurityVulnerability[];
    securedFiles: CodeFile[];
    summary: string;
    complianceReport: string;
}
export declare class SecurityAgent {
    private aiAdapter;
    private provider;
    constructor(config: {
        deepseek?: string;
        claude?: string;
        openai?: string;
    }, provider?: AIProvider);
    audit(code: GeneratedCode): Promise<SecurityResults>;
    private scanFile;
    private scanProject;
    private checkDependencies;
    private fixVulnerability;
    private callClaude;
    private parseVulnerabilities;
    private extractCode;
    private calculateSecurityScore;
    private generateSummary;
    private generateComplianceReport;
}
//# sourceMappingURL=security-agent.d.ts.map