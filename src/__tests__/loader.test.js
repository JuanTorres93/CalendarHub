import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/dom';

import html from '../../index.html?raw';

let appready;
let loaderElement;

beforeEach(async () => {
  document.body.innerHTML = html;

  vi.resetModules();

  const { createLoader } = await import('../components/features/loader/Loader.js');
  const loader = createLoader();
  document.body.appendChild(loader.mainComponent);

  ({ appready } = await import('../utils/loader/loader.js'));
  loaderElement = loader.internalDomElements.loader;
});

describe('loader', () => {
  it('adds the loader-hide class when the app is ready', () => {
    appready(loaderElement);

    expect(screen.getByTestId('loader')).toHaveClass('loader-hide');
  });

  it('removes the loader when the hide animation ends', () => {
    appready(loaderElement);

    const loader = screen.getByTestId('loader');
    loader.dispatchEvent(new Event('animationend'));

    expect(loader).not.toBeInTheDocument();
  });
});