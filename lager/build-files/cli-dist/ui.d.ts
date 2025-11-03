import Table from 'cli-table3';
export declare class UI {
    private spinner;
    private colors;
    private gradients;
    showBanner(): void;
    showWelcome(): void;
    startSpinner(text: string): void;
    updateSpinner(text: string): void;
    succeedSpinner(text: string): void;
    failSpinner(text: string): void;
    stopSpinner(): void;
    success(message: string): void;
    error(message: string): void;
    warning(message: string): void;
    info(message: string): void;
    showAIResponse(response: string, provider?: string): void;
    private formatResponse;
    private getProviderLabel;
    showProjectInfo(totalFiles: number, totalSize: number): void;
    showFilesList(files: Array<{
        path: string;
        size: number;
    }>): void;
    private formatBytes;
    showProjectStructure(structure: string): void;
    showConfirmation(message: string): void;
    divider(): void;
    newLine(): void;
    createBox(content: string, title?: string, type?: 'info' | 'success' | 'error' | 'warning'): string;
    successBox(content: string): void;
    errorBox(content: string): void;
    createTable(headers: string[]): Table.Table;
    showFeatures(): void;
    heading(text: string): void;
    subheading(text: string): void;
    separator(): void;
    boxMessage(message: string, type?: 'info' | 'success' | 'error' | 'warning'): void;
}
export declare const ui: UI;
//# sourceMappingURL=ui.d.ts.map