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

  events: string[];

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.events = [
      "2020", "2021"
    ];
  }

  goToForm(id: any) {
    this.router.navigate(['/dispatch_list', id])
  }
}
