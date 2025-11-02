// coder-agent.ts
// ============================================
// 💻 Coder Agent - المبرمج
// ============================================

import { UnifiedAIAdapter, type AIProvider } from '../ai-gateway/index.js';
import type { Architecture, GeneratedCode, CodeFile, Component } from '../core/god-mode.js';
import path from 'path';

export class CoderAgent {
  private aiAdapter: UnifiedAIAdapter;
  private provider: AIProvider;

  constructor(config: { deepseek?: string; claude?: string; openai?: string }, provider: AIProvider = 'auto') {
    this.aiAdapter = new UnifiedAIAdapter({
      deepseek: config.deepseek,
      claude: config.claude,
      openai: config.openai,
      defaultProvider: 'deepseek', // coder benefits from DeepSeek's code generation
    });
    this.provider = provider;
  }

  async implement(architecture: Architecture, task: string): Promise<GeneratedCode> {
    const files: CodeFile[] = [];

    // 1️⃣ توليد كل component
    if (architecture.components && architecture.components.length > 0) {
      for (const component of architecture.components) {
        const code = await this.generateComponent(component, architecture);
        if (code) files.push(code);
      }
    }

    // 2️⃣ توليد API routes
    if (architecture.api && architecture.api.endpoints) {
      for (const endpoint of architecture.api.endpoints) {
        const code = await this.generateRoute(endpoint, architecture);
        if (code) files.push(code);
      }
    }

    // 3️⃣ توليد Database models
    if (architecture.database && architecture.database.tables) {
      for (const table of architecture.database.tables) {
        const code = await this.generateModel(table, architecture);
        if (code) files.push(code);
      }
    }

    // 4️⃣ توليد Frontend components
    if (architecture.frontend && architecture.frontend.components) {
      for (const comp of architecture.frontend.components) {
        const code = await this.generateFrontendComponent(comp, architecture);
        if (code) files.push(code);
      }
    }

    // 5️⃣ توليد Config files
    const configFiles = await this.generateConfigFiles(architecture, task);
    files.push(...configFiles);

    const totalLines = files.reduce((sum, f) => sum + f.lines, 0);

    return {
      files,
      totalLines
    };
  }

  // ============================================
  // Generate Component
  // ============================================
  private async generateComponent(component: Component, architecture: Architecture): Promise<CodeFile | null> {
    const prompt = `
Generate code for this component:

Component: ${component.name}
Type: ${component.type}
Description: ${component.description}
Dependencies: ${component.dependencies.join(', ')}

Context:
- Framework: ${architecture.frontend?.framework || 'Node.js'}
- Database: ${architecture.database?.type || 'None'}

Output a single file with:
\`\`\`filename:src/components/${component.name}.js
// code here
\`\`\`

Make it clean, modular, and production-ready.
    `;

    const response = await this.callClaude(prompt);
    const parsed = this.parseCode(response);

    return parsed.files[0] || null;
  }

  // ============================================
  // Generate Route
  // ============================================
  private async generateRoute(endpoint: any, architecture: Architecture): Promise<CodeFile | null> {
    const prompt = `
Generate an API route/endpoint:

Endpoint: ${JSON.stringify(endpoint)}

Context:
- Authentication: ${architecture.api?.authentication || 'None'}
- Database: ${architecture.database?.type || 'None'}

Output format:
\`\`\`filename:src/routes/${endpoint.path || 'route'}.js
// code here
\`\`\`

Include:
- Route handler
- Validation
- Error handling
- Database integration if needed
    `;

    const response = await this.callClaude(prompt);
    const parsed = this.parseCode(response);

    return parsed.files[0] || null;
  }

  // ============================================
  // Generate Database Model
  // ============================================
  private async generateModel(table: any, architecture: Architecture): Promise<CodeFile | null> {
    const prompt = `
Generate a database model/schema:

Table: ${JSON.stringify(table)}

Database Type: ${architecture.database?.type || 'PostgreSQL'}

Output format:
\`\`\`filename:src/models/${table.name || 'Model'}.js
// code here
\`\`\`

Include:
- Schema definition
- Validations
- Relationships if any
- CRUD methods
    `;

    const response = await this.callClaude(prompt);
    const parsed = this.parseCode(response);

    return parsed.files[0] || null;
  }

