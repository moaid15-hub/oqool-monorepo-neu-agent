export function formatCode(code, language) {
    // Simple code formatting utility
    return code.trim();
}
export function validateProjectStructure(files) {
    // Project structure validation
    return files.length > 0;
}
export function generateId() {
    return Math.random().toString(36).substr(2, 9);
}
export function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}
export class Logger {
    static info(message, ...args) {
        console.log(`[INFO] ${message}`, ...args);
    }
    static error(message, ...args) {
        console.error(`[ERROR] ${message}`, ...args);
    }
    static warn(message, ...args) {
        console.warn(`[WARN] ${message}`, ...args);
    }
}
//# sourceMappingURL=index.js.map