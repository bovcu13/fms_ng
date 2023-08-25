import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContainerComponent} from './container.component';
import {RoleComponent} from '../features/role/role.component';
import {MainComponent} from "../features/main/main.component";
import {AuthGuard} from "../../shared/guard/auth.guard";
import {MonitorComponent} from "../features/monitor/monitor.component";
import {StreamComponent} from "../features/stream/stream.component";


const routes: Routes = [
  {path: '', redirectTo: '', pathMatch: 'full'},
  {
    path: '', component: ContainerComponent,
    children: [
      {path: 'main', component: MainComponent, canActivate: [AuthGuard]},
      {path: 'role', component: RoleComponent, canActivate: [AuthGuard]},
      {path: 'monitor', component: MonitorComponent, canActivate: [AuthGuard]},
      {path: 'test', component: StreamComponent, canActivate: [AuthGuard]},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainerRoutingModule {
}
