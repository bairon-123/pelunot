import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MascotaService } from '../../services/mascota.service';

@Component({
  selector: 'app-agregar-mascota',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agregar-mascota.html',
  styleUrl: './agregar-mascota.scss'
})
export class AgregarMascotaComponent {
  private mascotaService = inject(MascotaService);
  private router = inject(Router);

  // Objeto con la estructura completa para Firebase
  mascota = {
    // Identificación
    nombre: '',
    especie: 'Perro',
    raza: '',
    sexo: 'Macho',
    edad: '',
    pelaje: '',
    senas: '',
    // Comportamiento
    alimentacion: '',
    energia: 'Medio',
    sociabilidad: '',
    // Salud
    peso: '',
    ultimaDespar: '',
    vacunas: '',
    salud: '',
    microchip: '',
    clinica: '',
    fotoUrl: 'assets/image/pelunot_foto.jpg'
  };

  async guardarMascota() {
    if (!this.mascota.nombre.trim()) {
      alert('El nombre de la mascota es obligatorio.');
      return;
    }

    try {
      await this.mascotaService.agregarMascota(this.mascota);
      alert('¡' + this.mascota.nombre + ' se ha unido a Pelunot! 🐾');
      this.router.navigate(['/home/inicio']);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Hubo un error al conectar con Firebase.');
    }
  }

  cancelar() {
    this.router.navigate(['/home/inicio']);
  }
}