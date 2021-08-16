import { Component, OnInit } from '@angular/core';
import { SideNavService } from '../../services/side-nav.service';
import {SheetBottomComponent} from "../sheet-bottom/sheet-bottom.component";
import {MatBottomSheet} from "@angular/material/bottom-sheet";

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {
  title: string = "Area Selector - Alia Space";

  constructor(private sideNavService: SideNavService, private _bottomSheet: MatBottomSheet) {}

  openBottomSheet(): void {
    this._bottomSheet.open(SheetBottomComponent)
      .afterDismissed().subscribe((result) => {
      console.log(result);
      console.log('Bottom sheet has been dismissed.');
    });
  }

  clickDone() {
    this.openBottomSheet();/*
    console.log("done clicked");
    this.waitForReply = true;
    setTimeout (() => {
      this.waitForReply = false;
      this.openBottomSheet();
    }, 5000);*/
  }

  clickMenu() {
    this.sideNavService.toggle();
  }
}

