import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ClrFormsDeprecatedModule, ClrFormsModule } from '@clr/angular';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClrFormsDeprecatedModule,
    ClrFormsModule,
  ],
  declarations: [RegisterComponent],
  exports: [RegisterComponent],
})
export class RegisterModule { }
