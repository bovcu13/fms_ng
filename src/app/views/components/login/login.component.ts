import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from "../../../services/auth.service";
import {MessageService} from 'primeng/api';
import {ReCaptchaV3Service} from 'ng-recaptcha';
import {environment} from "../../../../environments/environment";
import {CarService} from "../../../services/car.service";
import {TokenStorageService} from "../../../services/token-storage.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService, ReCaptchaV3Service]
})
export class LoginComponent implements OnInit {

  login_form: FormGroup;
  siteKey = environment.recaptcha.siteKey
  captchaResponse = '';
  roles!: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private carServ: CarService,
    private tokenStorage: TokenStorageService
  ) {
    this.login_form = this.fb.group({
      fleet_code: ['A12345', [Validators.required]],
      user_name: ['admin', [Validators.required]],
      password: ['12345', [Validators.required]],
      recaptcha: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  showSuccess() {
    this.messageService.add({severity: 'success', summary: '歡迎', detail: '成功登入！'});
  }

  showError() {
    this.messageService.add({severity: 'error', summary: '失敗', detail: '車隊ID或帳號密碼錯誤！'});
  }

  login(): void {
    let body = {
      fleet_code: this.login_form.get('fleet_code')?.value,
      user_name: this.login_form.get('user_name')?.value,
      password: this.login_form.get('password')?.value
    }
    this.authService.login(body).subscribe({
      next: data => {
        console.log(data)
        this.tokenStorage.saveToken(data.body.access_token);
        this.tokenStorage.saveRefreshToken(data.body.refresh_token);
        this.tokenStorage.saveUser(data.body.role);
        this.roles = this.tokenStorage.getUser();
        if (this.roles === "admin") {
          this.router.navigate(['/main']);
          this.showSuccess();
        } else {
          this.router.navigate(['/main']);
          this.showSuccess();
        }
      },
      error: err => {
        // 帳密錯誤
        this.showError();
      }
    });
  }


}
