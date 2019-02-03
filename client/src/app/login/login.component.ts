import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClrForm } from '@clr/angular';

const UIFields = {
  username: 'username',
  password: 'password',
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  @ViewChild(ClrForm) clrForm;

  public errMsg: string;
  public loginForm: FormGroup;
  public readonly UIFields = UIFields;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      [UIFields.username]: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(24),
      ]],
      [UIFields.password]: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(24),
      ]],
    });
  }

  submit() {  
    if (this.loginForm.invalid) {
      this.clrForm.markAsDirty();
    } else {
      console.log(this.loginForm.value);
    }
  }
}
