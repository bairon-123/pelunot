import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { authGuard } from '../auth.guard'; 


// Componentes de Usuario (App Móvil)
import { InicioComponent } from './components/inicio/inicio';
import { AgregarMascotaComponent } from './components/agregar-mascota/agregar-mascota';
import { HomeComponent } from './components/home/home';
import { VacunasComponent } from './components/vacunas/vacunas';
import { GaleriaComponent } from './components/galeria/galeria';
import { PerfilComponent } from './components/perfil/perfil';



// Componentes de Administración (Panel Web)
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout';
import { DashboardComponent } from './components/admin/dashboard/dashboard';
import { UsuarioEditarComponent } from './components/admin/usuario-editar/usuario-editar';
import { UsuariosListaComponent } from './components/admin/usuarios-lista/usuarios-lista';
import { ReportesComponent  } from './components/admin/reportes/reportes';
import { VistaMascotaComponent } from './components/publico/vista-mascota/vista-mascota';




export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  
  // RUTA PÚBLICA (Sin authGuard)
  { path: 'publico/mascota/:id', component: VistaMascotaComponent },


  //RUTAS DE USUARIO 
{
  path: 'home',
  component: HomeComponent, 
  canActivate: [authGuard],
  children: [
    { path: 'inicio', component: InicioComponent },
    { path: 'vacunas', component: VacunasComponent },
    { path: 'galeria', component: GaleriaComponent },
    { path: 'perfil', component: PerfilComponent },
    { path: 'agregar-mascota', component: AgregarMascotaComponent },
    { path: '', redirectTo: 'inicio', pathMatch: 'full' }
  ]
},

  //RUTAS DE ADMINISTRADOR
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'usuarios', component: UsuariosListaComponent },
      { path: 'usuario-editar/:id', component: UsuarioEditarComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];