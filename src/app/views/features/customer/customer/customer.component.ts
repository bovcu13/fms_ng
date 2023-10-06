import { Component } from '@angular/core';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent {

  addCompanyVisible = false;

  openAddCompany() {
    this.addCompanyVisible = true;
  }

  addCustomerVisible = false;

  openAddCustomer() {
    this.addCustomerVisible = true;
  }

}
