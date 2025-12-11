import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Recuperar } from './recuperar';

describe('Recuperar', () => {
  let component: Recuperar;
  let fixture: ComponentFixture<Recuperar>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['existeEmail']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Recuperar, FormsModule, CommonModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Recuperar);
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
    component.recuperar();

    expect(component.error).toBe('Email es requerido');
  });

  it('debería mostrar error si email es inválido', () => {
    component.email = 'emailinvalido';
    component.recuperar();

    expect(component.error).toBe('Email inválido');
  });

  it('debería mostrar error si email no existe', () => {
    mockAuthService.existeEmail.and.returnValue(false);
    component.email = 'noexiste@test.com';

    component.recuperar();

    expect(component.error).toBe('Email no encontrado en el sistema');
  });

  it('debería mostrar mensaje de éxito si email existe', () => {
    mockAuthService.existeEmail.and.returnValue(true);
    component.email = 'existe@test.com';

    component.recuperar();

    expect(component.mensajeExito).toBe('Se ha enviado un correo con las instrucciones para recuperar tu contraseña');
  });

  it('debería navegar a login después de 3 segundos', fakeAsync(() => {
    mockAuthService.existeEmail.and.returnValue(true);
    component.email = 'existe@test.com';

    component.recuperar();
    tick(3000);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('debería limpiar mensajes al recuperar', () => {
    component.mensajeExito = 'mensaje anterior';
    component.error = 'error anterior';

    component.email = 'test@test.com';
    component.recuperar();

    expect(component.mensajeExito).toBe('');
  });
});
