import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { error_messages } from 'src/app/models/error_messages';
import { User } from 'src/app/models/user';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { CompareValidation } from 'src/app/models/validators';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { takeUntil } from 'rxjs/operators';
import { APIResp } from 'src/app/models/apiresp';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  changeFormGroup: FormGroup;
  error_messages = error_messages;
  user: User;
  hide = true;
  hiden = true;
  hidec = true;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private _formBuilder: FormBuilder, private commonService: CommonService, private router: Router, private title: Title) {
  }

  ngOnInit() {
    this.user = this.commonService.getUser();
    this.changeFormGroup = this._formBuilder.group({
      old_password: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', Validators.required],
    }, { validator: CompareValidation });

    this.title.setTitle("Change Password");
  }
  change_password() {
    this.commonService.password_change(this.f.value.password, this.f.value.old_password, this.user._id).pipe(takeUntil(this.destroy$)).subscribe((resp: APIResp) => {
      if (resp.ack) {
        this.commonService.showSnackBar('success', 'Change Password Successfully');
      } else {
        this.commonService.showSnackBar('error', resp.description);
      }
    });
  }
  get f() {
    return this.changeFormGroup;
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}