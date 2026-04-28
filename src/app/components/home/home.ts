import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; 
import { MascotaService } from '../../services/mascota.service';
import { Auth, authState, signOut } from '@angular/fire/auth'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  private mascotaService = inject(MascotaService);
  private auth = inject(Auth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  nombreUsuario: string = 'Cargando...';
  inicial: string = '?';

  ngOnInit() {
    authState(this.auth).subscribe(user => {
      if (user) {
        this.mascotaService.getPerfilUsuario().subscribe(data => {
          if (data) {
            this.nombreUsuario = data.nombre || 'Usuario';
            this.inicial = this.nombreUsuario.charAt(0).toUpperCase();
          }
          this.cdr.detectChanges();
        });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }


  async logout() {
    try {
      await signOut(this.auth);
      console.log('Sesión cerrada');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  }
}