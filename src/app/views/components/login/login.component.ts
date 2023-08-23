import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from "../../../services/auth.service";
import {MessageService} from 'primeng/api';
import {ReCaptchaV3Service} from 'ng-recaptcha';
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService, ReCaptchaV3Service]
})
export class LoginComponent implements OnInit {

  login_form: FormGroup;
  siteKey = environment.recaptcha.siteKey
  captchaResponse = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {
    this.login_form = this.fb.group({
      company: ['A12345', [Validators.required]],
      account: ['admin', [Validators.required]],
      password: ['12345', [Validators.required]],
      recaptcha: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  showSuccess() {
    this.messageService.add({severity: 'success', summary: '歡迎', detail: '成功登入!'});
  }

  login(): void {
    let company = this.login_form.get('company')?.value
    let account = this.login_form.get('account')?.value
    let password = this.login_form.get('password')?.value
    if (this.authService.login(company, account, password)) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser.role === 'admin') {
        this.router.navigate(['/role']);
        this.showSuccess();
      } else {
        this.router.navigate(['/main']);
        this.showSuccess();
      }
    } else {

    }
  }
}
