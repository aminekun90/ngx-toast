import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Nettoie le DOM après chaque test
afterEach(() => {
  cleanup();
});