import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotaService } from '../../services/mascota.service';
import { Auth, authState } from '@angular/fire/auth';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss'
})
export class InicioComponent implements OnInit {
  private mascotaService = inject(MascotaService);
  private auth = inject(Auth);
  private cdr = inject(ChangeDetectorRef);

  mascotas: any[] = [];
  loading: boolean = true;

  // Variables para el Modal de Detalle
  mascotaSeleccionada: any = null;
  fotosGaleriaMascota: any[] = [];
  mostrarSelectorFotos: boolean = false;

  ngOnInit() {
    authState(this.auth).subscribe(user => {
      if (user) {
        this.mascotaService.getMascotasUsuario().subscribe(res => {
          this.mascotas = res;
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  abrirDetalle(mascota: any) {
    this.mascotaSeleccionada = mascota;
    // Cargamos las fotos de la galería filtradas por esta mascota
    this.mascotaService.getFotosGaleria(mascota.id).subscribe(fotos => {
      this.fotosGaleriaMascota = fotos;
      this.cdr.detectChanges();
    });
  }

  cerrarModal() {
    this.mascotaSeleccionada = null;
    this.mostrarSelectorFotos = false;
  }

async cambiarFotoPerfil(nuevaUrl: string) {
  try {
    // 1. Guardar en Firebase
    await this.mascotaService.actualizarMascota(this.mascotaSeleccionada.id, {
      fotoUrl: nuevaUrl
    });
    
    this.mascotaSeleccionada.fotoUrl = nuevaUrl;

    const index = this.mascotas.findIndex(m => m.id === this.mascotaSeleccionada.id);
    if (index !== -1) {
      this.mascotas[index].fotoUrl = nuevaUrl;
    }
    this.mostrarSelectorFotos = false;
    this.cdr.detectChanges(); 
    
    alert('¡Foto actualizada!');
  } catch (error) {
    console.error('Error al actualizar:', error);
    alert('No se pudo actualizar la imagen.');
  }
}
}