  // ============================================
  // Generate Frontend Component
  // ============================================
  private async generateFrontendComponent(component: string, architecture: Architecture): Promise<CodeFile | null> {
    const framework = architecture.frontend?.framework || 'React';

    const prompt = `
Generate a ${framework} component:

Component: ${component}

Output format:
\`\`\`filename:src/components/${component}.jsx
// code here
\`\`\`

Make it:
- Functional component
- With proper hooks if React
- Styled and responsive
- Production-ready
    `;

    const response = await this.callClaude(prompt);
    const parsed = this.parseCode(response);

    return parsed.files[0] || null;
  }

  // ============================================
  // Generate Config Files
  // ============================================
  private async generateConfigFiles(architecture: Architecture, task: string): Promise<CodeFile[]> {
    const files: CodeFile[] = [];

    // package.json
    const packageJson = {
      name: task.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      description: task,
      main: 'index.js',
      scripts: {
        start: 'node index.js',
        dev: 'nodemon index.js',
        test: 'jest'
      },
      dependencies: this.detectDependencies(architecture),
      devDependencies: {
        nodemon: '^2.0.0',
        jest: '^29.0.0'
      }
    };

    files.push({
      path: 'package.json',
      content: JSON.stringify(packageJson, null, 2),
      language: 'json',
      lines: Object.keys(packageJson).length
    });

    // .env.example
    const envContent = `# Environment Variables
DATABASE_URL=postgresql://localhost:5432/mydb
PORT=3000
NODE_ENV=development
${architecture.api?.authentication === 'JWT' ? 'JWT_SECRET=your-secret-key' : ''}
`;

    files.push({
      path: '.env.example',
      content: envContent.trim(),
      language: 'text',
      lines: envContent.split('\n').length
    });

    // README.md
    const readme = `# ${task}

## Description
Auto-generated project by Oqool God Mode.

## Installation
\`\`\`bash
npm install
\`\`\`

## Usage
\`\`\`bash
npm start
\`\`\`

## Architecture
- Components: ${architecture.components.length}
- Database: ${architecture.database?.type || 'None'}
- API: ${architecture.api?.authentication || 'None'}
- Frontend: ${architecture.frontend?.framework || 'None'}
`;

    files.push({
      path: 'README.md',
      content: readme.trim(),
      language: 'markdown',
      lines: readme.split('\n').length
    });

    return files;
  }

  private detectDependencies(architecture: Architecture): Record<string, string> {
    const deps: Record<string, string> = {
      'express': '^4.18.0'
    };

    // Database
    if (architecture.database?.type) {
      const dbType = architecture.database.type.toLowerCase();
      if (dbType.includes('postgres')) {
        deps['pg'] = '^8.11.0';
      } else if (dbType.includes('mongo')) {
        deps['mongoose'] = '^7.0.0';
      } else if (dbType.includes('mysql')) {
        deps['mysql2'] = '^3.0.0';
      }
    }

    // Frontend
    if (architecture.frontend?.framework) {
      const framework = architecture.frontend.framework.toLowerCase();
      if (framework.includes('react')) {
        deps['react'] = '^18.2.0';
        deps['react-dom'] = '^18.2.0';
      } else if (framework.includes('vue')) {
        deps['vue'] = '^3.3.0';
      }
    }

    // Auth
    if (architecture.api?.authentication === 'JWT') {
      deps['jsonwebtoken'] = '^9.0.0';
      deps['bcrypt'] = '^5.1.0';
    }

    return deps;
  }

  private async callClaude(prompt: string): Promise<string> {
    const result = await this.aiAdapter.processWithPersonality(
      'coder',
      prompt,
      undefined,
      this.provider
    );

    return result.response;
  }

  private parseCode(text: string): GeneratedCode {
    const files: CodeFile[] = [];

    // Pattern 1: ```filename:path/to/file.ext
    const pattern1 = /```(?:filename:)?([^\n]+)\n([\s\S]*?)```/g;

    let match;
    while ((match = pattern1.exec(text)) !== null) {
      const filePath = match[1].trim();
      const content = match[2].trim();

      if (filePath && content) {
        const lines = content.split('\n').length;

        files.push({
          path: filePath,
          content,
          language: this.detectLanguage(filePath),
          lines
        });
      }
    }

    const totalLines = files.reduce((sum, f) => sum + f.lines, 0);

    return {
      files,
      totalLines
    };
  }

  private detectLanguage(filePath: string): string {
    const ext = path.extname(filePath);
    const map: Record<string, string> = {
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.py': 'python',
      '.java': 'java',
      '.go': 'go',
      '.rs': 'rust',
      '.rb': 'ruby',
      '.php': 'php',
      '.html': 'html',
      '.css': 'css',
      '.json': 'json',
      '.md': 'markdown'
    };
    return map[ext] || 'text';
  }
}
