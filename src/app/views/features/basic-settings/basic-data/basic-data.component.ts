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
      fleet_id: this.addVehicle_form.controls['fleet_id'].value,
      name: this.addVehicle_form.controls['name'].value,
      driver: this.addVehicle_form.controls['driver'].value,
      license_plate: this.addVehicle_form.controls['license_plate'].value,
      sid: this.addVehicle_form.controls['sid'].value
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

    this.getAllVehiclesRequest()
  }

}
