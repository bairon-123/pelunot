import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MascotaService } from '../../services/mascota.service';
import { Auth, authState } from '@angular/fire/auth';

@Component({
  selector: 'app-vacunas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vacunas.html',
  styleUrl: './vacunas.scss'
})
export class VacunasComponent implements OnInit {
  private mascotaService = inject(MascotaService);
  private auth = inject(Auth);
  private cdr = inject(ChangeDetectorRef);

  vacunas: any[] = [];
  mascotas: any[] = [];
  
  nuevaVacuna = {
    mascotaId: '',
    mascotaNombre: '', 
    nombre: '',
    fecha: '',
    clinica: '',
    estado: 'Completada'
  };

  ngOnInit() {
    authState(this.auth).subscribe(user => {
      if (user) {
        this.mascotaService.getMascotasUsuario().subscribe(res => {
          this.mascotas = res;
          this.cdr.detectChanges();
        });

        this.mascotaService.getVacunasUsuario().subscribe(res => {
          this.vacunas = res;
          this.cdr.detectChanges();
        });
      }
    });
  }

  async registrarVacuna() {
    if (!this.nuevaVacuna.mascotaId || !this.nuevaVacuna.nombre || !this.nuevaVacuna.fecha) {
      alert('Por favor, completa los datos principales.');
      return;
    }

    try {
      const mascotaSeleccionada = this.mascotas.find(m => m.id === this.nuevaVacuna.mascotaId);
      this.nuevaVacuna.mascotaNombre = mascotaSeleccionada ? mascotaSeleccionada.nombre : 'Mascota';

      await this.mascotaService.agregarVacuna(this.nuevaVacuna);
      
      this.nuevaVacuna = {
        mascotaId: '',
        mascotaNombre: '',
        nombre: '',
        fecha: '',
        clinica: '',
        estado: 'Completada'
      };
      
      this.cdr.detectChanges();
      alert('Vacuna registrada con éxito 🐾');
    } catch (error) {
      console.error(error);
      alert('Error al registrar la vacuna.');
    }
  }
}