import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { SideNavService } from '../../services/side-nav.service';
import {MatSidenav} from "@angular/material/sidenav";

@Component({
  selector: 'app-sidenav-left',
  templateUrl: './sidenav-left.component.html',
  styleUrls: ['./sidenav-left.component.css']
})

export class SidenavLeftComponent implements AfterViewInit {
  @ViewChild('sidenav') public sidenav: MatSidenav;
  //@ViewChild('layer') public layer: string;
  constructor(private sideNavService: SideNavService) { }

  ngAfterViewInit() {
    this.sideNavService.setSidenav(this.sidenav);
    /*
    this.sideNavService.sideNavToggleSubject.subscribe(()=> {
      console.log("toggle called");
      this.sidenav.toggle();
    });*/
  }

  layerChanged(val) {
    console.log("Layer chaged: " + val);
    this.sideNavService.setLayer(val);
  }

}
