import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, OnInit} from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';
import { SideNavService } from '../../services/side-nav.service';
import {MapService} from "../../services/map.service";

export interface Zone {
  name: string;
}


@Component({
  selector: 'app-selected-list',
  templateUrl: './selected-list.component.html',
  styleUrls: ['./selected-list.component.css']
})


export class SelectedListComponent implements OnInit {
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  zones: Zone[] = [];

  objectKeys = Object.keys;

  constructor(private sideNavService: SideNavService, public mapService: MapService) {
  }

  ngOnInit() {
    this.sideNavService.setSelectedZones(this);
  }

  chipClick(zone: string) {
    //console.log("chipZone: " + zone);
    this.sideNavService.higlightZone(zone);
  }

  chipFocus(zone: string, event) {
    console.log("chipFocus: " + event.clientX);
    //this.sideNavService.showTip(zone, event);
  }

  remove(zone: string){
    this.sideNavService.removeZone(zone);
  }

}
