import { Component, OnInit } from '@angular/core';
import { accident } from "../../../shared/data/accident";
import { claim } from "../../../shared/data/claim";

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {
  accident = accident;
  claim = claim;

  getSeverity(level: string): string {
    if (level === '輕微') {
      return 'info';
    } else if (level === '重大') {
      return 'danger';
    } else {
      return '';
    }
  }

  constructor() { }

  ngOnInit(): void {
  }
}
