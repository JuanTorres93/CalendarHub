import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/dom';

import html from '../../index.html?raw';

let appready;

beforeEach(async () => {
  document.body.innerHTML = html;

  vi.resetModules();
  ({ appready } = await import('../utils/loader/loader.js'));
});

describe('loader', () => {
  it('adds the loader-hide class when the app is ready', () => {
    appready();

    expect(screen.getByTestId('loader')).toHaveClass('loader-hide');
  });

  it('removes the loader when the hide animation ends', () => {
    appready();

    const loader = screen.getByTestId('loader');
    loader.dispatchEvent(new Event('animationend'));

    expect(loader).not.toBeInTheDocument();
  });
});