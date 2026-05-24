import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DefaultLoginLayout } from '../../components/default-login-layout/default-login-layout';
import { PrimaryInput } from '../../components/primary-input/primary-input';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [DefaultLoginLayout, ReactiveFormsModule, PrimaryInput, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private notify: NotificationService
  ) { }


  irParaCadastro() {
    this.router.navigate(['/cadastro']);
  }

  submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.notify.warning('Preencha as credenciais corretamente.');
      return;
    }

    this.authService.login(this.loginForm.value as any)
      .subscribe({
        next: () => {
          this.notify.success('Login efetuado com sucesso!');
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: () => {
          this.notify.error('Email ou senha inválidos');
        }
      });
  }
}
