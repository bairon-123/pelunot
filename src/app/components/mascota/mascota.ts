import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MascotaService } from '../../services/mascota.service';

@Component({
  selector: 'app-mascotas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mascotas.component.html',
  styleUrl: './mascotas.component.scss'
})
export class MascotasComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private mascotaService = inject(MascotaService);

  pet: any = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mascotaService.getMascotaById(id).then(doc => {
        if (doc.exists()) this.pet = doc.data();
      });
    }
  }
}