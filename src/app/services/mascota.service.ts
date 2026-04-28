import { Injectable, inject, NgZone } from '@angular/core';
import { 
  Firestore, 
  collection, 
  query, 
  where, 
  doc, 
  onSnapshot,
  setDoc,
  addDoc,
  getDoc,
  deleteDoc,
  updateDoc
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private zone = inject(NgZone);

  async actualizarMascota(idMascota: string, nuevosDatos: any) {
    try {
      const mascotaDocRef = doc(this.firestore, 'mascotas', idMascota);
      return await updateDoc(mascotaDocRef, nuevosDatos);
    } catch (error) {
      console.error("Error al actualizar la mascota en Firestore:", error);
      throw error;
    }
  }
  
  // 1. PERFIL DE USUARIO

  getPerfilUsuario(): Observable<any> {
    return new Observable(observer => {
      const user = this.auth.currentUser;
      if (!user) {
        observer.next(null);
        return;
      }

      const userRef = doc(this.firestore, 'usuarios', user.uid);
      const unsub = onSnapshot(userRef, (snap) => {
        this.zone.run(() => {
          observer.next(snap.exists() ? snap.data() : null);
        });
      }, err => observer.error(err));

      return () => unsub();
    });
  }

  async actualizarPerfil(usuario: any) {
    const user = this.auth.currentUser;
    if (!user) throw new Error("No hay usuario autenticado");
    const userRef = doc(this.firestore, 'usuarios', user.uid);
    return setDoc(userRef, usuario, { merge: true });
  }

  // 2. GESTIÓN DE MASCOTAS
  getMascotasUsuario(): Observable<any[]> {
    return new Observable(observer => {
      const user = this.auth.currentUser;
      if (!user) {
        observer.next([]);
        return;
      }

      const mascotasRef = collection(this.firestore, 'mascotas');
      const q = query(mascotasRef, where('duenoId', '==', user.uid));

      const unsub = onSnapshot(q, (snap) => {
        const pets = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        this.zone.run(() => {
          observer.next(pets);
        });
      }, err => observer.error(err));

      return () => unsub();
    });
  }

  async agregarMascota(datos: any) {
    const user = this.auth.currentUser;
    if (!user) throw new Error("Sesión no iniciada");

    const payload = {
      ...datos,
      duenoId: user.uid,
      fechaCreacion: new Date()
    };

    return addDoc(collection(this.firestore, 'mascotas'), payload);
  }

  async getMascotaById(id: string) {
    const petRef = doc(this.firestore, 'mascotas', id);
    return getDoc(petRef);
  }

  async eliminarMascota(idMascota: string) {
    const mascotaDocRef = doc(this.firestore, 'mascotas', idMascota);
    return deleteDoc(mascotaDocRef);
  }

  // 3. VACUNAS

  getVacunasUsuario(): Observable<any[]> {
    return new Observable(observer => {
      const user = this.auth.currentUser;
      if (!user) {
        observer.next([]);
        return;
      }

      const q = query(
        collection(this.firestore, 'vacunas'), 
        where('duenoId', '==', user.uid)
      );

      const unsub = onSnapshot(q, (snap) => {
        const vacunas = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        this.zone.run(() => {
          observer.next(vacunas);
        });
      }, err => observer.error(err));

      return () => unsub();
    });
  }

  async agregarVacuna(nuevaVacuna: any) {
    const user = this.auth.currentUser;
    if (!user) throw new Error("No autenticado");
    const payload = {
      ...nuevaVacuna,
      duenoId: user.uid,
      fechaRegistro: new Date()
    };
    return addDoc(collection(this.firestore, 'vacunas'), payload);
  }

  // 4. GALERÍA DE FOTOS
getFotosGaleria(mascotaId?: string): Observable<any[]> {
  return new Observable(observer => {
    const user = this.auth.currentUser;
    if (!user) {
      observer.next([]);
      return;
    }

    const galeriaRef = collection(this.firestore, 'galeria');

    let q = query(
      galeriaRef,
      where('duenoId', '==', user.uid)
    );

    if (mascotaId) {
      q = query(
        galeriaRef,
        where('duenoId', '==', user.uid),
        where('mascotaId', '==', mascotaId)
      );
    }

    const unsub = onSnapshot(q, (snap) => {
      const fotos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      this.zone.run(() => {
        observer.next(fotos);
      });
    }, err => observer.error(err));

    return () => unsub();
  });
}

  async guardarFotoGaleria(mascotaId: string, url: string) {
    const user = this.auth.currentUser;
    const fotoData = {
      mascotaId,
      duenoId: user?.uid,
      url,
      fecha: new Date()
    };
    return addDoc(collection(this.firestore, 'galeria'), fotoData);
  }
}



