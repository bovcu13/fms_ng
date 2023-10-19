import { Component } from '@angular/core';
import { list } from "../../../../shared/data/dispatch";

@Component({
  selector: 'app-dispatch-form',
  templateUrl: './dispatch-form.component.html',
  styleUrls: ['./dispatch-form.component.scss']
})
export class DispatchFormComponent {
list: any = list[0].trips;
}
