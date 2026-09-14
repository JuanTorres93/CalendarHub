import '@testing-library/jest-dom/vitest';
import { beforeEach, vi } from 'vitest';
import { createLocalStorageMock } from './mocks/localStorage.mock.js';

vi.stubGlobal('localStorage', createLocalStorageMock());

beforeEach(() => {
  localStorage.clear();
});

Element.prototype.scrollIntoView = () => {};
Element.prototype.scrollTo = () => {};

