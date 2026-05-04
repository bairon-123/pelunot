import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MascotaService } from '../../services/mascota.service';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
// 1. CAMBIAMOS LA IMPORTACIÓN A LA LIBRERÍA MODERNA
import { QRCodeComponent } from 'angularx-qrcode';


@Component({
  selector: 'app-perfil',
  standalone: true,
  // 2. USAMOS QRCodeModule AQUÍ
  imports: [CommonModule, FormsModule, QRCodeComponent], 
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class PerfilComponent implements OnInit {
  private mascotaService = inject(MascotaService);
  private auth = inject(Auth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  usuario: any = {
    nombre: '',
    correo: '',
    telefono: '',
    direccion: '',
    comuna: ''
  };

  mascotas: any[] = [];
  editando: boolean = false;
  cargando: boolean = true;

  // --- TUS VARIABLES SE MANTIEENEN ---
  mostrarModalQR: boolean = false;
  qrValue: string = '';
  mascotaNombreQR: string = '';

  ngOnInit() {
    authState(this.auth).subscribe(currentUser => {
      if (currentUser) {
        this.usuario.correo = currentUser.email;
        
        this.mascotaService.getPerfilUsuario().subscribe({
          next: (data) => {
            if (data) {
              this.usuario = { ...this.usuario, ...data };
              this.editando = false;
            } else {
              this.editando = true;
            }
            this.cargando = false;
            this.cdr.detectChanges(); 
          },
          error: (err) => console.error('Error al cargar perfil:', err)
        });

        this.mascotaService.getMascotasUsuario().subscribe({
          next: (res) => {
            this.mascotas = res;
            this.cdr.detectChanges(); 
          },
          error: (err) => console.error('Error al cargar mascotas:', err)
        });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  toggleEdicion() {
    this.editando = !this.editando;
    this.cdr.detectChanges();
  }

  async guardarCambios() {
    try {
      this.cargando = true;
      await this.mascotaService.actualizarPerfil(this.usuario);
      this.editando = false;
      this.cargando = false;
      alert('Perfil actualizado con éxito ✅');
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Hubo un error al guardar los datos.');
      this.cargando = false;
    }
  }

  generarQR(mascota: any) {
    const baseUrl = window.location.origin; 
    this.qrValue = `${baseUrl}/publico/mascota/${mascota.id}`;
    this.mascotaNombreQR = mascota.nombre;
    
    this.mostrarModalQR = true;
    this.cdr.detectChanges();
  }

  cerrarModal() {
    this.mostrarModalQR = false;
    this.cdr.detectChanges();
  }

  async logout() {
    try {
      await signOut(this.auth);
      localStorage.removeItem('user_session'); 
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  }
}