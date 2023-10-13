import {Component, OnInit} from '@angular/core';
import {CarService} from "../../../../services/car.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.scss']
})
export class FleetComponent implements OnInit {

  id: any;
  fleetData: any;
  editFleet_form: FormGroup;

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private router: ActivatedRoute
  ) {
    this.editFleet_form = this.fb.group({
      fleet_code: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.id = this.router.snapshot.paramMap.get('id');
    this.getOneFleetRequest(this.id);
  }

  getOneFleetRequest(id: string) {
    this.carServ.getOneFleetRequest(id).subscribe({
      next: res => {
        console.log('fleetData', res.body);
        this.editFleet_form.patchValue(res.body)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateFleetRequest(id: string, body: any) {
    this.carServ.patchFleetRequest(id, body).subscribe({
      next: res => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
