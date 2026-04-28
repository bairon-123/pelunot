import { Component, OnInit, inject, OnDestroy, ChangeDetectorRef } from '@angular/core'; // Añade ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { Firestore, collection, onSnapshot, query } from '@angular/fire/firestore';
import { Unsubscribe } from '@angular/fire/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef); 

  totalUsuarios: number = 0;
  totalMascotas: number = 0;
  vacunasPendientes: number = 0;

  private subs: Unsubscribe[] = [];

  ngOnInit() {
    this.cargarEstadisticas();
  }

  ngOnDestroy() {
    this.subs.forEach(unsub => unsub());
  }

  cargarEstadisticas() {
    //  Usuarios
    const qUsuarios = query(collection(this.firestore, 'usuarios'));
    const unsubUsers = onSnapshot(qUsuarios, (snap) => {
      this.totalUsuarios = snap.size;
      this.cdr.detectChanges(); 
    });

    //  Mascotas
    const qMascotas = query(collection(this.firestore, 'mascotas'));
    const unsubPets = onSnapshot(qMascotas, (snap) => {
      this.totalMascotas = snap.size;
      this.cdr.detectChanges(); 
    });

    //  Vacunas
    const qVacunas = query(collection(this.firestore, 'vacunas')); 
    const unsubVacunas = onSnapshot(qVacunas, (snap) => {
      this.vacunasPendientes = snap.size;
      this.cdr.detectChanges(); 
    });

    this.subs.push(unsubUsers, unsubPets, unsubVacunas);
  }
}