import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class LibToasterService {
  constructor(private snackBar: MatSnackBar) { }

  showToaster(msg: string) {
    this.snackBar.open(msg, null, {
      duration: 5000
    });
  }
}
