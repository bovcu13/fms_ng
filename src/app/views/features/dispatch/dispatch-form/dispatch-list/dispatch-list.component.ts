import { Component } from '@angular/core';
import { list } from "../../../../../shared/data/dispatch";

@Component({
  selector: 'app-dispatch-list',
  templateUrl: './dispatch-list.component.html',
  styleUrls: ['./dispatch-list.component.scss']
})
export class DispatchListComponent {
  list: any = list;
}
