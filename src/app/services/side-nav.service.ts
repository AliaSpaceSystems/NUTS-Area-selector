//import { Injectable, EventEmitter } from '@angular/core';
// import { DrawerComponent } from './drawer/drawer.component';
import {MatDrawer, MatSidenav} from '@angular/material/sidenav';
import {MapComponent} from "../components/map/map.component";
//import { BehaviorSubject } from 'rxjs';
//@Injectable()
export class SideNavService {

  //public sideNavToggleSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  private sidenav: MatDrawer;
  private map: MapComponent;

  constructor() { }

  public setSidenav(sidenav: MatDrawer) {
    this.sidenav = sidenav;
  }

  public setMap(map: MapComponent) {
    this.map = map;
  }

  public setLayer(layer: string) {
    this.map.setLayer(layer);
  }
  public toggle() {
    this.sidenav.toggle();
    console.log("hbkjhjlòk-")
    //return this.sideNavToggleSubject.next(null);
  }
}
