import { beforeEach, describe, expect, it, vi } from 'vitest';

import html from '../../index.html?raw';
import dayjs from '../day.js';

let applyTheme;

beforeEach(async () => {
  document.body.innerHTML = html;

  vi.resetModules();

  const { createThemeLayers } = await import(
    '../components/features/theme/ThemeLayers.js'
  );
  const { createTheme } = await import('../utils/theme.js');

  const themeLayers = createThemeLayers();
  document.body.appendChild(themeLayers.fragment);

  applyTheme = createTheme(themeLayers.internalDomElements);
});

describe('theme', () => {
  it('applies the autumn background in September', () => {
    applyTheme(dayjs('2026-09-14'));

    expect(document.body.style.backgroundImage).toBe(
      'url("/images/background/autunno.png")',
    );
  });

  it('applies the winter background in January', () => {
    applyTheme(dayjs('2026-01-10'));

    expect(document.body.style.backgroundImage).toBe(
      'url("/images/background/inverno.png")',
    );
  });

  it('applies the spring background in April', () => {
    applyTheme(dayjs('2026-04-10'));

    expect(document.body.style.backgroundImage).toBe(
      'url("/images/background/primavera.png")',
    );
  });

  it('applies the summer background in July', () => {
    applyTheme(dayjs('2026-07-10'));

    expect(document.body.style.backgroundImage).toBe(
      'url("/images/background/estate.png")',
    );
  });

  it('sets the prev and next seasonal backgrounds', () => {
    applyTheme(dayjs('2026-09-14'));

    expect(document.getElementById('prev-layer').style.backgroundImage).toBe(
      'url("/images/background/estate.png")',
    );
    expect(document.getElementById('next-layer').style.backgroundImage).toBe(
      'url("/images/background/inverno.png")',
    );
  });
});