// security-agent.ts
// ============================================
// 🔒 Security Agent - الحارس
// ============================================
import { UnifiedAIAdapter } from '../ai-gateway/index.js';
export class SecurityAgent {
    aiAdapter;
    provider;
    constructor(config, provider = 'auto') {
        const hasValidClaude = config.claude?.startsWith('sk-ant-');
        this.aiAdapter = new UnifiedAIAdapter({
            deepseek: config.deepseek,
            claude: config.claude,
            openai: config.openai,
            defaultProvider: hasValidClaude ? 'claude' : 'deepseek',
        });
        this.provider = provider;
    }
    async audit(code) {
        const vulnerabilities = [];
        const securedFiles = [];
        // 1. Scan each file for vulnerabilities
        for (const file of code.files) {
            const fileVulns = await this.scanFile(file);
            vulnerabilities.push(...fileVulns);
        }
        // 2. Project-level security checks
        const projectVulns = await this.scanProject(code);
        vulnerabilities.push(...projectVulns);
        // 3. Dependency security check
        const depsVulns = await this.checkDependencies(code);
        vulnerabilities.push(...depsVulns);
        // 4. Fix critical and high vulnerabilities
        const criticalVulns = vulnerabilities.filter(v => v.severity === 'critical' || v.severity === 'high');
        for (const vuln of criticalVulns) {
            const secured = await this.fixVulnerability(vuln, code);
            if (secured) {
                vuln.fixed = true;
                const fileIndex = securedFiles.findIndex(f => f.path === secured.path);
                if (fileIndex >= 0) {
                    securedFiles[fileIndex] = secured;
                }
                else {
                    securedFiles.push(secured);
                }
            }
        }
        const fixed = vulnerabilities.filter(v => v.fixed).length;
        const score = this.calculateSecurityScore(vulnerabilities, fixed);
        return {
            vulnerabilitiesFound: vulnerabilities.length,
            vulnerabilitiesFixed: fixed,
            securityScore: score,
            vulnerabilities,
            securedFiles,
            summary: this.generateSummary(vulnerabilities, fixed, score),
            complianceReport: this.generateComplianceReport(vulnerabilities)
        };
    }
    // ============================================
    // Scan single file
    // ============================================
    async scanFile(file) {
        const prompt = `
Perform security audit on this code:

File: ${file.path}
Language: ${file.language}

Code:
${file.content}

Check for vulnerabilities:

1. 💉 Injection Attacks:
   - SQL Injection
   - NoSQL Injection
   - Command Injection
   - LDAP Injection
   - XML Injection

2. 🎭 Cross-Site Scripting (XSS):
   - Reflected XSS
   - Stored XSS
   - DOM-based XSS

3. 🔐 Authentication & Authorization:
   - Weak passwords
   - Missing authentication
   - Broken access control
   - Session management issues
   - JWT vulnerabilities

4. 🔑 Cryptography:
   - Weak algorithms (MD5, SHA1)
   - Hardcoded keys/secrets
   - Insecure random numbers
   - Missing encryption

5. 📄 Sensitive Data Exposure:
   - Passwords in code
   - API keys exposed
   - PII not protected
   - Logging sensitive data

6. 🚪 Access Control:
   - Missing authorization checks
   - IDOR vulnerabilities
   - Path traversal

7. 🛡️ CSRF & Request Forgery

8. 💥 DoS Vulnerabilities:
   - Resource exhaustion
   - Infinite loops
   - Regex DoS (ReDoS)

9. ⚙️ Security Misconfiguration:
   - Debug mode in production
   - Default credentials
   - Unnecessary services
   - Missing security headers

Output format (JSON):
\`\`\`json
{
  "vulnerabilities": [
    {
      "severity": "critical",
      "category": "injection",
      "file": "${file.path}",
      "line": 42,
      "cwe": "CWE-89",
      "description": "SQL Injection vulnerability in user query",
      "exploit": "Attacker can inject malicious SQL: ' OR '1'='1",
      "remediation": "Use parameterized queries or prepared statements",
      "references": ["https://owasp.org/www-community/attacks/SQL_Injection"]
    }
  ]
}
\`\`\`

Use OWASP Top 10 and CWE standards.
    `;
        try {
            const response = await this.callClaude(prompt);
            return this.parseVulnerabilities(response, file.path);
        }
        catch (error) {
            console.error(`Failed to scan ${file.path}`);
            return [];
        }
    }
    // ============================================
    // Scan project-level security
    // ============================================
    async scanProject(code) {
        const prompt = `
Perform project-level security audit:

Files:
${code.files.map(f => `- ${f.path}`).join('\n')}

Check for:
1. 🏗️ Architecture security
2. 🔒 HTTPS/TLS configuration
3. 🌐 CORS configuration
4. 🔑 Secrets management
5. 📝 Logging security
6. 🔄 Rate limiting
7. 🛡️ Security headers
8. 🔐 Environment configuration

Output format (JSON):
\`\`\`json
{
  "vulnerabilities": [
    {
      "severity": "high",
      "category": "config",
      "file": "server.ts",
      "description": "Missing security headers (HSTS, CSP, X-Frame-Options)",
      "exploit": "Application vulnerable to clickjacking and MITM attacks",
      "remediation": "Add helmet.js middleware with proper security headers"
    }
  ]
}
\`\`\`
    `;
        try {
            const response = await this.callClaude(prompt);
            return this.parseVulnerabilities(response);
        }
        catch (error) {
            console.error('Failed to scan project');
            return [];
        }
    }
    // ============================================
    // Check dependencies
    // ============================================
    async checkDependencies(code) {
        const packageFile = code.files.find(f => f.path.includes('package.json') ||
            f.path.includes('requirements.txt') ||
            f.path.includes('Cargo.toml'));
        if (!packageFile)
            return [];
        const prompt = `
Check dependencies for known vulnerabilities:

File: ${packageFile.path}
Content:
${packageFile.content}

Check:
1. 🔍 Known CVEs in dependencies
2. 📅 Outdated packages
3. ⚠️ Deprecated packages
4. 🔓 Packages with security advisories
5. 📦 Unnecessary dependencies

Output format (JSON):
\`\`\`json
{
  "vulnerabilities": [
    {
      "severity": "high",
      "category": "dependency",
      "file": "${packageFile.path}",
      "description": "lodash@4.17.15 has prototype pollution vulnerability",
      "exploit": "CVE-2020-8203: Attacker can modify Object.prototype",
      "remediation": "Update lodash to version 4.17.21 or higher"
    }
  ]
}
\`\`\`
    `;
        try {
            const response = await this.callClaude(prompt);
            return this.parseVulnerabilities(response, packageFile.path);
        }
        catch (error) {
            console.error('Failed to check dependencies');
            return [];
        }
    }
    // ============================================
    // Fix vulnerability
    // ============================================
    async fixVulnerability(vuln, code) {
        const file = code.files.find(f => f.path === vuln.file);
        if (!file)
            return null;
        const prompt = `
Fix this security vulnerability:

File: ${file.path}
Vulnerability: ${vuln.description}
Category: ${vuln.category}
Severity: ${vuln.severity}
${vuln.cwe ? `CWE: ${vuln.cwe}` : ''}

How it can be exploited:
${vuln.exploit}

Recommended fix:
${vuln.remediation}

Original Code:
${file.content}

Provide SECURE code with:
1. Vulnerability fixed
2. Security best practices applied
3. Comments explaining the security fix
4. No functionality broken

Output format:
\`\`\`${file.language}
// Secured code here
\`\`\`
    `;
        try {
            const response = await this.callClaude(prompt);
            const securedContent = this.extractCode(response);
            if (securedContent) {
                return {
                    ...file,
                    content: securedContent
                };
            }
        }
        catch (error) {
            console.error(`Failed to fix vulnerability in ${vuln.file}`);
        }
        return null;
    }
    // ============================================
    // Call Claude API via UnifiedAIAdapter
    // ============================================
    async callClaude(prompt) {
        const result = await this.aiAdapter.processWithPersonality('security', prompt, undefined, this.provider);
        return result.response;
    }
    // ============================================
    // Parse vulnerabilities
    // ============================================
    parseVulnerabilities(response, defaultFile) {
        try {
            const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
            if (!jsonMatch)
                return [];
            const data = JSON.parse(jsonMatch[1]);
            return (data.vulnerabilities || []).map((v) => ({
                severity: v.severity || 'medium',
                category: v.category || 'config',
                file: v.file || defaultFile || 'unknown',
                line: v.line,
                cwe: v.cwe,
                description: v.description || '',
                exploit: v.exploit || '',
                remediation: v.remediation || '',
                references: v.references || [],
                fixed: false
            }));
        }
        catch (error) {
            console.error('Failed to parse vulnerabilities');
            return [];
        }
    }
    // ============================================
    // Extract code
    // ============================================
    extractCode(response) {
        const match = response.match(/```(?:\w+)?\n([\s\S]*?)```/);
        return match ? match[1].trim() : null;
    }
    // ============================================
    // Calculate security score
    // ============================================
    calculateSecurityScore(vulnerabilities, fixed) {
        if (vulnerabilities.length === 0)
            return 100;
        let score = 100;
        // Deduct points based on severity
        const severityPoints = {
            critical: 25,
            high: 15,
            medium: 8,
            low: 3,
            info: 1
        };
        for (const vuln of vulnerabilities) {
            if (!vuln.fixed) {
                score -= severityPoints[vuln.severity] || 5;
            }
        }
        // Bonus for fixes
        const fixBonus = (fixed / vulnerabilities.length) * 20;
        score += fixBonus;
        return Math.max(0, Math.min(100, Math.round(score)));
    }
    // ============================================
    // Generate summary
    // ============================================
    generateSummary(vulnerabilities, fixed, score) {
        const bySeverity = {
            critical: vulnerabilities.filter(v => v.severity === 'critical').length,
            high: vulnerabilities.filter(v => v.severity === 'high').length,
            medium: vulnerabilities.filter(v => v.severity === 'medium').length,
            low: vulnerabilities.filter(v => v.severity === 'low').length,
            info: vulnerabilities.filter(v => v.severity === 'info').length
        };
        const byCategory = vulnerabilities.reduce((acc, v) => {
            acc[v.category] = (acc[v.category] || 0) + 1;
            return acc;
        }, {});
        const scoreEmoji = score >= 90 ? '✅' : score >= 70 ? '⚠️' : '🔴';
        return `
# 🔒 Security Audit Summary

## Security Score: ${scoreEmoji} ${score}/100

## Vulnerabilities Found: ${vulnerabilities.length}

### By Severity:
- 🔴 Critical: ${bySeverity.critical}
- 🟠 High: ${bySeverity.high}
- 🟡 Medium: ${bySeverity.medium}
- 🟢 Low: ${bySeverity.low}
- ℹ️ Info: ${bySeverity.info}

### By Category:
${Object.entries(byCategory)
            .sort(([, a], [, b]) => b - a)
            .map(([cat, count]) => `- ${cat}: ${count}`)
            .join('\n')}

## Fixed: ${fixed} vulnerabilities

## Critical Issues:
${vulnerabilities
            .filter(v => v.severity === 'critical' || v.severity === 'high')
            .slice(0, 5)
            .map((v, i) => `${i + 1}. [${v.severity.toUpperCase()}] ${v.description}\n   ${v.cwe ? `${v.cwe}: ` : ''}${v.exploit}\n   🔧 ${v.remediation}`).join('\n\n')}

${fixed > 0 ? '\n✅ Critical vulnerabilities have been fixed!' : ''}
${vulnerabilities.length - fixed > 0 ? '\n⚠️ Some vulnerabilities require manual review.' : ''}
${score < 70 ? '\n🔴 Security score is below acceptable threshold!' : ''}
    `.trim();
    }
    // ============================================
    // Generate compliance report
    // ============================================
    generateComplianceReport(vulnerabilities) {
        const owaspTop10 = {
            'A01:2021-Broken Access Control': ['access-control', 'auth'].some(c => vulnerabilities.some(v => v.category === c)),
            'A02:2021-Cryptographic Failures': vulnerabilities.some(v => v.category === 'crypto' || v.category === 'sensitive-data'),
            'A03:2021-Injection': vulnerabilities.some(v => v.category === 'injection'),
            'A04:2021-Insecure Design': vulnerabilities.some(v => v.category === 'config'),
            'A05:2021-Security Misconfiguration': vulnerabilities.some(v => v.category === 'config'),
            'A06:2021-Vulnerable Components': vulnerabilities.some(v => v.category === 'dependency'),
            'A07:2021-Authentication Failures': vulnerabilities.some(v => v.category === 'auth'),
            'A08:2021-Software Integrity Failures': false,
            'A09:2021-Logging Failures': false,
            'A10:2021-SSRF': false
        };
        return `
# 📋 OWASP Top 10 Compliance

${Object.entries(owaspTop10)
            .map(([risk, found]) => `${found ? '❌' : '✅'} ${risk}`)
            .join('\n')}

## Recommendations:
${Object.entries(owaspTop10)
            .filter(([, found]) => found)
            .map(([risk]) => `- Review and fix: ${risk}`)
            .join('\n')}
    `.trim();
    }
}
//# sourceMappingURL=security-agent.js.map