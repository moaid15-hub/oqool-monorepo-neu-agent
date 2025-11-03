// plugin-system.ts
// ============================================
// 🔌 Plugin System
// ============================================
import fs from 'fs-extra';
import { join } from 'path';
import chalk from 'chalk';
export class PluginManager {
    constructor(workingDirectory) {
        this.plugins = new Map();
        this.pluginDir = join(workingDirectory, '.oqool', 'plugins');
    }
    // ============================================
    // 📦 تحميل Plugin
    // ============================================
    async load(pluginPath) {
        try {
            console.log(chalk.cyan(`📦 تحميل plugin من ${pluginPath}...`));
            // استيراد الـ plugin
            const pluginModule = await import(pluginPath);
            const plugin = pluginModule.default || pluginModule;
            // التحقق من البنية
            if (!plugin.name || !plugin.version) {
                throw new Error('Plugin يجب أن يحتوي على name و version');
            }
            // تشغيل onLoad
            if (plugin.onLoad) {
                await plugin.onLoad();
            }
            // حفظ في القائمة
            this.plugins.set(plugin.name, plugin);
            console.log(chalk.green(`✅ تم تحميل plugin: ${plugin.name}@${plugin.version}`));
        }
        catch (error) {
            console.error(chalk.red(`❌ فشل تحميل plugin: ${error.message}`));
            throw error;
        }
    }
    // ============================================
    // ❌ إلغاء تحميل Plugin
    // ============================================
    async unload(pluginName) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) {
            throw new Error(`Plugin ${pluginName} غير محمل`);
        }
        // تشغيل onUnload
        if (plugin.onUnload) {
            await plugin.onUnload();
        }
        this.plugins.delete(pluginName);
        console.log(chalk.yellow(`🗑️  تم إلغاء تحميل plugin: ${pluginName}`));
    }
    // ============================================
    // 🔧 الحصول على Tools من الـ Plugins
    // ============================================
    getAllTools() {
        const tools = [];
        for (const plugin of this.plugins.values()) {
            if (plugin.tools) {
                tools.push(...plugin.tools);
            }
        }
        return tools;
    }
    // ============================================
    // 📜 الحصول على Commands من الـ Plugins
    // ============================================
    getAllCommands() {
        const commands = [];
        for (const plugin of this.plugins.values()) {
            if (plugin.commands) {
                commands.push(...plugin.commands);
            }
        }
        return commands;
    }
    // ============================================
    // 📋 قائمة الـ Plugins المحملة
    // ============================================
    list() {
        return Array.from(this.plugins.values());
    }
    // ============================================
    // 🎯 تشغيل Hook لكل الـ Plugins
    // ============================================
    async triggerHook(hookName, ...args) {
        for (const plugin of this.plugins.values()) {
            const hook = plugin[hookName];
            if (typeof hook === 'function') {
                try {
                    await hook.apply(plugin, args);
                }
                catch (error) {
                    console.error(chalk.red(`❌ خطأ في plugin ${plugin.name} - hook ${hookName}:`), error);
                }
            }
        }
    }
    // ============================================
    // 💾 حفظ قائمة الـ Plugins المفعلة
    // ============================================
    async saveConfig() {
        await fs.ensureDir(this.pluginDir);
        const config = {
            plugins: Array.from(this.plugins.values()).map(p => ({
                name: p.name,
                version: p.version
            }))
        };
        await fs.writeJSON(join(this.pluginDir, 'config.json'), config, { spaces: 2 });
    }
    // ============================================
    // 📖 تحميل الـ Plugins من Config
    // ============================================
    async loadFromConfig() {
        const configPath = join(this.pluginDir, 'config.json');
        if (!await fs.pathExists(configPath)) {
            return;
        }
        const config = await fs.readJSON(configPath);
        for (const pluginInfo of config.plugins || []) {
            try {
                const pluginPath = join(this.pluginDir, pluginInfo.name, 'index.js');
                await this.load(pluginPath);
            }
            catch (error) {
                console.warn(chalk.yellow(`⚠️  تعذر تحميل plugin: ${pluginInfo.name}`));
            }
        }
    }
}
// ============================================
// 📦 مثال Plugin
// ============================================
export const examplePlugin = {
    name: 'example-plugin',
    version: '1.0.0',
    description: 'مثال على plugin',
    author: 'oqool Team',
    onLoad: async () => {
        console.log('Example plugin loaded!');
    },
    tools: [
        {
            name: 'example_tool',
            description: 'أداة مثال',
            parameters: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            },
            execute: async (params) => {
                return { result: `Echo: ${params.message}` };
            }
        }
    ],
    commands: [
        {
            name: 'example:hello',
            description: 'يطبع hello',
            action: async () => {
                console.log('Hello from example plugin!');
            }
        }
    ]
};
//# sourceMappingURL=plugin-system.js.map