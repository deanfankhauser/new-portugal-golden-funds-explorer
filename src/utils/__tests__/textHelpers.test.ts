import { describe, it, expect } from 'vitest';
import { pluralize, getArticle, withArticle, formatFundCount, formatCurrencyValue } from '../textHelpers';

describe('textHelpers', () => {
  describe('pluralize', () => {
    it('returns singular for count of 1', () => {
      expect(pluralize(1, 'fund')).toBe('fund');
    });
    it('returns plural for count of 0', () => {
      expect(pluralize(0, 'fund')).toBe('funds');
    });
    it('returns plural for count > 1', () => {
      expect(pluralize(5, 'fund')).toBe('funds');
    });
    it('handles custom plural forms', () => {
      expect(pluralize(2, 'category', 'categories')).toBe('categories');
    });
  });

  describe('getArticle', () => {
    it('returns "an" for vowel-starting words', () => {
      expect(getArticle('infrastructure')).toBe('an');
      expect(getArticle('other')).toBe('an');
      expect(getArticle('equity')).toBe('an');
    });
    it('returns "a" for consonant-starting words', () => {
      expect(getArticle('private')).toBe('a');
      expect(getArticle('debt')).toBe('a');
      expect(getArticle('venture')).toBe('a');
    });
    it('handles empty string', () => {
      expect(getArticle('')).toBe('a');
    });
  });

  describe('withArticle', () => {
    it('prefixes with correct article', () => {
      expect(withArticle('infrastructure')).toBe('an infrastructure');
      expect(withArticle('private equity')).toBe('a private equity');
    });
  });

  describe('formatFundCount', () => {
    it('handles singular correctly', () => {
      expect(formatFundCount(1)).toBe('1 fund');
    });
    it('handles zero correctly', () => {
      expect(formatFundCount(0)).toBe('0 funds');
    });
    it('handles multiple correctly', () => {
      expect(formatFundCount(25)).toBe('25 funds');
    });
  });

  describe('formatCurrencyValue', () => {
    it('returns "Not disclosed" for null', () => {
      expect(formatCurrencyValue(null)).toBe('Not disclosed');
    });
    it('returns "Not disclosed" for undefined', () => {
      expect(formatCurrencyValue(undefined)).toBe('Not disclosed');
    });
    it('returns "Not disclosed" for 0', () => {
      expect(formatCurrencyValue(0)).toBe('Not disclosed');
    });
    it('formats with thousands separators', () => {
      expect(formatCurrencyValue(500000)).toBe('€500,000');
    });
  });
});
