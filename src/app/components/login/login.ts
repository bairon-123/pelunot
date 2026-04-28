import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  nombre: string = '';
  email: string = '';
  password: string = '';


async login() {
  if (this.nombre.trim() && this.email.trim() && this.password.trim()) {
    try {

      const resultado = await this.authService.loginConValidacionNombre(this.email, this.password, this.nombre);
            const rol = resultado.rol;

      console.log('Usuario autenticado con rol:', rol);
      if (rol === 'superadmin' || rol === 'admin') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/home/inicio']);
      }

    } catch (error: any) {
      console.error('Error login:', error);
      alert(error.message || 'Error al iniciar sesión. Revisa tus datos.');
    }
  } else {
    alert('Debes ingresar Nombre, Email y Contraseña para entrar.');
  }
}

  async registrarse() {
    if (this.nombre.trim() && this.email.trim() && this.password.trim()) {
      try {
        await this.authService.register(this.email, this.password, this.nombre);
        alert('¡Cuenta Pelunot creada con éxito!');
        this.router.navigate(['/home/inicio']);
      } catch (error: any) {
        console.error('Error registro:', error);
        if (error.code === 'auth/email-already-in-use') {
          alert('Este correo ya está registrado.');
        } else {
          alert('Error al registrar: ' + error.message);
        }
      }
    } else {
      alert('Completa todos los campos para crear tu cuenta.');
    }
  }

  recuperarClave() {
    if (this.email) {
      alert('Instrucciones enviadas a ' + this.email);
    } else {
      alert('Ingresa tu email primero.');
    }
  }
}