import { FormControl } from '@angular/forms';
import { firstValueFrom, isObservable } from 'rxjs';
import { UrlImageValidator } from './url.validator';

describe('UrlImageValidator', () => {
  let validator: ReturnType<typeof UrlImageValidator>;

  beforeEach(() => {
    validator = UrlImageValidator();
  });

  const getValidationResult = async (control: FormControl) => {
    const result = validator(control);
    if (isObservable(result)) {
      return await firstValueFrom(result);
    }
    return result;
  };

  describe('Empty Value Handling', () => {
    it('should accept empty string as valid', async () => {
      const control = new FormControl('');
      expect(await getValidationResult(control)).toBeNull();
    });

    it('should accept whitespace-only values as valid', async () => {
      const control = new FormControl('   ');
      expect(await getValidationResult(control)).toBeNull();
    });

    it('should accept null values as valid', async () => {
      const control = new FormControl(null);
      expect(await getValidationResult(control)).toBeNull();
    });
  });

  describe('URL Format Validation', () => {
    it('should reject invalid URL format', async () => {
      const control = new FormControl('not-a-valid-url');
      const result = await getValidationResult(control);

      expect(result).toEqual({ invalidUrl: true });
    });

    it('should reject non-HTTP protocols', async () => {
      const testCases = ['ftp://example.com/image.jpg', 'file:///path/to/image.jpg', 'data:image/png;base64,abc123'];

      for (const url of testCases) {
        const control = new FormControl(url);
        const result = await getValidationResult(control);
        expect(result).toEqual({ invalidUrl: true });
      }
    });
  });

  describe('File Extension Validation', () => {
    it('should reject non-image file extensions', async () => {
      const invalidExtensions = [
        'https://example.com/document.pdf',
        'https://example.com/video.mp4',
        'https://example.com/archive.zip'
      ];

      for (const url of invalidExtensions) {
        const control = new FormControl(url);
        const result = await getValidationResult(control);
        expect(result).toEqual({ invalidUrl: true });
      }
    });

    it('should reject HTML files', async () => {
      const control = new FormControl('https://example.com/page.html');
      expect(await getValidationResult(control)).toEqual({ invalidUrl: true });
    });

    it('should reject JavaScript files', async () => {
      const control = new FormControl('https://example.com/script.js');
      expect(await getValidationResult(control)).toEqual({ invalidUrl: true });
    });
  });

  describe('Query Parameters Handling', () => {
    it('should validate URLs with query parameters correctly', async () => {
      const control = new FormControl('https://example.com/document.pdf?v=1');
      const result = await getValidationResult(control);

      expect(result).toEqual({ invalidUrl: true });
    });

    it('should handle complex query strings', async () => {
      const control = new FormControl('https://example.com/file.txt?param1=value1&param2=value2');
      const result = await getValidationResult(control);

      expect(result).toEqual({ invalidUrl: true });
    });
  });

  describe('Edge Cases', () => {
    it('should handle URLs with fragments', async () => {
      const control = new FormControl('https://example.com/document.pdf#section1');
      expect(await getValidationResult(control)).toEqual({ invalidUrl: true });
    });

    it('should handle URLs with ports', async () => {
      const control = new FormControl('https://example.com:8080/file.txt');
      expect(await getValidationResult(control)).toEqual({ invalidUrl: true });
    });

    it('should handle URLs with authentication', async () => {
      const control = new FormControl('https://user:pass@example.com/document.pdf');
      expect(await getValidationResult(control)).toEqual({ invalidUrl: true });
    });
  });
});
