export declare const SECRET_PATTERNS: ReadonlyArray<{ name: string; regex: RegExp }>;
export declare const PII_PATTERNS: ReadonlyArray<{ name: string; regex: RegExp }>;
export declare function findServiceRoleJwts(text: string): string[];
export declare function findSecrets(text: string): string[];
export declare function findPii(text: string): string[];
