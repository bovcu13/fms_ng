import {Component, OnInit} from '@angular/core';
import {CarService} from "../../../../services/car.service";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  companiesData: any;

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.companiesData = [
      {
        id: 1,
        name: '公司 1',
        address: '台北市中山區'
      }
    ]
  }

  addCompanyVisible = false;

  openAddCompany() {
    this.addCompanyVisible = true;
  }

  addCustomerVisible = false;

  openAddCustomer() {
    this.addCustomerVisible = true;
  }

  goToCompany(id: any) {
    this.router.navigate(['/company', id])
  }

}
