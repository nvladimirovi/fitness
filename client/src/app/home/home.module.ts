import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { LoginModule } from '../login/login.module';
import { RegisterModule } from '../register/register.module';
import { RestManager } from '../core/rest-manager/rest.manager';

@NgModule({
  imports: [
    CommonModule,
    LoginModule,
    RegisterModule,
  ],
  declarations: [HomeComponent],
  providers: [
    RestManager
  ]
})
export class HomeModule { }
