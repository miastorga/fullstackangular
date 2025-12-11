import { Injectable } from '@angular/core';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  cedula: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarios: Usuario[] = [];
  private usuarioActual: Usuario | null = null;

  registrar(usuario: Usuario): boolean {
    if (this.usuarios.find(u => u.email === usuario.email)) {
      return false;
    }
    this.usuarios.push(usuario);
    return true;
  }

  login(email: string, password: string): Usuario | null {
    const usuario = this.usuarios.find(u => u.email === email && u.password === password);
    if (usuario) {
      this.usuarioActual = usuario;
      return usuario;
    }
    return null;
  }

  logout(): void {
    this.usuarioActual = null;
  }

  getUsuarioActual(): Usuario | null {
    return this.usuarioActual;
  }

  actualizarPerfil(datos: Partial<Usuario>): void {
    if (this.usuarioActual) {
      const index = this.usuarios.findIndex(u => u.id === this.usuarioActual!.id);
      this.usuarios[index] = { ...this.usuarios[index], ...datos };
      this.usuarioActual = this.usuarios[index];
    }
  }

  existeEmail(email: string): boolean {
    return this.usuarios.some(u => u.email === email);
  }
}
