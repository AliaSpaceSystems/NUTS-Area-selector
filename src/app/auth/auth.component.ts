import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {MatDrawer} from "@angular/material/sidenav";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  public form: FormGroup;
  public hidePassword = true;
  public authFailed = false;

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl(null, {
        updateOn: 'change', validators: [Validators.required]
      }),
      password: new FormControl(null, {
        updateOn: 'change', validators: [Validators.required]
      })
    });
  }

  onSendLogin(): void {
    this.authService.requestAccessToken(this.form.get('username').value, this.form.get('password').value).subscribe(
      (isAuth: boolean) => {
      console.log('User authenticated: ', isAuth);

      if (!isAuth) {
        this.authFailed = true;
        return;
      }
      this.router.navigateByUrl(this.authService.redirectUrl).then(
        () => console.log(`User redirected to ${this.authService.redirectUrl}`)
      );
      }
    );
  }
}
