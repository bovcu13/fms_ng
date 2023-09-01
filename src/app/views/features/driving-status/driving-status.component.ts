import { Component } from '@angular/core';
import { status } from "../../../shared/data/status";

@Component({
  selector: 'app-driving-status',
  templateUrl: './driving-status.component.html',
  styleUrls: ['./driving-status.component.scss']
})
export class DrivingStatusComponent {
  status: any[] = status;
  selectedStatus: any;

  sidebarRightOpen = true;

  toggleSidebar() {
    this.sidebarRightOpen = !this.sidebarRightOpen;
  }

  getMiddleDivClass() {
    if (this.sidebarRightOpen) {
      return 'col-12 md:col-12 lg:col-5';
    } else {
      return 'col-12 md:col-12 lg:col-12';
    }
  }
}
