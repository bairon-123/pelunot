import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { 
  Firestore, 
  collection, 
  query, 
  onSnapshot 
} from '@angular/fire/firestore';
import { Unsubscribe } from '@angular/fire/auth';

@Component({
  selector: 'app-usuarios-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './usuarios-lista.html',
  styleUrl: './usuarios-lista.scss'
})
export class UsuariosListaComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);

  usuarios: any[] = [];
  usuarioSeleccionado: any = null;
  mascotasDelUsuario: any[] = [];
  filtroBusqueda: string = '';
  
  private unsubscribeUsers?: Unsubscribe;

  ngOnInit() {
    this.escucharUsuarios();
  }

  ngOnDestroy() {
    if (this.unsubscribeUsers) {
      this.unsubscribeUsers();
    }
  }
  cargando: boolean = false;

// boton para sincronizar con la base de datos en tiempo real
refrescarDatos() {
  this.filtroBusqueda = '';

  if (this.unsubscribeUsers) {
    this.unsubscribeUsers();
  }
  this.escucharUsuarios();
  
  console.log('Base de datos sincronizada');
}

  escucharUsuarios() {
    const q = query(collection(this.firestore, 'usuarios'));
    
    this.unsubscribeUsers = onSnapshot(q, (snapshot) => {
      this.usuarios = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      }));
      console.log('Usuarios actualizados en tiempo real');
    }, (error) => {
      console.error("Error en tiempo real:", error);
    });
  }

  get usuariosFiltrados() {
    const busqueda = this.filtroBusqueda.toLowerCase().trim();
    if (!busqueda) return this.usuarios;
    return this.usuarios.filter(user => 
      user.nombre?.toLowerCase().includes(busqueda) || 
      user.email?.toLowerCase().includes(busqueda)
    );
  }

  async verDetalles(usuario: any) {
    this.usuarioSeleccionado = usuario;
    this.mascotasDelUsuario = await this.authService.getMascotasPorDuenio(usuario.uid);
  }

  async eliminarUsuario(uid: string) {
    if (confirm('¿Eliminar usuario?')) {
      await this.authService.eliminarUsuario(uid);
      this.usuarios = this.usuarios.filter(u => u.uid !== uid);
    }
  }

  async borrarMascotaAdmin(idMascota: string) {
    if (confirm('¿Eliminar mascota?')) {
      await this.authService.eliminarMascota(idMascota);
      this.mascotasDelUsuario = this.mascotasDelUsuario.filter(p => p.id !== idMascota);
    }
  }
}