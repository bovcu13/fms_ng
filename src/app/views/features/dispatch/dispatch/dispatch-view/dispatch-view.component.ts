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
  workData: any;
  taskList: any;

  event_form: FormGroup;

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

    this.workData = workData[this.id - 1];
    this.taskList = this.workData.form;

    this.taskData = this.workData.form[0];
    console.log('goodsData:', this.taskData);
    this.shippingList = this.taskData.shipping_list;

    console.log('workData:', this.workData);

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
      name: this.workData.driver
    }
    const form = this.workData.form.map((item: any) => ({ name: item.name }));

    this.event_form.patchValue(this.workData);
    this.event_form.patchValue({
      start_date: new Date((this.workData.start)),
      end_date: new Date((this.workData.end)),
      driver: driver,
      form: form
    });
  }

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

  goodsForm: any;
  taskData: any;
  shippingList: any;
  onClickTask(event: any) {
    console.log('CLickEvent:', event);
    this.taskData = event.value;
    console.log('goodsData:', this.taskData);

    if (this.taskData && this.taskData.length > 0) {
      this.goodsForm = this.taskData[0].name;
      this.shippingList = this.taskData[0].shipping_list;
      console.log('goodsForm:', this.goodsForm);
      console.log('shipping_list:', this.shippingList);
    } else {
      console.log('goodsData is empty or invalid');
    }
  }

  onReorderTask(event: any) {
    console.log('ReorderEvent:', event);
  }
}
