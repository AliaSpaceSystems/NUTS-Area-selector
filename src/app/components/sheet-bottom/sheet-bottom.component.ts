import { Component, OnInit } from '@angular/core';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import { SideNavService } from '../../services/side-nav.service';

@Component({
  selector: 'app-sheet-bottom',
  templateUrl: './sheet-bottom.component.html',
  styleUrls: ['./sheet-bottom.component.css']
})

export class SheetBottomComponent {
  noReply: boolean = false;
  doSpin: boolean = false;

  constructor(private _bottomSheetRef: MatBottomSheetRef<SheetBottomComponent>, private sideNavService: SideNavService) {}

  doEstimation(){
    this.noReply = false;
    this.doSpin=true;
    setTimeout (() => {
      this.doSpin = false;
      this.noReply = true;
    }, 5000);
  }

  openLink(event: any): void {
    this._bottomSheetRef.dismiss(event);
  }
}
