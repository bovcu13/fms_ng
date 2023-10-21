import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PaymentService} from "../../../services/payment.service";

@Component({
  selector: 'app-premium',
  templateUrl: './premium.component.html',
  styleUrls: ['./premium.component.scss']
})
export class PremiumComponent implements OnInit {
  payurl=""
  MerchantID=""
  TradeInfo=""
  TradeSha=""
  Version=""

//  premium_form: FormGroup;
  constructor(
    private payServ: PaymentService,
    private fb: FormBuilder,
  ) {
//    this.premium_form = this.fb.group({
//      amount: [1, Validators.required],
//      description: ['測試', Validators.required],
//      email: ['']
//    })
    this.payurl = "https://ccore.newebpay.com/MPG/mpg_gateway"
  }

  ngOnInit() {
    this.postPayment(1, '測試')
  }

//  pay() {
//    this.postPayment(1, '測試')
//  }

  postPayment(amount: number, description: string) {
    let body = {
      amount: amount,
      description: description
    }
    this.payServ.postPayment(body).subscribe({
      next: res => {
        this.MerchantID = res.body.MerchantID
        this.TradeInfo = res.body.TradeInfo
        this.TradeSha = res.body.TradeSha
        this.Version = res.body.Version
//        console.log(res.body.MerchantID)
//        console.log(res)
//        console.log(body)
//        this.postRedirect(res.body)
      },
      error: err => {
        console.log(err)
      }
    })
  }
//
//  postRedirect(arr: any) {
//    this.payServ.postNewebPay(arr).subscribe({
//      next: res => {
//        console.log(res)
//      },
//      error: err => {
//        console.log(err)
//      }
//    })
//  }
}
