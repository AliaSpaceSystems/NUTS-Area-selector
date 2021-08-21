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
  //@ViewChild('sidenav') public sidenav: MatSidenav;
  @ViewChild('sidenav') public sidenav: MatDrawer;
  //@ViewChild('layer') public layer: string;
  sds: SideNavService;

  objectKeys = Object.keys;
  public layerGroups: {} = {};
  public layerArray =  layerArray;

  constructor(private sideNavService: SideNavService, public mapService: MapService) {
    this.sds = sideNavService;

  }



  ngAfterViewInit() {
    this.sideNavService.setSidenav(this.sidenav);
    /*
    this.sideNavService.sideNavToggleSubject.subscribe(()=> {
      console.log("toggle called");
      this.sidenav.toggle();
    });*/
  }
/*
  addAreas(){
    this.sideNavService.addAreas();
  }
*/
  layerChanged(val) {
    //console.log("Layer chaged: " + val);
    this.sideNavService.setLayer(val);
  }
/*
  ngOnInit(){
    layerArray.forEach( (layer,index) => {
      console.log("layer: " + layer.group + "_" + layer.level)
        if (layer.group in this.layerGroups) {
          this.layerGroups[layer.group].push(index);
        } else {
          this.layerGroups[layer.group] = [];
        }
      }
    )
    for (let index in this.layerGroups) {
      console.log("index: " + index)
    }
  }
*/
}
