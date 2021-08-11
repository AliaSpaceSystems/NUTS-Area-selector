import { Injectable, EventEmitter } from '@angular/core';
// import { DrawerComponent } from './drawer/drawer.component';
import { MatSidenav } from '@angular/material/sidenav';
//import { BehaviorSubject } from 'rxjs';
@Injectable()
export class SideNavService {

  //public sideNavToggleSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  private sidenav: MatSidenav;

  constructor() { }

  public setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  public setLayer(layer: string) {
    console.log("Layer chaged on service: " + layer);
  }
  public toggle() {
    this.sidenav.toggle();
    //return this.sideNavToggleSubject.next(null);
  }
}
