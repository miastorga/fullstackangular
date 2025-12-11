import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Registro } from './registro';

describe('Registro', () => {
  let component: Registro;
  let fixture: ComponentFixture<Registro>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['registrar', 'existeEmail']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Registro, FormsModule, CommonModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Registro);
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

  it('debería validar contraseña correcta', () => {
    const errores = component.validarPassword('Test1234!');
    expect(errores.length).toBe(0);
  });

  it('debería rechazar contraseña corta', () => {
    const errores = component.validarPassword('Test1!');
    expect(errores).toContain('Mínimo 8 caracteres');
  });

  it('debería registrar usuario exitosamente', () => {
    mockAuthService.existeEmail.and.returnValue(false);
    mockAuthService.registrar.and.returnValue(true);
    spyOn(window, 'alert');

    component.nombre = 'Juan';
    component.email = 'juan@test.com';
    component.password = 'Test1234!';
    component.telefono = '123456789';
    component.cedula = '12345678';

    component.registrar();

    expect(mockAuthService.registrar).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería mostrar errores en campos vacíos', () => {
    component.registrar();

    expect(component.errores.nombre).toBeDefined();
    expect(component.errores.email).toBeDefined();
    expect(component.errores.password).toBeDefined();
  });

  it('debería detectar email duplicado', () => {
    mockAuthService.existeEmail.and.returnValue(true);

    component.nombre = 'Juan';
    component.email = 'juan@test.com';
    component.password = 'Test1234!';
    component.telefono = '123456789';
    component.cedula = '12345678';

    component.registrar();

    expect(component.errores.email).toBe('Email ya registrado');
  });
});
