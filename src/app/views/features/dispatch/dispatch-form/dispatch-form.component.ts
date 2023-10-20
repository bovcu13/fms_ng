import { Component } from '@angular/core';
import { list } from "../../../../shared/data/dispatch";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-dispatch-form',
  templateUrl: './dispatch-form.component.html',
  styleUrls: ['./dispatch-form.component.scss']
})
export class DispatchFormComponent {
  list: any = list[0].trips;
  dispatch_form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.dispatch_form = this.fb.group({
      created_at: ['2023-10-18', Validators.required], //填單日
      id: ['236-M3', Validators.required], //單號
      name: ['', Validators.required], //派工名稱
      date: [''], //承運日期
      shipper: ['', Validators.required], //託運人
      pallet: [''], //板台號碼
      product_name: ['', Validators.required], //品名
      unit_price: [''], //單價
      quantity: [''], //件數
      tonnage:  [''], //噸數
      origin:  ['', Validators.required], //起運
      destination: ['', Validators.required], //卸貨
    });
  }

  data: any
  add() {
    //Check whether the required fields in the form are filled out
    if (this.dispatch_form.valid) {
      //Add the form data to the list
      this.data.push(this.dispatch_form.value);
      console.log(this.data);
      //Reset the form
      this.dispatch_form.reset();
    } else {
      alert("請填寫必填欄位");
    }
  }

}
