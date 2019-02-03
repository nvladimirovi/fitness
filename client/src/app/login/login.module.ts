import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { ClrFormsDeprecatedModule, ClrFormsModule, ClrCommonFormsModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClrFormsDeprecatedModule,
    ClrFormsModule,
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent]
})
export class LoginModule { }
