import { DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { ScalelineComponent } from './components/scaleline/scaleline.component';
import { MousePositionComponent } from './components/mouse-position/mouse-position.component';
import { SidenavLeftComponent } from './components/sidenav-left/sidenav-left.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { TopbarComponent } from './components/topbar/topbar.component';
import {SideNavService} from './services/side-nav.service';
import { SelectedListComponent } from './components/selected-list/selected-list.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SheetBottomComponent } from './components/sheet-bottom/sheet-bottom.component';
import { MatSpinnerOverlayComponent } from './components/mat-spinner-overlay/mat-spinner-overlay.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatNativeDateModule} from '@angular/material/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AuthComponent } from './auth/auth.component';
import {RouterModule} from '@angular/router';
import {AuthGuard} from './auth/auth.guard';
import {MatInputModule} from '@angular/material/input';
import {AuthInterceptor} from './auth/auth.interceptor';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ScalelineComponent,
    MousePositionComponent,
    SidenavLeftComponent,
    TopbarComponent,
    SelectedListComponent,
    SheetBottomComponent,
    MatSpinnerOverlayComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatBottomSheetModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'map', pathMatch: 'full' },
      { path: 'map', component: MapComponent, canLoad: [AuthGuard],
        loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule) },
      { path: 'auth', component: AuthComponent }
    ]),
    AuthModule
  ],
  providers: [
    AuthGuard,
    DecimalPipe,
    SideNavService,
    MatDatepickerModule,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
