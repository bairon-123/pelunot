import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth'; // Asegúrate que la ruta sea correcta según tu carpeta

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  // Inyectamos las dependencias
  private authService = inject(AuthService);
  private router = inject(Router);

  // Variables para el formulario
  nombre: string = '';
  email: string = '';
  password: string = '';

  /**
   * Esta función se ejecuta al hacer clic en el botón "Entrar" o "Iniciar Sesión"
   * Realiza el registro y la creación del perfil en Firestore
   */
  async ingresar() {
    // Validamos que los campos no estén vacíos
    if (this.nombre.trim() && this.email.trim() && this.password.trim()) {
      try {
        console.log('Intentando registrar a:', this.nombre);
        
        // Llamamos al servicio para crear el usuario
        await this.authService.register(this.email, this.password, this.nombre);
        
        // Si todo sale bien, navegamos al Home
        console.log('Registro exitoso');
        this.router.navigate(['/home/inicio']);
        
      } catch (error: any) {
        // Manejo de errores básicos
        console.error('Error al iniciar sesión:', error);
        if (error.code === 'auth/email-already-in-use') {
          alert('Este correo ya está en uso. Intenta iniciar sesión.');
        } else {
          alert('Ocurrió un error: ' + error.message);
        }
      }
    } else {
      alert('Por favor, completa todos los campos (Nombre, Email y Contraseña)');
    }
  }

  // Función para recuperar contraseña (opcional por ahora)
  recuperarClave() {
    if (this.email) {
      alert('Se ha enviado un enlace de recuperación a: ' + this.email);
    } else {
      alert('Por favor, ingresa tu correo electrónico primero.');
    }
  }
}