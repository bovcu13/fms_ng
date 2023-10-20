import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CarService } from "../../../../services/car.service";
import { ActivatedRoute, Router } from "@angular/router";
import { list } from "../../../../shared/data/dispatch";

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss']
})
export class DispatchComponent implements OnInit {
  list: any = list;
  formList: string[] = [];

  addDispatchWork_form: FormGroup;

  workData = [
    {
      id: 1,
      name: '1020出車',
      date: '2023-10-20',
      form: '運輸訂單02',
      driver: '李宜蓁'
    }
  ]

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.addDispatchWork_form = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      date: ['', Validators.required],
      form: [''],
      driver: [''],
      created_at: [''],
      created_by: [''],
      updated_at: [''],
      updated_by: [''],
    });
  }

  ngOnInit(): void {
    this.getFormListName();
    this.getAllDriversRequest();
  }

  getFormListName() {
    list.forEach(item => {
      this.formList.push(item.name);
    });
    console.log(this.formList);
  }

  driverData: any
  // 取得車牌
  getAllDriversRequest() {
    this.carServ.getAllDriversRequest().subscribe({
      next: res => {
        this.driverData = res.body.drivers.map((item:any) => ({
          name: item.name
        }));
        console.log(this.driverData);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  newDispatchVisible = false;

  openNewDispatch() {
    this.newDispatchVisible = true;
  }

}
