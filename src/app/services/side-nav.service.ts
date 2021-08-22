//import { Injectable, EventEmitter } from '@angular/core';
// import { DrawerComponent } from './drawer/drawer.component';
import {MatDrawer, MatSidenav} from '@angular/material/sidenav';
import {MapComponent} from "../components/map/map.component";
import {SelectedListComponent} from "../components/selected-list/selected-list.component";
//import { BehaviorSubject } from 'rxjs';
//@Injectable()
export class SideNavService {

  //public sideNavToggleSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  private sidenav: MatDrawer;
  private map: MapComponent;
  private selzones: SelectedListComponent;

  constructor() { }

  public setSelectedZones(selzones: SelectedListComponent) {
    this.selzones = selzones;
  }

  public setSidenav(sidenav: MatDrawer) {
    this.sidenav = sidenav;
  }

  public setMap(map: MapComponent) {
    this.map = map;
  }

  public doSpin(doSpin: boolean) {
    this.map.doSpin = doSpin;
  }

  public setLayer(layer: number) {
    this.map.setLayer(layer);
  }

  public toggle() {
    this.sidenav.toggle();
  }
}
