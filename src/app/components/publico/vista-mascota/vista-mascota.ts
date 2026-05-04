import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MascotaService } from '../../../services/mascota.service';

@Component({
  selector: 'app-vista-mascota',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vista-mascota.html',
  styleUrls: ['./vista-mascota.scss']
})
export class VistaMascotaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private mascotaService = inject(MascotaService);
  private cdr = inject(ChangeDetectorRef);

  mascota: any = null;
  dueno: any = null;
  vacunas: any[] = [];
  loading: boolean = true;

  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      if (id) {
        await this.cargarFichaCompleta(id);
      } else {
        this.loading = false;
      }
    });
  }

  async cargarFichaCompleta(id: string) {
    try {
      this.loading = true;
      const petSnap = await this.mascotaService.getMascotaById(id);

      if (petSnap.exists()) {
        this.mascota = petSnap.data();

        // Cargar dueño y vacunas en paralelo
        const [duenoSnap, listaVacunas] = await Promise.all([
          this.mascotaService.getPerfilPublico(this.mascota.duenoId),
          this.mascotaService.getVacunasByMascotaId(id)
        ]);

        if (duenoSnap.exists()) {
          this.dueno = duenoSnap.data();
        }
        this.vacunas = listaVacunas || [];
      }
    } catch (error) {
      console.error("Error al cargar la ficha:", error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}