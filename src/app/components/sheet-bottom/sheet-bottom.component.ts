import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import { SideNavService } from '../../services/side-nav.service';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {FormControl, FormGroup} from "@angular/forms";
import {MapService} from "../../services/map.service";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
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
  url: string = '/be/';
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

  @ViewChild('dialogRef')
  dialogRef!: TemplateRef<any>;

  private error_message: any;

  constructor(private _bottomSheetRef: MatBottomSheetRef<SheetBottomComponent>,
              private sideNavService: SideNavService,
              private http: HttpClient, private mapService: MapService, private dialog: MatDialog) {}

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
    this.handleError.bind(this);
    return this.http.get<boolean>(url)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }


  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred: ', error.error);
      this.error_message = 'An error occurred: ' + error.error;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
      this.error_message = 'Backend returned code ' + error.status + 'body was: ' + error.error;
    }


    const myTempDialog = this.dialog.open(this.dialogRef, { data: this.error_message });
    myTempDialog.afterClosed().subscribe( ()=> {

      // Data back from dialog
      window.location.reload();
    });

    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  openLink(event: any): void {
    this._bottomSheetRef.dismiss(event);
  }
}
