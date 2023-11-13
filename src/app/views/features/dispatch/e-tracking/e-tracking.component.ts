import { Component } from '@angular/core';
import { CarService } from "../../../../services/car.service";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { list } from "../../../../shared/data/dispatch";

@Component({
  selector: 'app-e-tracking',
  templateUrl: './e-tracking.component.html',
  styleUrls: ['./e-tracking.component.scss']
})
export class ETrackingComponent {
  list: any = list;

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private router: Router
  ) {

  }

  goToForm(id: any) {
    this.router.navigate(['/e_tracking_view'])
  }

  selectedTrack: any[] = [];
  handleCheckbox(event: any) {
    console.log('selectedForm:',this.selectedTrack)
    console.log(event)
  }

  getDispatch(level: string): string {
    if (level === '未綁定') {
      return 'info';
    } else {
      return '';
    }
  }

  getStatus(status: string): string {
    if (status === '送達') {
      return 'success';
    } else if (status === '運輸中') {
      return '';
    } else {
      return 'danger'; //逾時
    }
  }
}
