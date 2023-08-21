import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'src/app/shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ContainerComponent} from './container.component';
import {ContainerRoutingModule} from './container-routing.module';
import {RoleComponent} from '../features/role/role.component';
import {MainComponent} from '../features/main/main.component';

@NgModule({
  declarations: [
    ContainerComponent,
    RoleComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    ContainerRoutingModule,
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ContainerModule {
}
