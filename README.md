# 🚀 Oqool AI - Professional Development Environment

<div align="center">

![Oqool AI](https://img.shields.io/badge/Oqool-AI%20Powered-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)

**The Ultimate AI-Powered Development Environment with CLI, Desktop IDE, and Cloud Editor**

[Features](#-features) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Packages](#-packages)
- [Installation](#-installation)
- [Development](#-development)
- [Scripts](#-scripts)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Oqool AI** is a professional, AI-powered development environment that provides three powerful interfaces:

1. **CLI Tool** - Command-line interface for terminal workflows
2. **Desktop IDE** - Full-featured Electron-based IDE (like VS Code/Cursor)
3. **Cloud Editor** - Web-based collaborative editor (coming soon)

All packages share a common core with advanced AI features, including:

- 🤖 8 AI Personalities for different development tasks
- 🎯 God Mode - AI project generation from natural language
- 🛡️ Version Guardian - Intelligent version control with time-travel
- 🎤 Voice Interface - Code with your voice
- 🌍 RTL/LTR Support - Full Arabic language support

---

## ✨ Features

### Core Features (Shared)

- ✅ **8 AI Personalities**: Architect, Coder, Reviewer, Tester, Debugger, Optimizer, Documenter, Explainer
- ✅ **God Mode**: Generate complete projects from natural language descriptions
- ✅ **Version Guardian**: Advanced version control with snapshots and time-travel
- ✅ **Collective Intelligence**: Learn from patterns across all your projects
- ✅ **Code DNA System**: Understand and track code evolution
- ✅ **Voice Interface**: Speech-to-code capabilities
- ✅ **Arabic Support**: Full RTL support and Arabic language interface

### CLI Features

- ⚡ Lightning-fast terminal-based workflow
- 🔧 Powerful command-line tools
- 🤖 AI-powered code generation and refactoring
- 📊 Project analysis and insights
- 🎨 Beautiful terminal UI with colors

### Desktop IDE Features

- 🖥️ Full-featured code editor (Monaco Editor)
- 💻 Integrated terminal (xterm.js)
- 📁 File explorer with advanced features
- 🎨 Multiple themes (Dark, Light, Arabic)
- 🔌 Extensible plugin system
- ⚡ Fast and responsive
- 🌐 Multi-platform (Windows, macOS, Linux)

### Cloud Editor Features (Coming Soon)

- 🌍 Browser-based development
- 👥 Real-time collaboration
- ☁️ Cloud storage integration
- 🔄 Seamless sync across devices

---

## 🏗️ Architecture

This is a **monorepo** managed with **npm workspaces** and **Turbo**:

```
oqool-monorepo/
├── packages/
│   ├── cli/              # Command-line interface
│   ├── desktop/          # Electron desktop IDE
│   ├── cloud-editor/     # Web-based editor (React + Vite)
│   └── shared/           # Shared utilities, AI, and core logic
├── docs/                 # Documentation
├── scripts/              # Build and utility scripts
├── .github/              # GitHub Actions workflows
├── package.json          # Root package.json with workspaces
├── turbo.json            # Turbo configuration
└── tsconfig.json         # Root TypeScript config
```

---

## 📦 Packages

### `@oqool/cli`

Command-line interface for Oqool AI.

**Key Features:**

- AI-powered code generation
- Project scaffolding
- Code analysis and refactoring
- Interactive prompts

**Usage:**

```bash
npm run dev:cli
oqool generate "Create a REST API with authentication"
oqool review ./src
oqool god-mode "Build a todo app with React and Express"
```

---

### `@oqool/desktop`

Full-featured desktop IDE built with Electron and React.

**Key Features:**

- Monaco code editor
- Integrated terminal
- File explorer
- AI assistant panel
- Extension system

**Tech Stack:**

- Electron
- React
- TypeScript
- Monaco Editor
- xterm.js

**Usage:**

```bash
npm run dev:desktop
npm run build:desktop
```

---

### `@oqool/cloud-editor`

Web-based collaborative code editor (Coming Soon).

**Key Features:**

- Browser-based development
- Real-time collaboration
- Cloud storage
- Responsive design

**Tech Stack:**

- React
- Vite
- CodeMirror/Monaco
- WebSocket

---

### `@oqool/shared`

Shared utilities, AI services, and core logic used across all packages.

**Includes:**

- AI Gateway (OpenAI, Anthropic, DeepSeek)
- God Mode engine
- Version Guardian
- Collective Intelligence system
- Code DNA analyzer
- Utilities and helpers

---

## 🚀 Installation

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Install Dependencies

```bash
# Clone the repository
git clone https://github.com/moaid15-hub/oqool-monorepo.git
cd oqool-monorepo

# Install all dependencies
npm install

# Or install for all workspaces
npm run install:all
```

---

## 💻 Development

### Start Development Servers

```bash
# Start all packages in development mode
npm run dev

# Start specific package
npm run dev:cli        # CLI only
npm run dev:desktop    # Desktop IDE only
npm run dev:cloud      # Cloud Editor only
```

### Build Packages

```bash
# Build all packages
npm run build

# Build specific package
npm run build:cli
npm run build:desktop
npm run build:cloud

# Build all workspaces
npm run build:all
```

### Testing

```bash
# Run tests for all packages
npm run test

# Run tests in watch mode
npm run test:watch
```

### Linting & Formatting

```bash
# Lint all packages
npm run lint

# Format all files
npm run format

# Check formatting
npm run format:check
```

### Type Checking

```bash
# Type-check all packages
npm run type-check
```

---

## 📜 Scripts

| Script                | Description                            |
| --------------------- | -------------------------------------- |
| `npm run dev`         | Start all packages in development mode |
| `npm run build`       | Build all packages                     |
| `npm run test`        | Run all tests                          |
| `npm run lint`        | Lint all packages                      |
| `npm run format`      | Format all code                        |
| `npm run clean`       | Clean all build artifacts              |
| `npm run dev:cli`     | Start CLI in dev mode                  |
| `npm run dev:desktop` | Start Desktop IDE in dev mode          |
| `npm run dev:cloud`   | Start Cloud Editor in dev mode         |

---

## 📚 Documentation

### 🚀 Quick Start

- [Quick Start Guide](./docs/guides/QUICK_START.md) - Get started in 5 minutes
- [Installation Guide](./docs/setup/INSTALL_GUIDE.md) - Complete installation
- [API Keys Setup](./docs/setup/API_KEYS_SETUP.md) - Configure API keys

### 📖 Guides

- [How to Activate Agents](./docs/guides/HOW_TO_ACTIVATE_AGENT.md) - Agent activation
- [Computer Control Commands](./docs/guides/COMPUTER_CONTROL_COMMANDS.md) - Full command reference
- [Commands List](./docs/guides/COMMANDS_LIST.txt) - Quick command list

### 📊 Reports & Status

- [Project Status Report](./docs/reports/PROJECT_STATUS_REPORT.md) - Complete project overview
- [Cleanup Summary](./docs/reports/CLEANUP_SUMMARY.md) - Recent cleanup work

### 📦 Package Documentation

- [CLI Package](./packages/cli/README.md)
- [Desktop IDE](./packages/desktop/README.md)
- [Cloud Editor](./packages/cloud-editor/README.md)
- [Shared Package](./packages/shared/README.md)

### 💡 Examples

See [examples/](./examples/) folder for working code examples.

**📂 Complete documentation structure:** [docs/README.md](./docs/README.md)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ by the Oqool Team
- Powered by AI (OpenAI, Anthropic, DeepSeek)
- Inspired by VS Code, Cursor, and other amazing tools

---

## 📞 Contact

- **GitHub**: [@moaid15-hub](https://github.com/moaid15-hub)
- **Issues**: [GitHub Issues](https://github.com/moaid15-hub/oqool-monorepo/issues)

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with 🤖 and ❤️ by Oqool Team

</div>
