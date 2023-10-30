import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PaymentService } from "../../../services/payment.service";

@Component({
  selector: 'app-premium',
  templateUrl: './premium.component.html',
  styleUrls: ['./premium.component.scss']
})
export class PremiumComponent implements OnInit {

  email = ""
  payurl = ""
  MerchantID = ""
  TradeInfo = ""
  TradeSha = ""
  Version = ""

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

  }

//  pay() {
//    this.postPayment(1, '測試')
//  }

  triggerButton2(button2: HTMLButtonElement) {
    button2.click();
  }

  postPayment(email: string, amount: number, description: string) {
    let body = {
      emailL: email,
      amount: amount,
      description: description
    }
    console.log(body)
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
        setTimeout(() => {
          this.triggerButton2(document.getElementById('button2') as HTMLButtonElement);
        }, 500);
      },
      error: err => {
        console.log(err)
      }
    })
  }

  postRedirect() {
    this.payServ.postRedirect().subscribe({
      next: res => {
        console.log(res)
      },
      error: err => {
        console.log(err)
      }
    })
  }
}
