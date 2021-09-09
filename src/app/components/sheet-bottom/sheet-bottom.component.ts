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
  noReply: boolean = false;
  doSpin: boolean = false;
  message: string = "";
  url: string = 'http://localhost:8080/';
  headerProperty: String = '';
  dataSource: string = "copernicus";
  data: string = "dsm_africa";
  mosaicType: string = "raw";

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });


  constructor(private _bottomSheetRef: MatBottomSheetRef<SheetBottomComponent>,
              private sideNavService: SideNavService,
              private http: HttpClient, private mapService: MapService) {}

  doSubmission(){
    this.noReply = false;
    this.doSpin = true;
    //this.getData();
    this.message = this.generateRequest();
    setTimeout (() => {
      this.doSpin = false;
      this.noReply = true;
      console.log("Location: " + this.headerProperty);
    }, 5000);
  }

  generateRequest() {
    let buffer = "(";
    let firstComma = true;
    for (let featureKey in this.mapService.featureSelection){
      if (firstComma) firstComma = false; else buffer += ",";
      buffer += "[";
      buffer += this.mapService.featureSelection[featureKey]['layerName'];
      buffer += ",";
      buffer += this.mapService.featureSelection[featureKey]['shortName'];
      buffer += "]";
    }
    buffer += ")";

    let timeBuffer = "";
    try {
      timeBuffer = "([" + this.range.get('start').value.toJSON() + "," + this.range.get('end').value.toJSON() + "])";
    } catch(e) {
      timeBuffer = "()";
    }

    return "http://polyelab.alia-space.com/odata/v1/Orders?OData.CSC.Source(datasource="+ this.dataSource +
      ",data=" + this.data + ",mosaicType=" + this.mosaicType + ",timeRange=" + timeBuffer + ", polygons=" + buffer + ")";
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
