import { Component, OnInit } from '@angular/core';
import { SideNavService } from '../../services/side-nav.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {
  title: string = "Area Selector - Alia Space";

  constructor(private sideNavService: SideNavService) {

  }

  clickMenu() {
    this.sideNavService.toggle();
  }
}
