import {Component, OnInit} from '@angular/core';
import {CarService} from "../../../../services/car.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-gps-device',
  templateUrl: './gps-device.component.html',
  styleUrls: ['./gps-device.component.scss']
})
export class GpsDeviceComponent implements OnInit {
  activeIndex = 2;
  editGpsDevice_form: FormGroup;
  id: any;

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.editGpsDevice_form = this.fb.group({
      firm: ['', Validators.required],
      id: ['', Validators.required],
      model: ['', Validators.required],
      sid: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getOneGpsDeviceRequest(this.id);
  }

  getOneGpsDeviceRequest(id: string) {
    this.carServ.getGpsDeviceRequest(id).subscribe({
      next: res => {
        this.editGpsDevice_form.patchValue(res.body);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
