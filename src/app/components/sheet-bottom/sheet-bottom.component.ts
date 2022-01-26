import { Component, OnInit } from '@angular/core';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import { SideNavService } from '../../services/side-nav.service';
import {HttpClient} from "@angular/common/http";
import {FormControl, FormGroup} from "@angular/forms";
import {MapService} from "../../services/map.service";
//import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-sheet-bottom',
  templateUrl: './sheet-bottom.component.html',
  styleUrls: ['./sheet-bottom.component.css']
})


export class SheetBottomComponent {
  okReply: boolean = false;
  doSpin: boolean = false;
  message: string = "";
  url: string = 'http://k8s1.alia-space.com:30449/be/';
  dataSource: string = "copernicus";
  data: string = "dsm_africa";
  mosaicType: string = "raw";

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  sources: {} = {
    DEM: ["DS"],
    Sentinel2: ["L1C", "L2A"]
  }
  objectKeys = Object.keys;

  constructor(private _bottomSheetRef: MatBottomSheetRef<SheetBottomComponent>,
              private sideNavService: SideNavService,
              private http: HttpClient, private mapService: MapService) {}

  doSubmission(){
    this.okReply = false;
    this.doSpin = true;
    //this.getData();
    this.message = this.generateRequest();
    this.getData(this.message).subscribe((data: boolean) => {
      this.doSpin=false;
      this.okReply=true;
    });
  }

  generateRequest() {
    let userId = 1;
    let layer = "";
    let ROI = "";
    for (let featureKey in this.mapService.featureSelection){
      layer = this.mapService.featureSelection[featureKey]['layerName'];
      ROI = this.mapService.featureSelection[featureKey]['shortName'];
    }

    return this.url + "nuts/execute/" + userId +
      "?datasource=" + this.dataSource +
      "&data=" + this.data +
      "&start=" + this.range.get('start').value.toISOString() +
      "&stop=" + this.range.get('end').value.toISOString()  +
      "&layer=" + layer +
      "&ROI=" + ROI;

  }

  getData(url) {
    return this.http.get<boolean>(url);
  }

  openLink(event: any): void {
    this._bottomSheetRef.dismiss(event);
  }
}
