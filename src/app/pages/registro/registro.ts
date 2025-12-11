import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  nombre = '';
  email = '';
  password = '';
  telefono = '';
  cedula = '';
  errores: any = {};

  router = inject(Router)
  authService = inject(AuthService)

  registrar(): void {
    this.errores = {};

    if (!this.nombre) this.errores.nombre = 'Nombre requerido';
    if (!this.cedula) this.errores.cedula = 'Cédula requerida';
    if (!this.telefono) this.errores.telefono = 'Teléfono requerido';

    if (!this.email) {
      this.errores.email = 'Email requerido';
    } else if (!this.validarEmail(this.email)) {
      this.errores.email = 'Email inválido';
    } else if (this.authService.existeEmail(this.email)) {
      this.errores.email = 'Email ya registrado';
    }

    if (!this.password) {
      this.errores.password = 'Contraseña requerida';
    } else {
      const passErrors = this.validarPassword(this.password);
      if (passErrors.length > 0) {
        this.errores.password = passErrors.join(', ');
      }
    }

    if (Object.keys(this.errores).length > 0) return;

    const exito = this.authService.registrar({
      id: Date.now(),
      nombre: this.nombre,
      email: this.email,
      password: this.password,
      telefono: this.telefono,
      cedula: this.cedula
    });

    if (exito) {
      alert('Usuario registrado exitosamente');
      this.router.navigate(['/login']);
    }
  }

  validarEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  validarPassword(password: string): string[] {
    const errores = [];
    if (password.length < 8) errores.push('Mínimo 8 caracteres');
    if (password.length > 20) errores.push('Máximo 20 caracteres');
    if (!/[0-9]/.test(password)) errores.push('Debe tener números');
    if (!/[!@#$%^&*]/.test(password)) errores.push('Caracter especial (!@#$%^&*)');
    return errores;
  }

  tieneNumero(pass: string): boolean {
    return /[0-9]/.test(pass);
  }

  tieneCaracterEspecial(pass: string): boolean {
    return /[!@#$%^&*]/.test(pass);
  }
}
