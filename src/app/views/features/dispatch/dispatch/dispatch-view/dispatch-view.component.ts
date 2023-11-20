import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CarService } from "../../../../../services/car.service";
import { DispatchService } from "../../../../../services/dispatch.service";

@Component({
  selector: 'app-dispatch-view',
  templateUrl: './dispatch-view.component.html',
  styleUrls: ['./dispatch-view.component.scss']
})
export class DispatchViewComponent implements OnInit {
  id: any = 0;

  event_form: FormGroup;

  constructor(
    private carServ: CarService,
    private dispatchServ: DispatchService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

    this.event_form = this.fb.group({
      id: ['', Validators.required],
      title: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      // end_date: ['', [Validators.required]],
      form: [''],
      driver: [''],
      vehicle: [''],
      description: [''],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    });
  }

  ngOnInit(): void {
    this.getOneTransportTask(this.id);
    this.getAllTransportOrder();
    this.getAllDriversRequest();
    this.getAllVehiclesRequest();
  }

  formList: any = [];

  getOneTransportTask(id: string) {
    this.dispatchServ.getOneTransportTask(id).subscribe({
      next: res => {
        console.log('getOneTransportTask:', res.body);
        // 取得派工任務的託運訂單
        this.formList = res.body.form;
        console.log('formList:', this.formList);

        this.event_form.patchValue(res.body);

        // 只取託運訂單名稱陣列
        const formArray = this.formList.map((item: any) => ({ name: item.name }));
        this.event_form.patchValue({
          form: formArray,
          driver: {
            name: res.body.driver_name,
            id: res.body.driver_id,
          },
          vehicle: {
            name: res.body.vehicle_name,
            id: res.body.vehicle_id,
          },
        });

        this.formName = this.formList[0].name;
        this.shipList = this.formList[0].shipping_list;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // 取得表單
  formData: any;

  getAllTransportOrder() {
    this.dispatchServ.getAllTransportOrder().subscribe({
      next: res => {
        this.formData = res.body.transport_orders.map((item: any) => ({
          name: item.name,
        }));
        console.log('formData:', this.formData)
      },
      error: (err) => {
        console.log('getAllTransportOrderError:', err);
      },
    });
  }

  // 司機
  driverData: any

  getAllDriversRequest() {
    this.carServ.getAllDriversRequest().subscribe({
      next: res => {
        this.driverData = res.body.drivers.map((item: any) => ({
          name: item.name,
          id: item.id
        }));
        console.log('driverData:', this.driverData);
      },
      error: (err) => {
        console.log('getAllDriversRequestError:', err);
      },
    });
  }

  // 車輛
  vehiclesData: any;

  getAllVehiclesRequest() {
    this.carServ.getAllVehiclesRequest(1, 20).subscribe({
      next: res => {
        this.vehiclesData = res.body.vehicles.map((item: any) => ({
          name: item.name,
          id: item.id
        }));
        console.log('vehiclesData:', this.vehiclesData);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // order-list
  formName: any
  shipList: any[] = [];
  onClickTask(event: any) {
    console.log('CLickEvent:', event);
    this.formName = event.value[0].name;
    this.shipList = event.value[0].shipping_list;
    console.log('shipList:', this.shipList);
  }

  onReorderTask(event: any) {
    console.log('ReorderEvent:', event);
  }
}
