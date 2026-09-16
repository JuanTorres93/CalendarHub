import '@testing-library/jest-dom/vitest';
import { beforeEach, vi } from 'vitest';
import { createLocalStorageMock } from './mocks/localStorage.mock.js';

vi.stubGlobal('localStorage', createLocalStorageMock());

beforeEach(() => {
  localStorage.clear();
});

Element.prototype.scrollIntoView = () => {};
Element.prototype.scrollTo = () => {};
Element.prototype.getClientRects = () => [
  {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
  },
];
