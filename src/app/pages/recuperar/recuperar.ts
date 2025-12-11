import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-recuperar',
  imports: [FormsModule, CommonModule],
  templateUrl: './recuperar.html',
  styleUrl: './recuperar.css',
})
export class Recuperar {
  email = '';
  mensajeExito = '';
  error = '';

  router = inject(Router)
  authService = inject(AuthService)

  recuperar(): void {
    this.mensajeExito = '';
    this.error = '';

    if (!this.email) {
      this.error = 'Email es requerido';
      return;
    }

    if (!this.validarEmail(this.email)) {
      this.error = 'Email inválido';
      return;
    }

    if (this.authService.existeEmail(this.email)) {
      this.mensajeExito = 'Se ha enviado un correo con las instrucciones para recuperar tu contraseña';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
    } else {
      this.error = 'Email no encontrado en el sistema';
    }
  }

  validarEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
