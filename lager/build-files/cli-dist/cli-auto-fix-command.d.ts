import { Command } from 'commander';
/**
 * إضافة أمر auto-fix للـ CLI
 */
export declare function addAutoFixCommand(program: Command): Command;
/**
 * معالج أمر auto-fix
 */
declare function handleAutoFix(file: string, options: any): Promise<void>;
/**
 * عرض المراحل المتاحة
 */
declare function displayStages(autoFix: any): void;
/**
 * Export
 */
export { handleAutoFix, displayStages };
//# sourceMappingURL=cli-auto-fix-command.d.ts.map