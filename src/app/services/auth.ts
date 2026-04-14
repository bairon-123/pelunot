import { inject, Injectable } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile 
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  setDoc 
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inyectamos las herramientas de Firebase
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  /**
   * Registra un usuario en Auth y guarda su nombre en Firestore
   */
  async register(email: string, pass: string, nombre: string) {
    try {
      // 1. Crea el usuario en Authentication
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, pass);
      const user = userCredential.user;

      // 2. Opcional: Actualiza el perfil de Auth con el nombre
      await updateProfile(user, { displayName: nombre });

      // 3. Guarda los datos en la colección "usuarios" de la base de datos
      const userDocRef = doc(this.firestore, `usuarios/${user.uid}`);
      await setDoc(userDocRef, {
        uid: user.uid,
        nombre: nombre,
        email: email,
        rol: 'user',
        createdAt: new Date()
      });

      return user;
    } catch (error) {
      console.error('Error en AuthService.register:', error);
      throw error;
    }
  }

  /**
   * Login simple
   */
  async login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  /**
   * Cerrar sesión
   */
  async logout() {
    return signOut(this.auth);
  }
}