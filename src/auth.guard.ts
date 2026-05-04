import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  // 1. SIEMPRE PERMITIR RUTAS PÚBLICAS (Para el QR)
  if (state.url.includes('/publico/')) {
    return true;
  }

  // 2. VERIFICAR CON FIREBASE
  // Usamos authState para saber si hay un usuario logueado en Firebase
  return authState(auth).pipe(
    take(1), // Nos aseguramos de tomar solo el primer valor y cerrar la suscripción
    map(user => {
      if (user) {
        // Si hay usuario, permitimos el paso
        return true;
      } else {
        // Si no hay usuario, mandamos al login
        console.warn('Guard: Usuario no autenticado en Firebase. Redirigiendo...');
        router.navigate(['/login']);
        return false;
      }
    })
  );
};