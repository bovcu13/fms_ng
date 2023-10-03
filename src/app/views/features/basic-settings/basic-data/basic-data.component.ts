import { Component, OnInit } from '@angular/core';
import { carData } from "../../../../shared/data/products";
import { CarService } from "../../../../services/car.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-basic-data',
  templateUrl: './basic-data.component.html',
  styleUrls: ['./basic-data.component.scss']
})
export class BasicDataComponent implements OnInit {
  carData :any[] = carData;
  addVehicle_form: FormGroup;
  constructor(private carServ: CarService, private fb: FormBuilder) {
    this.addVehicle_form = this.fb.group({
      fleet_id: ['c2d40ef0-341a-4793-b1b3-f4e4f82ba9f2', [Validators.required]],
      name: ['', [Validators.required]],
      driver: ['', [Validators.required]],
      license_plate: ['', Validators.required],
      sid: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getAllVehiclesRequest()
  }

  cars: any;

  vehiclesData: any;

  // 取得車牌
  getAllVehiclesRequest() {
    this.carServ.getAllVehiclesRequest().subscribe({
      next: res => {
        this.vehiclesData = res.body.vehicles;
        this.cars = this.vehiclesData.map((item: any) => ({
          name: item.license_plate,
          code: item.license_plate
        }));
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  editable = false;
  edit() {
    this.editable = true;
  }
  save() {
    this.editable = false;
  }
  cancel() {
    this.editable = false;
  }

  addDialogVisible = false;
  openAddCarDialog() {
    this.addDialogVisible = true;
  }

  postVehicleRequest() {
    let body = {
      fleet_code: this.addVehicle_form.controls['fleet_code'].value,
      name: this.addVehicle_form.controls['name'].value,
      phone_number1: this.addVehicle_form.controls['phone_number1']?.value,
      user_name: this.addVehicle_form.controls['user_name'].value,
      password: this.addVehicle_form.controls['password'].value,
      role_id: this.addVehicle_form.controls['role_id'].value
    }
    this.carServ.postVehicleRequest(body).subscribe({
      next: data => {
        console.log(data)
        console.log(body)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

}
