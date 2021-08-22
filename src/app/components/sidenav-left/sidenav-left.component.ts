import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { SideNavService } from '../../services/side-nav.service';
import {MatDrawer, MatSidenav} from "@angular/material/sidenav";
import {layerArray, MapService} from "../../services/map.service";

@Component({
  selector: 'app-sidenav-left',
  templateUrl: './sidenav-left.component.html',
  styleUrls: ['./sidenav-left.component.css']
})

export class SidenavLeftComponent implements AfterViewInit {
  @ViewChild('sidenav') public sidenav: MatDrawer;
  sds: SideNavService;

  objectKeys = Object.keys;
  public layerGroups: {} = {};
  public layerArray =  layerArray;

  constructor(private sideNavService: SideNavService, public mapService: MapService) {
    this.sds = sideNavService;

  }



  ngAfterViewInit() {
    this.sideNavService.setSidenav(this.sidenav);

  }

  layerChanged(val) {
    this.sideNavService.setLayer(val);
  }
}
