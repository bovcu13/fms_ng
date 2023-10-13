import {Component, OnInit} from '@angular/core';
import {CarService} from "../../../../services/car.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  editCompany_form: FormGroup;
  companiesData = [
    {
      id: 1,
      name: '公司 1',
      address: '台北市中山區'
    }
  ]
  warehousesData = [
    {
      id: 1,
      name: 'A 倉庫',
      manager: 'A 管理員',
      address: '台北市中山區'
    }
  ]

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editCompany_form = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      manager: ['', Validators.required],
      address: [''],
      created_at: [''],
      created_by: [''],
      updated_at: [''],
      updated_by: [''],
    });
  }

  ngOnInit(): void {
    this.editCompany_form.patchValue(this.companiesData[0])
  }

  goToWarehouse(id: any) {
    this.router.navigate(['/warehouse', id])
  }
}
