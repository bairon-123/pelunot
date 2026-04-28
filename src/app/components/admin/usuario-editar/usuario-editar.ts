import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-usuario-editar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-editar.html',
  styleUrl: './usuario-editar.scss'
})
export class UsuarioEditarComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  usuario: any = { nombre: '', email: '', rol: '' };
  userId: string = '';

  async ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    if (this.userId) {
      const datos = await this.authService.getDatosUsuario(this.userId);
      if (datos) {
        this.usuario = datos;
      }
    }
  }

  async guardarCambios() {
    try {
      await this.authService.actualizarUsuario(this.userId, this.usuario);
      alert('Usuario actualizado con éxito');
      this.router.navigate(['/admin/usuarios']);
    } catch (error) {
      alert('Error al actualizar');
    }
  }
}