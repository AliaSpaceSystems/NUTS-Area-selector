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
  url: string = '/bedev/';
  dataSource: string = "copernicus";
  data: string = "dsm_africa";
  mosaicType: string = "raw";

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  sources: {} = {
    DEM: ["DS"],
    Sentinel2: ["S2MSI1C", "S2MSI2A"]
  }
  objectKeys = Object.keys;

  constructor(private _bottomSheetRef: MatBottomSheetRef<SheetBottomComponent>,
              private sideNavService: SideNavService,
              private http: HttpClient, private mapService: MapService) {}

  doEstimation(){
    this.okReply = false;
    this.doSpin = true;
    //this.getData();
    this.message = this.generateRequest('estimate');
    this.getData(this.message).subscribe((data: boolean) => {
      this.doSpin=false;
      this.okReply=true;
    });
  }

  doExecution(){
    this.okReply = false;
    this.doSpin = true;
    //this.getData();
    this.message = this.generateRequest('execute');
    this.getData(this.message).subscribe((data: boolean) => {
      this.doSpin=false;
      this.okReply=true;
    });
  }

  generateRequest(action) {
    let userId = 1;
    let layer = "";
    let ROI = "";
    for (let featureKey in this.mapService.featureSelection) {
      layer = this.mapService.featureSelection[featureKey]['layerName'];
      ROI = this.mapService.featureSelection[featureKey]['shortName'];
    }

    let dataSource = this.dataSource
    if (dataSource == "Sentinel2") dataSource = "Sentinel-2";

    return this.url + "nuts/" + action + "/" + userId +
      "?datasource=" + dataSource +
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
