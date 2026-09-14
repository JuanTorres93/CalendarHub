import { beforeEach, expect, it } from 'vitest';
import { screen } from '@testing-library/dom';

import html from '../../index.html?raw';

beforeEach(() => {
  document.body.innerHTML = html;
});

it('dummy test', () => {
  expect(screen.getByText(/CARICAMENTO/)).toBeInTheDocument();
});
