import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { HomeComponent } from './components/home/home';
import { InicioComponent } from './components/inicio/inicio';
import { VacunasComponent } from './components/vacunas/vacunas';
import { GaleriaComponent } from './components/galeria/galeria';
import { PerfilComponent } from './components/perfil/perfil';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'home', 
    component: HomeComponent,
    children: [
      { path: 'inicio', component: InicioComponent },
      { path: 'vacunas', component: VacunasComponent },
      { path: 'galeria', component: GaleriaComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: '', redirectTo: 'inicio', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];