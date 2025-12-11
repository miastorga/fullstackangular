import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  mostrarPassword = false;
  errores: any = {};

  router = inject(Router)
  authService = inject(AuthService)

  login(): void {
    this.errores = {};

    if (!this.email) {
      this.errores.email = 'Email es requerido';
      return;
    }
    if (!this.validarEmail(this.email)) {
      this.errores.email = 'Email inválido';
      return;
    }
    if (!this.password) {
      this.errores.password = 'Contraseña es requerida';
      return;
    }

    const usuario = this.authService.login(this.email, this.password);
    if (usuario) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errores.general = 'Credenciales incorrectas';
    }
  }

  validarEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }
}
