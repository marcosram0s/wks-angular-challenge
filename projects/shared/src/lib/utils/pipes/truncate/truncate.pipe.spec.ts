import { TruncatePipe } from './truncate.pipe';
import { TRUNCATE_CONSTANTS } from './models/truncate.model';

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  describe('Null and Empty Handling', () => {
    it('should return empty string for null input', () => {
      expect(pipe.transform(null)).toBe('');
    });

    it('should return empty string for undefined input', () => {
      expect(pipe.transform(undefined)).toBe('');
    });

    it('should return empty string for empty string input', () => {
      expect(pipe.transform('')).toBe('');
    });
  });

  describe('Text Truncation Logic', () => {
    it('should preserve text shorter than limit', () => {
      const shortText = 'Short text';
      expect(pipe.transform(shortText, 20)).toBe('Short text');
    });

    it('should truncate text exceeding the limit', () => {
      const longText = 'This is a very long text that needs to be truncated for display';
      const result = pipe.transform(longText, 20);

      expect(result.length).toBeLessThan(longText.length);
      expect(result).toBe('This is a very long ...');
      expect(result.endsWith('...')).toBe(true);
    });

    it('should use default limit of 50 characters when not specified', () => {
      const text = 'This is a text that is longer than the fifty character limit!';
      const result = pipe.transform(text);

      expect(result.length).toBeLessThanOrEqual(
        TRUNCATE_CONSTANTS.DEFAULT_LIMIT + TRUNCATE_CONSTANTS.DEFAULT_TRAIL.length
      );
      expect(result).toContain(TRUNCATE_CONSTANTS.DEFAULT_TRAIL);
      expect(result).not.toBe(text);
    });

    it('should handle text at exact limit boundary', () => {
      const exactText = 'exactly10';
      expect(pipe.transform(exactText, 9)).toBe('exactly10');
    });
  });

  describe('Custom Trail Support', () => {
    it('should apply custom trail string', () => {
      const text = 'This is a long text for testing';
      const result = pipe.transform(text, 15, '---');

      expect(result).toBe('This is a long ---');
      expect(result.endsWith('---')).toBe(true);
    });

    it('should use default ellipsis when trail not specified', () => {
      const text = 'This is a long text';
      const result = pipe.transform(text, 10);

      expect(result.endsWith(TRUNCATE_CONSTANTS.DEFAULT_TRAIL)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle single character limit', () => {
      const text = 'Test';
      const result = pipe.transform(text, 1);

      expect(result).toBeTruthy();
    });

    it('should handle very large limits', () => {
      const text = 'Short text';
      expect(pipe.transform(text, 1000)).toBe('Short text');
    });

    it('should handle special characters in text', () => {
      const text = 'Text with special chars: @#$%^&*()';
      const result = pipe.transform(text, 20);

      expect(result).toContain('special');
    });
  });
});
