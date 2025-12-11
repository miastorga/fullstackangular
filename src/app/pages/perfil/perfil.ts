import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  nombre = '';
  email = '';
  telefono = '';
  password = '';
  errores: any = {};

  router = inject(Router)
  authService = inject(AuthService)

  ngOnInit(): void {
    const usuario = this.authService.getUsuarioActual();
    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }
    this.nombre = usuario.nombre;
    this.email = usuario.email;
    this.telefono = usuario.telefono;
  }

  actualizar(): void {
    this.errores = {};

    if (!this.nombre) this.errores.nombre = 'Nombre requerido';
    if (!this.telefono) this.errores.telefono = 'Teléfono requerido';

    if (this.password) {
      const passErrors = this.validarPassword(this.password);
      if (passErrors.length > 0) {
        this.errores.password = passErrors.join(', ');
      }
    }

    if (Object.keys(this.errores).length > 0) return;

    const datos: any = {
      nombre: this.nombre,
      telefono: this.telefono
    };

    if (this.password) {
      datos.password = this.password;
    }

    this.authService.actualizarPerfil(datos);
    alert('Perfil actualizado correctamente');
    this.password = '';
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

  volver(): void {
    this.router.navigate(['/dashboard']);
  }
}
