import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Login} from '../login/login'

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Login, FormsModule, CommonModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería validar email correcto', () => {
    expect(component.validarEmail('test@example.com')).toBe(true);
  });

  it('debería rechazar email inválido', () => {
    expect(component.validarEmail('test@')).toBe(false);
  });

  it('debería mostrar error si email está vacío', () => {
    component.email = '';
    component.password = 'Test1234!';
    component.login();

    expect(component.errores.email).toBe('Email es requerido');
  });

  it('debería mostrar error si email es inválido', () => {
    component.email = 'emailinvalido';
    component.password = 'Test1234!';
    component.login();

    expect(component.errores.email).toBe('Email inválido');
  });

  it('debería mostrar error si contraseña está vacía', () => {
    component.email = 'test@test.com';
    component.password = '';
    component.login();

    expect(component.errores.password).toBe('Contraseña es requerida');
  });

  it('debería navegar a dashboard con credenciales correctas', () => {
    const mockUsuario = { id: 1, email: 'test@test.com', nombre: 'Test', password: '', telefono: '', cedula: '' };
    mockAuthService.login.and.returnValue(mockUsuario);

    component.email = 'test@test.com';
    component.password = 'Test1234!';

    component.login();

    expect(mockAuthService.login).toHaveBeenCalledWith('test@test.com', 'Test1234!');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('debería mostrar error con credenciales incorrectas', () => {
    mockAuthService.login.and.returnValue(null);

    component.email = 'test@test.com';
    component.password = 'wrongpass';
    component.login();

    expect(component.errores.general).toBe('Credenciales incorrectas');
  });

  it('debería alternar visibilidad de contraseña', () => {
    expect(component.mostrarPassword).toBe(false);

    component.togglePassword();
    expect(component.mostrarPassword).toBe(true);

    component.togglePassword();
    expect(component.mostrarPassword).toBe(false);
  });

  it('debería limpiar errores al hacer login', () => {
    component.errores = { email: 'error anterior' };

    component.email = 'test@test.com';
    component.password = 'Test1234!';
    component.login();

    expect(component.errores.email).toBeUndefined();
  });
});
