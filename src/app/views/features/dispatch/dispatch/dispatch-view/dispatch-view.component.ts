import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CarService } from "../../../../../services/car.service";
import { workData } from "../../../../../shared/data/event";
import { list } from "../../../../../shared/data/dispatch";

@Component({
  selector: 'app-dispatch-view',
  templateUrl: './dispatch-view.component.html',
  styleUrls: ['./dispatch-view.component.scss']
})
export class DispatchViewComponent implements OnInit {
  id: any = 0;
  list: any = list;
  workData = workData

  event_form: FormGroup;

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

    this.event_form = this.fb.group({
      id: ['', Validators.required],
      title: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      type: ['', [Validators.required]],
      form: [''],
      driver: [''],
      vehicle: [''],
      trailer: [''],
      description: [''],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    });

    const driver = {
      name: workData[this.id - 1].driver
    }
    const form = workData[this.id - 1].form.map((item: any) => ({ name: item.name }));
    console.log('form:', form)
    this.event_form.patchValue(workData[this.id - 1]);
    this.event_form.patchValue({
      start_date: new Date((workData[this.id - 1].start)),
      end_date: new Date((workData[this.id - 1].end)),
      driver: driver,
      form: form
    });
  }

  taskList = workData[this.id].form

  ngOnInit(): void {
    this.getFormListName();
    this.getAllDriversRequest();
  }

  formList: any

  getFormListName() {
    this.formList = list.map((item: any) => ({
      name: item.name,
    }));
    console.log('formList:', this.formList);
  }

  driverData: any

  getAllDriversRequest() {
    this.carServ.getAllDriversRequest().subscribe({
      next: res => {
        this.driverData = res.body.drivers.map((item: any) => ({
          name: item.name,
        }));
        console.log('driverData:', this.driverData);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
