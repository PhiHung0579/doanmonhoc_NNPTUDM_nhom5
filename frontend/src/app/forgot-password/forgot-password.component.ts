import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalConstants } from '../shared/global-contsants';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: any = FormGroup;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]]
    })
  }

  handleSubmit() {
    this.ngxService.start();
    var formData = this.forgotPasswordForm.value;
    var data = {
      email: formData.data
    }
    this.userService.forgotPassword(data).subscribe((respone: any) => {
      this.ngxService.stop();
      this.responseMessage = respone?.messages;
      this.dialogRef.close();
      this.snackbarService.openSnackBar(this.responseMessage, "");
    }, (error) => {
      this.ngxService.stop();
      if (error.error?.messages) {
        this.responseMessage = error.error?.messages;
      }
      this.responseMessage = GlobalConstants.genericError;
    })
    this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
  }

}
