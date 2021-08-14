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

  public addAreas(){
    let features = this.map.getSelected();
    for (let key in features) {
      console.log("feature: " + features[key].getProperties()['NAME_3']);
      this.selzones.addZone(features[key].getProperties()['NAME_3']);
    }
  }

  public setSelectedZones(selzones: SelectedListComponent) {
    this.selzones = selzones;
  }

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
    //return this.sideNavToggleSubject.next(null);
  }
}
