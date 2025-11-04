import { OqoolAPIClient } from './api-client.js';
export interface MobileApp {
    id: string;
    name: string;
    platform: 'react-native' | 'flutter' | 'ionic' | 'capacitor' | 'native';
    type: 'ios' | 'android' | 'cross-platform';
    framework: string;
    template: string;
    packageName: string;
    bundleId?: string;
    version: string;
    description: string;
    features: MobileFeature[];
    screens: MobileScreen[];
    navigation: NavigationType;
    stateManagement: StateManagementType;
    styling: StylingType;
    createdAt: string;
}
export interface MobileFeature {
    id: string;
    name: string;
    type: 'authentication' | 'navigation' | 'camera' | 'location' | 'push-notifications' | 'offline' | 'biometric' | 'payment' | 'social' | 'analytics';
    enabled: boolean;
    configuration: Record<string, any>;
}
export interface MobileScreen {
    id: string;
    name: string;
    component: string;
    route: string;
    title: string;
    features: string[];
    layout: 'stack' | 'tab' | 'drawer' | 'modal';
    protected: boolean;
}
export interface NavigationType {
    type: 'stack' | 'tabs' | 'drawer' | 'bottom-tabs';
    screens: string[];
    options: Record<string, any>;
}
export interface StateManagementType {
    type: 'redux' | 'mobx' | 'context' | 'zustand' | 'valtio' | 'jotai';
    configuration: Record<string, any>;
}
export interface StylingType {
    type: 'styled-components' | 'emotion' | 'native-base' | 'ui-kitten' | 'react-native-elements' | 'tailwind' | 'custom';
    configuration: Record<string, any>;
}
export interface MobileTemplate {
    id: string;
    name: string;
    description: string;
    platform: string;
    category: 'ecommerce' | 'social' | 'business' | 'education' | 'health' | 'entertainment' | 'productivity' | 'utility';
    features: string[];
    complexity: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: string;
    preview?: string;
}
export interface BuildConfig {
    platform: 'ios' | 'android' | 'both';
    buildType: 'debug' | 'release' | 'development';
    environment: 'development' | 'staging' | 'production';
    signing?: {
        keystorePath?: string;
        keystorePassword?: string;
        keyAlias?: string;
        keyPassword?: string;
    };
    bundle: {
        enableHermes?: boolean;
        enableProguard?: boolean;
        codeSplitting?: boolean;
        treeShaking?: boolean;
    };
    assets: {
        splashScreen?: string;
        icon?: string;
        adaptiveIcon?: string;
    };
}
export interface DeploymentConfig {
    platform: 'app-store' | 'play-store' | 'internal' | 'enterprise' | 'hockeyapp' | 'testflight';
    credentials: {
        appleId?: string;
        teamId?: string;
        apiKey?: string;
        serviceAccount?: string;
    };
    metadata: {
        title: string;
        description: string;
        version: string;
        screenshots: string[];
        privacyPolicy?: string;
        supportUrl?: string;
    };
    review: {
        automated: boolean;
        screenshots: boolean;
        metadata: boolean;
    };
}
export declare class MobileDevelopment {
    private apiClient;
    private workingDir;
    private appsPath;
    private templatesPath;
    private buildsPath;
    constructor(apiClient: OqoolAPIClient, workingDir?: string);
    private initializeSystem;
    createMobileApp(): Promise<void>;
    private getAvailableTemplates;
    private generateMobileApp;
    private generateReactNativeApp;
    private generateFlutterApp;
    private generateIonicApp;
    private generateGenericApp;
    buildMobileApp(appId: string, platform: 'ios' | 'android' | 'both'): Promise<void>;
    private buildReactNativeApp;
    private buildFlutterApp;
    private buildIonicApp;
    testMobileApp(appId: string): Promise<void>;
    private testReactNativeApp;
    private testFlutterApp;
    private testIonicApp;
    deployMobileApp(appId: string, platform: 'app-store' | 'play-store' | 'internal'): Promise<void>;
    private prepareDeployment;
    private uploadToStore;
    addMobileFeature(appId: string, featureType: string): Promise<void>;
    private implementMobileFeature;
    private addAuthentication;
    private addNavigation;
    private addCamera;
    private addLocation;
    private addPushNotifications;
    listMobileApps(): Promise<void>;
    getPlatformIcon(platform: string): string;
    private getAppStatus;
    private getFeatureName;
    private saveMobileApp;
    private loadMobileApp;
    private loadMobileApps;
}
export declare function createMobileDevelopment(apiClient: OqoolAPIClient, workingDir?: string): MobileDevelopment;
//# sourceMappingURL=mobile-development.d.ts.map