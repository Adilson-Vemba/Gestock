import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DefaultLoginLayout } from '../../components/default-login-layout/default-login-layout';
import { PrimaryInput } from '../../components/primary-input/primary-input';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [DefaultLoginLayout, PrimaryInput, ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro.html'
})
export class Cadastro {

  cadastroForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmarSenha: new FormControl('', Validators.required)
  });


  constructor(
    private authService: AuthService,
    private router: Router,
    private notify: NotificationService
  ) { }

  submit() {
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      this.notify.warning('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const { confirmarSenha, nome, senha, email } = this.cadastroForm.value;
    
    if (senha !== confirmarSenha) {
      this.notify.error('As senhas não coincidem!');
      return;
    }
    
    const data = { name: nome, password: senha, email };

    this.authService.register(data)
      .subscribe({
        next: () => {
          this.notify.success('Conta criada com sucesso!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.notify.error(err.error?.error || 'Erro ao criar conta');
        }
      });
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }
}
