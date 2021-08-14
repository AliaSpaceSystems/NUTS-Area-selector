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
      let val = features[key].getProperties();
      if (this.map.selectedLayer.includes('gadm')) {
        if (typeof val['NAME_5'] == "string") {
          this.selzones.addZone(features[key].getProperties()['NAME_5']);
        } else if (typeof val['NAME_4'] == "string") {
          this.selzones.addZone(features[key].getProperties()['NAME_4']);
        } else if (typeof val['NAME_3'] == "string") {
          this.selzones.addZone(features[key].getProperties()['NAME_3']);
        } else if (typeof val['NAME_2'] == "string") {
          this.selzones.addZone(features[key].getProperties()['NAME_2']);
        } else if (typeof val['NAME_1'] == "string") {
          this.selzones.addZone(features[key].getProperties()['NAME_1']);
        } else if (typeof val['NAME_0'] == "string") {
          this.selzones.addZone(features[key].getProperties()['NAME_0']);
        }
      } else if (this.map.selectedLayer.includes('nuts')) {
        this.selzones.addZone(features[key].getProperties()['NUTS_NAME']);
      }
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
