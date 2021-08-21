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

  addZone(value: string ){
    this.zones.push({name: value});
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.zones.push({name: value});
    }

    // Clear the input value
    //event.chipInput!.clear();
  }

  remove(zone: Zone): void {
    const index = this.zones.indexOf(zone);

    if (index >= 0) {
      this.zones.splice(index, 1);
    }
  }
}
