import { Component, OnInit } from '@angular/core';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import { SideNavService } from '../../services/side-nav.service';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-sheet-bottom',
  templateUrl: './sheet-bottom.component.html',
  styleUrls: ['./sheet-bottom.component.css']
})

export class SheetBottomComponent {
  noReply: boolean = false;
  doSpin: boolean = false;
  url: string = 'http://localhost:8080/';
  headerProperty: String = '';

  constructor(private _bottomSheetRef: MatBottomSheetRef<SheetBottomComponent>,
              private sideNavService: SideNavService,
              private http: HttpClient) {}

  doEstimation(){
    this.noReply = false;
    this.doSpin=true;
    this.getData();
    setTimeout (() => {
      this.doSpin = false;
      this.noReply = true;
      console.log("Location: " + this.headerProperty);
    }, 5000);
  }

  getData() {
    this.http.get<any>(this.url+"create?id=1&name=test", {observe: 'response'}).subscribe(resp => {
      console.log("Location:" + resp.headers.get('Location'));
      console.log("Body: " + JSON.stringify(resp.body));
    });
  }

  openLink(event: any): void {
    this._bottomSheetRef.dismiss(event);
  }
}
