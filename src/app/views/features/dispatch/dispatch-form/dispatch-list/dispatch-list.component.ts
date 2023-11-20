import { Component } from '@angular/core';
import { list } from "../../../../../shared/data/dispatch";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { DispatchService } from "../../../../../services/dispatch.service";

@Component({
  selector: 'app-dispatch-list',
  templateUrl: './dispatch-list.component.html',
  styleUrls: ['./dispatch-list.component.scss']
})
export class DispatchListComponent {
  list: any = list;

  constructor(
    private dispatchServ: DispatchService,
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.getAllTransportOrder();
  }

  // 取得表單
  formData: any;
  getAllTransportOrder() {
    this.dispatchServ.getAllTransportOrder().subscribe({
      next: res => {
        this.formData = res.body.transport_orders;
        console.log('formData:', this.formData)
      },
      error: (err) => {
        console.log('getAllTransportOrderError:', err);
      },
    });
  }

  goToForm(id: any) {
    this.router.navigate(['/dispatch_list', id])
  }

  selectedForm: any[] = [];
  handleCheckbox(event: any) {
    console.log('selectedForm:',this.selectedForm)
    console.log(event)
  }

  tagValue: any;
  getSeverity(level: string): string {
    if (level === undefined) {
      this.tagValue = '未綁定';
      return 'info';
    } else {
      return '';
    }
  }

}
