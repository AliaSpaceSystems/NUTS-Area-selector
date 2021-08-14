import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, OnInit} from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';
import { SideNavService } from '../../services/side-nav.service';

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
  zones: Zone[] = [
    {name: 'Lemon'},
    {name: 'Lime'},
    {name: 'Apple'},
  ];

  constructor(private sideNavService: SideNavService) {
  }

  ngOnInit() {
    this.sideNavService.setSelectedZones(this);
  }

  addZone(value: string ){
    this.zones.push({name: value});
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
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
