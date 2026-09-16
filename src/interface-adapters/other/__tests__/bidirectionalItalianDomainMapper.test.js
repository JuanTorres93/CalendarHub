import { describe, expect, it } from 'vitest';

import {
  toDomainNotification,
  toDomainNotificationIfItalian,
  toItalianNotification,
} from '../bidirectionalItalianDomainMapper.js';

describe('bidirectionalItalianDomainMapper', () => {
  describe('toDomainNotification', () => {
    it.each([
      ['nessuna notifica', 'none'],
      ['5 minuti prima', '5min'],
      ['15 minuti prima', '15min'],
      ['1 ora prima', '1h'],
      ['2 ore prima', '2h'],
      ['4 ore prima', '4h'],
      ['24 ore prima', '1d'],
    ])('should map "%s" to "%s"', (italian, domain) => {
      expect(toDomainNotification(italian)).toBe(domain);
    });

    it('should throw for an unknown label', () => {
      expect(() => toDomainNotification('3 ore prima')).toThrow(Error);
    });
  });

  describe('toDomainNotificationIfItalian', () => {
    it.each([
      ['nessuna notifica', 'none'],
      ['5 minuti prima', '5min'],
      ['1 ora prima', '1h'],
    ])('should map "%s" to "%s"', (italian, domain) => {
      expect(toDomainNotificationIfItalian(italian)).toBe(domain);
    });

    it('should return the value unchanged if it is already domain', () => {
      expect(toDomainNotificationIfItalian('1h')).toBe('1h');
    });
  });

  describe('toItalianNotification', () => {
    it.each([
      ['none', 'nessuna notifica'],
      ['5min', '5 minuti prima'],
      ['15min', '15 minuti prima'],
      ['1h', '1 ora prima'],
      ['2h', '2 ore prima'],
      ['4h', '4 ore prima'],
      ['1d', '24 ore prima'],
    ])('should map "%s" to "%s"', (domain, italian) => {
      expect(toItalianNotification(domain)).toBe(italian);
    });

    it('should throw for an unknown domain value', () => {
      expect(() => toItalianNotification('3h')).toThrow(Error);
    });
  });
});