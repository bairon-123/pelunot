import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore, initializeFirestore, persistentLocalCache } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage'; 
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp((environment as any).firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => {
      const app = initializeApp((environment as any).firebase);
      return initializeFirestore(app, {
        localCache: persistentLocalCache({})
      });
    }),
    provideStorage(() => getStorage()) 
  ]
};