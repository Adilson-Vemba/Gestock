import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DefaultLoginLayout } from '../../components/default-login-layout/default-login-layout';
import { PrimaryInput } from '../../components/primary-input/primary-input';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  imports: [DefaultLoginLayout, PrimaryInput, ReactiveFormsModule],
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
    private router: Router
  ) { }

  submit() {
    if (this.cadastroForm.invalid) return;

    const { confirmarSenha, nome, senha, email } = this.cadastroForm.value;
    const data = { name: nome, password: senha, email };

    this.authService.register(data)
      .subscribe({
        next: () => {
          alert('Conta criada com sucesso');
          this.router.navigate(['/login']);
        },
        error: () => {
          alert('Erro ao criar conta');
        }
      });
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }
}
