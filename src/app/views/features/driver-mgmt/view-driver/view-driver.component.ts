import {Component, OnInit} from '@angular/core';
import {CarService} from "../../../../services/car.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-view-driver',
  templateUrl: './view-driver.component.html',
  styleUrls: ['./view-driver.component.scss']
})
export class ViewDriverComponent implements OnInit {

  editDriver_form: FormGroup;
  id: any;

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.editDriver_form = this.fb.group({
      employee_id: [''],
      driver: ['', Validators.required],
      mobile_phone: [''],
      id_number: [''],
      employee_number: [''],
      email: [''],
      address: [''],
      daily_cost: [''],
      created_at: [''],
      created_by: [''],
      updated_at: [''],
      updated_by: [''],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getOneVehicleRequest(this.id);
  }

  getOneVehicleRequest(id: string) {
    this.carServ.getOneVehicleRequest(id).subscribe({
      next: res => {
        this.editDriver_form.patchValue(res.body);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
