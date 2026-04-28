import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { ExcelService } from '../../../services/excel.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss'
})
export class ReportesComponent {
  private firestore = inject(Firestore);
  private excelService = inject(ExcelService);

  async descargarReporteUsuarios() {
    try {
      const snap = await getDocs(collection(this.firestore, 'usuarios'));
      const dataParaExcel = snap.docs.map(doc => {
        const u = doc.data();
        return {
          'ID USUARIO': doc.id,
          'NOMBRE': u['nombre'] || 'Sin nombre',
          'EMAIL': u['email'] || 'Sin email',
          'ROL': u['rol'] || 'user',
          'FECHA DE CREACIÓN': u['createdAt'] ? new Date(u['createdAt']).toLocaleDateString() : 'N/A'
        };
      });

      this.excelService.exportToExcel(dataParaExcel, 'Reporte_Usuarios_Pelunot', 'Lista_Usuarios');
    } catch (error) {
      console.error("Error generando excel:", error);
      alert("No se pudo generar el reporte.");
    }
  }

  async descargarReporteVacunas() {
    try {
      const snap = await getDocs(collection(this.firestore, 'vacunas'));
      const dataParaExcel = snap.docs.map(doc => {
        const v = doc.data();
        return {
          'MASCOTA': v['nombreMascota'] || 'Desconocido',
          'VACUNA APLICADA': v['tipoVacuna'],
          'FECHA': v['fecha'],
          'ESTADO': v['estado'] || 'Pendiente',
          'VETERINARIO': v['veterinario'] || 'Sistema'
        };
      });

      this.excelService.exportToExcel(dataParaExcel, 'Control_Vacunas_Pelunot', 'Calendario_Vacunas');
    } catch (error) {
      console.error("Error generando excel:", error);
      alert("No hay datos de vacunas para exportar.");
    }
  }
}