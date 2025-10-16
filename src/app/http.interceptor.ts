
import { HttpInterceptorFn } from '@angular/common/http';

export const ngrokInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    setHeaders: {
      'ngrok-skip-browser-warning': '69420'
    }
  });
  return next(clonedRequest);
};