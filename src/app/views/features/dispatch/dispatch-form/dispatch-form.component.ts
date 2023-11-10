import { Component, OnInit } from '@angular/core';
import { list } from "../../../../shared/data/dispatch";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-dispatch-form',
  templateUrl: './dispatch-form.component.html',
  styleUrls: ['./dispatch-form.component.scss']
})
export class DispatchFormComponent implements OnInit {
  code: any = 0;
  list: any = list[this.code].shipping_list;
  dispatch_form: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.code = this.route.snapshot.paramMap.get('id');
    this.dispatch_form = this.fb.group({
      id: ['236-M3', Validators.required], //單號
      name: ['', Validators.required], //名稱
      deadline: [''], //指定送達時間
      shipper: ['', Validators.required], //託運人
      origin:  ['', Validators.required], //起運
      destination: ['', Validators.required], //卸貨
      product_name: ['', Validators.required], //品名
      unit_price: [''], //單價
      qty: ['', Validators.required], //件數
      tonnage:  ['', Validators.required], //噸數
      trailer: [''], //板車
      created_at: ['2023-10-18', Validators.required], //填單日
    });
    this.dispatch_form.patchValue(list[this.code]);
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

  title: any;
  formName() {
    if (this.dispatch_form.controls['name'].value) {
     this.title = this.dispatch_form.controls['name'].value;
    } else {
      this.title = "新增託運訂單";
    }
  }

  ngOnInit(): void {
    console.log(list[this.code])
    this.formName();
  }

}
