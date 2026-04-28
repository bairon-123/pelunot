import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss'
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

cerrarSesion() {
  if(confirm('¿Estás seguro que deseas salir?')) {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
}