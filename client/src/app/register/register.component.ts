import { Component, OnInit, ViewChild } from '@angular/core';
import { ClrForm } from '@clr/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

const UIFields = {
  username: 'username',
  password: 'password',
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  @ViewChild(ClrForm) clrForm;

  public errMsg: string;
  public registerForm: FormGroup;
  public readonly UIFields = UIFields;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
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
    if (this.registerForm.invalid) {
      this.clrForm.markAsDirty();
    } else {
      console.log(this.registerForm.value);
    }
  }
}
