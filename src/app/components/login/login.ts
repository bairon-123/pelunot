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
  // Inyección de servicios
  private authService = inject(AuthService);
  private router = inject(Router);

  // Variables vinculadas al HTML mediante [(ngModel)]
  nombre: string = '';
  email: string = '';
  password: string = '';

  /**
   * FUNCIÓN PARA ENTRAR (Usuarios ya registrados)
   * Solo valida email y contraseña
   */
  async login() {
    if (this.email.trim() && this.password.trim()) {
      try {
        await this.authService.login(this.email, this.password);
        console.log('Login exitoso');
        this.router.navigate(['/home/inicio']);
      } catch (error: any) {
        console.error('Error al iniciar sesión:', error);
        alert('Credenciales incorrectas. Verifica tu correo y contraseña.');
      }
    } else {
      alert('Por favor, ingresa tu email y contraseña para entrar.');
    }
  }

  /**
   * FUNCIÓN PARA CREAR CUENTA (Usuarios nuevos)
   * Valida Nombre, Email y Contraseña, y los guarda en Firestore
   */
  async registrarse() {
    if (this.nombre.trim() && this.email.trim() && this.password.trim()) {
      try {
        console.log('Creando cuenta para:', this.nombre);
        await this.authService.register(this.email, this.password, this.nombre);
        
        alert('¡Cuenta creada con éxito!');
        this.router.navigate(['/home/inicio']);
      } catch (error: any) {
        console.error('Error en el registro:', error);
        
        // Mensajes amigables para errores comunes de Firebase
        if (error.code === 'auth/email-already-in-use') {
          alert('Este correo ya está registrado. Intenta iniciar sesión.');
        } else if (error.code === 'auth/weak-password') {
          alert('La contraseña es muy débil. Usa al menos 6 caracteres.');
        } else {
          alert('Error al crear la cuenta: ' + error.message);
        }
      }
    } else {
      alert('Para registrarte necesito tu Nombre, Email y una Contraseña.');
    }
  }

  /**
   * Recuperación de contraseña
   */
  recuperarClave() {
    if (this.email) {
      alert('Se ha enviado un correo de recuperación a: ' + this.email);
    } else {
      alert('Ingresa tu correo en el campo de arriba para enviarte el enlace.');
    }
  }
}