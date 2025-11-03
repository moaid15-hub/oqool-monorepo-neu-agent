// architect-agent.ts
// ============================================
// 🏗️ Architect Agent - المصمم المعماري
// ============================================
import { UnifiedAIAdapter } from '../ai-gateway/index.js';
export class ArchitectAgent {
    aiAdapter;
    provider;
    constructor(config, provider = 'auto') {
        // 🔄 Smart default: use Claude if available, otherwise DeepSeek
        const hasValidClaude = config.claude?.startsWith('sk-ant-');
        this.aiAdapter = new UnifiedAIAdapter({
            deepseek: config.deepseek,
            claude: config.claude,
            openai: config.openai,
            defaultProvider: hasValidClaude ? 'claude' : 'deepseek', // fallback to DeepSeek
        });
        this.provider = provider;
    }
    async design(task) {
        const prompt = `
Design a complete architecture for: ${task}

Include:
1. Frontend framework and structure
2. Backend API design
3. Database schema
4. Authentication system
5. Deployment strategy
6. File structure
7. Key components and their responsibilities

Output as structured JSON with these keys:
- components: array of {name, type, description, dependencies}
- database: {type, tables}
- api: {endpoints, authentication}
- frontend: {framework, components}
- tags: array of relevant tags

Be specific and detailed.
    `;
        const response = await this.callClaude(prompt);
        return {
            components: this.extractComponents(response),
            database: this.extractDatabase(response),
            api: this.extractAPI(response),
            frontend: this.extractFrontend(response),
            tags: this.extractTags(task)
        };
    }
    async callClaude(prompt) {
        const result = await this.aiAdapter.processWithPersonality('architect', prompt, undefined, this.provider);
        return result.response;
    }
    extractComponents(response) {
        try {
            const json = this.parseJSON(response);
            if (json.components && Array.isArray(json.components)) {
                return json.components;
            }
        }
        catch (e) {
            // fallback
        }
        // Extract from text
        const components = [];
        const lines = response.split('\n');
        for (const line of lines) {
            if (line.match(/component|module|service/i)) {
                components.push({
                    name: line.trim(),
                    type: 'component',
                    description: 'Auto-extracted component',
                    dependencies: []
                });
            }
        }
        return components.length > 0 ? components : [
            {
                name: 'Main',
                type: 'core',
                description: 'Main application component',
                dependencies: []
            }
        ];
    }
    extractDatabase(response) {
        try {
            const json = this.parseJSON(response);
            if (json.database) {
                return json.database;
            }
        }
        catch (e) {
            // ignore
        }
        // Check if database mentioned
        if (response.match(/database|sql|nosql|mongodb|postgres/i)) {
            return {
                type: 'PostgreSQL',
                tables: []
            };
        }
        return undefined;
    }
    extractAPI(response) {
        try {
            const json = this.parseJSON(response);
            if (json.api) {
                return json.api;
            }
        }
        catch (e) {
            // ignore
        }
        // Check if API mentioned
        if (response.match(/api|endpoint|rest|graphql/i)) {
            return {
                endpoints: [],
                authentication: 'JWT'
            };
        }
        return undefined;
    }
    extractFrontend(response) {
        try {
            const json = this.parseJSON(response);
            if (json.frontend) {
                return json.frontend;
            }
        }
        catch (e) {
            // ignore
        }
        // Detect framework
        const frameworks = ['React', 'Vue', 'Angular', 'Svelte', 'Next.js'];
        for (const framework of frameworks) {
            if (response.includes(framework)) {
                return {
                    framework,
                    components: []
                };
            }
        }
        return undefined;
    }
    extractTags(task) {
        const tags = [];
        const keywords = [
            'saas', 'platform', 'api', 'web', 'mobile',
            'dashboard', 'auth', 'payment', 'analytics'
        ];
        for (const keyword of keywords) {
            if (task.toLowerCase().includes(keyword)) {
                tags.push(keyword);
            }
        }
        return tags.length > 0 ? tags : ['project'];
    }
    parseJSON(text) {
        // Try to find JSON in the text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return {};
    }
}
//# sourceMappingURL=architect-agent.js.map