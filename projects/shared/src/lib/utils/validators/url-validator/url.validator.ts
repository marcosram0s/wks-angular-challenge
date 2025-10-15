import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';

export function UrlImageValidator(): AsyncValidatorFn {
  const INVALID_URL_ERROR = { invalidUrl: true };

  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = control.value?.trim();

    if (!value) {
      return of(null);
    }

    try {
      const url = new URL(value);

      if (!['http:', 'https:'].includes(url.protocol)) {
        return of(INVALID_URL_ERROR);
      }

      const NON_IMAGE_EXTENSIONS =
        /\.(html|htm|php|asp|aspx|jsp|js|css|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|xml|json|zip|rar|exe|dmg|mp4|avi|mov|mp3|wav|m4a)(\?.*)?$/i;
      if (NON_IMAGE_EXTENSIONS.test(url.pathname)) {
        return of(INVALID_URL_ERROR);
      }

      return new Observable(observer => {
        const img = new Image();

        const timeoutId = setTimeout(() => {
          observer.next(INVALID_URL_ERROR);
          observer.complete();
        }, 10000);

        img.onload = () => {
          clearTimeout(timeoutId);
          observer.next(null);
          observer.complete();
        };

        img.onerror = () => {
          clearTimeout(timeoutId);
          observer.next(INVALID_URL_ERROR);
          observer.complete();
        };
        img.src = value;
      });
    } catch {
      return of(INVALID_URL_ERROR);
    }
  };
}
