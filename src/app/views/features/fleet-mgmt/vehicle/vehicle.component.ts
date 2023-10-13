import { Component, OnInit } from '@angular/core';
import { CarService } from "../../../../services/car.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {

  activeIndex = 1;

  id: any;

  editVehicle_form: FormGroup;

  constructor(private carServ: CarService,
              private fb: FormBuilder,
              private router: ActivatedRoute) {
    this.editVehicle_form = this.fb.group({
      license_plate: ['', [Validators.required]],
      sid: ['', [Validators.required]],
      name: ['', [Validators.required]],
      driver: ['', Validators.required],
      fuel: ['', Validators.required],
      fuel_type: ['', Validators.required],
      vehicle_type: ['', Validators.required],
      vehicle_style: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getOneVehicleRequest()
  }

  vehiclesData: any;

  // 取得Vehicle Data
  getOneVehicleRequest() {
    this.id = this.router.snapshot.paramMap.get('id');
    this.carServ.getOneVehicleRequest(this.id).subscribe({
      next: res => {
        this.vehiclesData = res.body;
        this.putVehicleData(this.vehiclesData)
        console.log(this.vehiclesData);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  putVehicleData(data: any) {
    this.editVehicle_form.patchValue(data)
  }

  updateVehicleRequest(id: string, body: any) {
    this.carServ.patchVehicleRequest(id, body).subscribe({
      next: res => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

}
