import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';

afterEach(() => {
    cleanup();
});

if (!globalThis.crypto?.randomUUID) {
    Object.defineProperty(globalThis, 'crypto', {
        value: {
            randomUUID: () => 'test-id',
        },
        configurable: true,
    });
}
