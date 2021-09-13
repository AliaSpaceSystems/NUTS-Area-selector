import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';
import { SideNavService } from '../../services/side-nav.service';
import {MapService} from "../../services/map.service";
import {Subscription} from 'rxjs';
import {delay} from 'rxjs/operators';

export interface Zone {
  name: string;
}


@Component({
  selector: 'app-selected-list',
  templateUrl: './selected-list.component.html',
  styleUrls: ['./selected-list.component.css']
})


export class SelectedListComponent implements OnInit, OnDestroy {
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  zones: Zone[] = [];
  sub: Subscription;

  identifiers: string[] = [];

  objectKeys = Object.keys;

  constructor(
    private sideNavService: SideNavService,
    public mapService: MapService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.sideNavService.setSelectedZones(this);

    this.mapService.selectedLayers.pipe(
      delay(0.05)
    ).subscribe((ids: string[]) => {
      console.log('New selectedLayers ids are ', ids);
      this.identifiers = [...ids];
      this.changeDetector.detectChanges();
    });
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

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
