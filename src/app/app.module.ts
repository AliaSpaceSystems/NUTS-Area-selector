import { DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { ScalelineComponent } from './components/scaleline/scaleline.component';
import { MousePositionComponent } from './components/mouse-position/mouse-position.component';
import { LayerSelectorComponent } from './components/layer-selector/layer-selector.component';
import { SidenavLeftComponent } from './components/sidenav-left/sidenav-left.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { TopbarComponent } from './components/topbar/topbar.component';
import {SideNavService} from './services/side-nav.service'

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ScalelineComponent,
    MousePositionComponent,
    LayerSelectorComponent,
    SidenavLeftComponent,
    TopbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule
  ],
  providers: [DecimalPipe, SideNavService],
  bootstrap: [AppComponent]
})
export class AppModule { }
