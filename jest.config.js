export default {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1', // Handle relative imports with `.js` extensions
        '^@/(.*)\\.js$': '<rootDir>/src/$1.ts',
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true
            }
        ]
    },
    extensionsToTreatAsEsm: ['.ts'],
    testMatch: ['**/*.test.ts']
};
