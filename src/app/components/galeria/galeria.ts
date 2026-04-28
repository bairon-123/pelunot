import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotaService } from '../../services/mascota.service';
import { Auth, authState } from '@angular/fire/auth';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Firestore, doc, deleteDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './galeria.html',
  styleUrl: './galeria.scss'
})
export class GaleriaComponent implements OnInit {
  private mascotaService = inject(MascotaService);
  private auth = inject(Auth);
  private storage = inject(Storage);
  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);

  fotos: any[] = [];
  mascotas: any[] = [];
  filtroMascotaId: string = ''; 
  cargando: boolean = true;
  subiendo: boolean = false;


  fotoSeleccionada: any = null;

  ngOnInit() {
    authState(this.auth).subscribe(user => {
      if (user) {
        this.mascotaService.getMascotasUsuario().subscribe(res => {
          this.mascotas = res;
          this.cdr.detectChanges();
        });
        this.cargarFotos('');
      }
    });
  }

  cargarFotos(mascotaId: string) {
    this.filtroMascotaId = mascotaId;
    this.cargando = true;
    this.mascotaService.getFotosGaleria(mascotaId).subscribe(res => {
      this.fotos = res;
      this.cargando = false;
      this.cdr.detectChanges();
    });
  }


  async eliminarFoto() {
    if (!this.fotoSeleccionada) return;
    
    const confirmar = confirm('¿Estás seguro de eliminar esta foto?');
    if (!confirmar) return;

    try {
      this.cargando = true;
      

      const docRef = doc(this.firestore, `galeria/${this.fotoSeleccionada.id}`);
      await deleteDoc(docRef);

      try {
        const storageRef = ref(this.storage, this.fotoSeleccionada.url);
        await deleteObject(storageRef);
      } catch (e) {
        console.log('El archivo físico ya no existe o no se pudo borrar, procediendo...');
      }

      this.cerrarVisor();
      alert('Foto eliminada correctamente.');
      this.cargarFotos(this.filtroMascotaId);
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('No se pudo eliminar la foto.');
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }


  abrirVisor(foto: any) {
    this.fotoSeleccionada = foto;
    this.cdr.detectChanges();
  }

  cerrarVisor() {
    this.fotoSeleccionada = null;
    this.cdr.detectChanges();
  }

 async subirImagen(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  if (this.fotos.length >= 10) {
    alert('Máximo 10 fotos');
    return;
  }

  if (!this.filtroMascotaId) {
    alert('Selecciona una mascota');
    return;
  }

  const user = this.auth.currentUser;
  if (!user) {
    alert('No autenticado');
    return;
  }

  try {
    this.subiendo = true;

    const filePath = `galeria/${user.uid}/${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, filePath);

    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);

    await this.mascotaService.guardarFotoGaleria(this.filtroMascotaId, url);

    this.subiendo = false;

    event.target.value = null;

  } catch (error) {
    console.error(error);
    this.subiendo = false;
    alert('Error al subir imagen');
  }
}
}
