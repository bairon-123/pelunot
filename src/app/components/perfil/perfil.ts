import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MascotaService } from '../../services/mascota.service';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class PerfilComponent implements OnInit {
  private mascotaService = inject(MascotaService);
  private auth = inject(Auth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

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
    console.log('Generando QR para:', mascota.nombre);

    const infoMascota = `Mascota: ${mascota.nombre}\nDueño: ${this.usuario.nombre}\nContacto: ${this.usuario.telefono}`;
    
    alert(`CÓDIGO DE IDENTIFICACIÓN GENERADO\n\n${infoMascota}\n\nEste código permitirá que otros escaneen a ${mascota.nombre} si se extravía.`);
  }

  async logout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
      try {
        await signOut(this.auth);
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Error logout:', error);
      }
    }
  }
}


