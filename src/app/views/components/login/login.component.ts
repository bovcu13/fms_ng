import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  login_form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.login_form = this.fb.group({
      company: ['', [Validators.required]],
      account: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
    let company = this.login_form.get('company')?.value
    let account = this.login_form.get('account')?.value
    let password = this.login_form.get('password')?.value
    if (this.authService.login(company, account, password)) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser.role === 'admin') {
        this.router.navigate(['/role']);
      } else {
        this.router.navigate(['/main']);
      }
    } else {

    }
  }
}
