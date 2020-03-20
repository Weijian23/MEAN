import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponemt } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((myerror: HttpErrorResponse) => {
        // console.log(myerror);
        let errorMessage = "An unknown error occurred.";
        if (myerror.error.message) {
          errorMessage = myerror.error.message;
        }
        this.dialog.open(ErrorComponemt, { data: { message: errorMessage } });
        return throwError(myerror);
      })
    );
  }
}
