//import { Injectable, EventEmitter } from '@angular/core';
// import { DrawerComponent } from './drawer/drawer.component';
import {MatDrawer, MatSidenav} from '@angular/material/sidenav';
import {MapComponent} from "../components/map/map.component";
import {SidenavLeftComponent} from "../components/sidenav-left/sidenav-left.component";
import {SelectedListComponent} from "../components/selected-list/selected-list.component";
//import { BehaviorSubject } from 'rxjs';
//@Injectable()
export class SideNavService {

  //public sideNavToggleSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  private sidenav: SidenavLeftComponent;
  private map: MapComponent;
  private selzones: SelectedListComponent;

  constructor() { }

  public setSelectedZones(selzones: SelectedListComponent) {
    this.selzones = selzones;
  }

  public removeZone(zone: string) {
    this.map.removeZone(zone);
  }

  public higlightZone(zone: string) {
    if (this.map.globalSelection[zone].layerID != this.sidenav.layer) {
      this.sidenav.setLayerSelection(this.map.globalSelection[zone].layerID);
    }
    this.map.higlightZone(zone);

  }
/*
  public showTip(zone: string, event) {
    this.map.showTip(zone, event);
  }

 */

  public setSidenav(sidenav: SidenavLeftComponent) {
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

  public showAllSelection() {
    this.map.showAllSelection();
  }

  public toggle() {
    this.sidenav.sidenav.toggle();
  }
}
