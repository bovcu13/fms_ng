import { Component } from '@angular/core';
import { list } from "../../../../../shared/data/dispatch";
import { CarService } from "../../../../../services/car.service";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-dispatch-list',
  templateUrl: './dispatch-list.component.html',
  styleUrls: ['./dispatch-list.component.scss']
})
export class DispatchListComponent {
  list: any = list;

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  goToForm(id: any) {
    this.router.navigate(['/dispatch_list', id])
  }

  selectedForm: any[] = [];
  handleCheckbox(value: any) {
    console.log('selectedForm:',this.selectedForm)
  }
}
