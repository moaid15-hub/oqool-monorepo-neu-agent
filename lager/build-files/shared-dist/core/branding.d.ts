export declare const BRANDING: {
    logo: string;
    infoBox: string;
    commandsBox: string;
    warningBox: string;
};
export declare function displayWelcome(): void;
export declare function showSuccess(msg: string): void;
export declare function showError(msg: string): void;
export declare function showInfo(msg: string): void;
export declare function createSpinner(message: string): {
    stop: (finalMessage?: string) => void;
    fail: (errorMessage?: string) => void;
};
export declare function showProgress(percent: number, label: string): void;
//# sourceMappingURL=branding.d.ts.map