import {Component, OnInit} from '@angular/core';
import {CarService} from "../../../services/car.service";

@Component({
  selector: 'app-premium',
  templateUrl: './premium.component.html',
  styleUrls: ['./premium.component.scss']
})
export class PremiumComponent implements OnInit {
  constructor(private carServ: CarService) {
  }

  ngOnInit() {

  }

  pay() {
    this.postPayment(1, '測試')
  }

  postPayment(amount: number, description: string) {
    let body = {
      amount: amount,
      description: description
    }
    this.carServ.postPayment(body).subscribe({
      next: res => {
        console.log(res)
        console.log(body)
        this.postNewebPay(res.body)
      },
      error: err => {
        console.log(err)
      }
    })
  }

  postNewebPay(arr: any) {
    this.carServ.postNewebPay(arr).subscribe({
      next: res => {
        console.log(res)
      },
      error: err => {
        console.log(err)
      }
    })
  }
}
