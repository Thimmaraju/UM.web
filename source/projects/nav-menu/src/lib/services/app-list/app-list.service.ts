import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppList } from '../../models/app-list.interface';
import { environment as env } from '@env/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppListService {
  private appListURL: string = env.userHost + 'v1/users';
  private portaloktaApp = 'Dashboard';
  mockApps: AppList[] = [
    { name: 'Performance Center', description: '', iconurl: '', url: 'http://localhost:3000' },
    { name: 'General Ledger', description: '', iconurl: '', url: 'http://localhost:3000' },
    { name: 'Global Formulary', description: '', iconurl: '', url: 'http://localhost:3000' },
    { name: 'User Management', description: '', iconurl: '', url: 'http://localhost:3000' },
  ];

  PCicon = require('../../assets/Performance_center.svg');
  GLicon = require('../../assets/General_Ledger.svg');
  GFicon = require('../../assets/Global_Formulary.svg');
  UMicon = require('../../assets/User_Management.svg');

  constructor(private _http: HttpClient) {}

  getApps() {
    return this._http.get<AppList[]>(`${this.appListURL}/apps`).pipe(
      map((apps: any) => {
        return this.updateAppURLandDesc(apps.filter((app) => app.name !== this.portaloktaApp));
      })
    );
  }

  updateAppURLandDesc(apps: any): AppList[] {
    apps.forEach((app) => {
      switch (app.name) {
        case 'Performance Center': {
          app.iconurl = this.PCicon;
          break;
        }
        case 'General Ledger': {
          app.iconurl = this.GLicon;
          break;
        }
        case 'Global Formulary': {
          app.iconurl = this.GFicon;
          break;
        }
        case 'User Management': {
          app.iconurl = this.UMicon;
          break;
        }
        default: {
          break;
        }
      }
    });
    return apps;
  }
}
