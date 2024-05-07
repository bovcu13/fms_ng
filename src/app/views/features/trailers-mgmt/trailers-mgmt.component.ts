import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CarService } from "../../../services/car.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { trailers } from "../../../shared/data/trailers";

@Component({
  selector: 'app-trailers-mgmt',
  templateUrl: './trailers-mgmt.component.html',
  styleUrls: ['./trailers-mgmt.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class TrailersMgmtComponent {
  addTrailers_form: FormGroup;

  trailers: any = trailers;

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.addTrailers_form = this.fb.group({
      id: ['', Validators.required],
      code: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getAllTrailersRequest();
  }

  trailersData: any;

  // 取得板車
  getAllTrailersRequest() {
    this.carServ.getAllTrailersRequest().subscribe({
      next: res => {
        this.trailersData = res.body.trailers;
        console.log('trailersData', this.trailersData);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addTrailersDialogVisible = false;

  openAddTrailersDialog() {
    this.addTrailersDialogVisible = true;
  }

  closeAddTrailersDialog() {
    this.addTrailersDialogVisible = false;
    this.showCancel('新增');
    this.addTrailers_form.reset();
  }

  // 新增板車
  postTrailersRequest() {
    let body = {
      code: this.addTrailers_form.controls['code'].value
    }
    this.carServ.postTrailersRequest(body).subscribe({
      next: data => {
        this.showSussess('新增');
        this.addTrailersDialogVisible = false;
        this.addTrailers_form.reset();
        console.log(data);
        console.log(body);
        this.getAllTrailersRequest();
      },
      error: (err) => {
        this.showError('新增');
        console.log(err);
        console.log(body);
      },
    });
  }

  goToTrailers(id: any) {
    this.router.navigate(['/trailers', id])
  }

  // 操作結果提示
  showSussess(info = '修改') {
    this.messageService.add({ severity: 'success', summary: '完成', detail: `${info}成功！` });
  }

  showError(info = '修改') {
    this.messageService.add({ severity: 'error', summary: '錯誤', detail: `${info}失敗！` });
  }

  showCancel(info: string = '修改') {
    this.messageService.add({ severity: 'warn', summary: '取消', detail: `取消${info}！` });
  }

}
