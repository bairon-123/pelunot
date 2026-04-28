import { inject, Injectable } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  authState
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc,
  collection, 
  addDoc,      
  query,    
  where,        
  getDocs,
  deleteDoc,
  updateDoc
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  actualizarUsuario(userId: string, usuario: any) {
    throw new Error('Method not implemented.');
  }
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  user$ = authState(this.auth);

  // --- SECCIÓN DE AUTENTICACIÓN ---
  async register(email: string, pass: string, nombre: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, pass);
      const user = userCredential.user;
      
 
      const userDocRef = doc(this.firestore, `usuarios/${user.uid}`);
      await setDoc(userDocRef, {
        uid: user.uid,
        nombre: nombre,
        email: email,
        telefono: '',  
        direccion: '',  
        comuna: '',    
        rol: 'user', 
        createdAt: new Date()
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async loginConValidacionNombre(email: string, pass: string, nombreIngresado: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, pass);
      const user = userCredential.user;
      const datos = await this.getDatosUsuario(user.uid);
      
      if (datos && datos['nombre'].toLowerCase() === nombreIngresado.toLowerCase()) {
        return { user, rol: datos['rol'] };
      } else {
        await this.logout();
        throw new Error('El nombre no coincide con el registro.');
      }
    } catch (error) {
      throw error;
    }
  }

  async getDatosUsuario(uid: string) {
    const userDocRef = doc(this.firestore, `usuarios/${uid}`);
    const userSnap = await getDoc(userDocRef);
    return userSnap.exists() ? userSnap.data() : null;
  }

  async logout() {
    return signOut(this.auth);
  }


  async actualizarPerfil(uid: string, nuevosDatos: any) {
    try {
      const userDocRef = doc(this.firestore, 'usuarios', uid);
      return await updateDoc(userDocRef, nuevosDatos);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      throw error;
    }
  }

  async eliminarUsuario(uid: string) {
    try {
      const userDocRef = doc(this.firestore, 'usuarios', uid);
      await deleteDoc(userDocRef);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw error;
    }
  }

  // GESTIÓN DE MASCOTAS 
  async getMascotasPorDuenio(duenioUid: string) {
    try {
      const mascotasRef = collection(this.firestore, 'mascotas');
      const q = query(mascotasRef, where('duenoId', '==', duenioUid));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error al obtener mascotas:", error);
      throw error;
    }
  }

  async agregarMascota(datosMascota: any) {
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error("No autenticado");

      const mascotasRef = collection(this.firestore, 'mascotas');
      return await addDoc(mascotasRef, {
        ...datosMascota,
        duenoId: user.uid, 
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error al agregar mascota:', error);
      throw error;
    }
  }

  async actualizarMascota(idMascota: string, nuevosDatos: any) {
    try {
      const mascotaDocRef = doc(this.firestore, 'mascotas', idMascota);
      return await updateDoc(mascotaDocRef, nuevosDatos);
    } catch (error) {
      console.error("Error al actualizar mascota:", error);
      throw error;
    }
  }

  async eliminarMascota(idMascota: string) {
    try {
      const mascotaDocRef = doc(this.firestore, 'mascotas', idMascota);
      await deleteDoc(mascotaDocRef);
    } catch (error) {
      console.error("Error al eliminar mascota:", error);
      throw error;
    }
  }
}


