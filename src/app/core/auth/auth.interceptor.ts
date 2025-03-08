import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { Observable, catchError, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);

    // Clone the request object
    let newReq = req.clone();
    if (
        authService.accessToken &&
        !AuthUtils.isTokenExpired(authService.accessToken)
    ) {
        newReq = req.clone({
            headers: req.headers.set(
                'Authorization',
                'Bearer ' + authService.accessToken
            ),
        });
    }
    // Response
    return next(newReq).pipe(
        tap((event) => {
            if (event instanceof HttpResponse) {
                console.log('Response received:', event);
            }
        }),
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                authService.signOut();
                console.log('Intercepting request:', req.url, req);
                console.error("401 Unauthorized error detected", error);
            }
            return throwError(error);
        })
    );

};
