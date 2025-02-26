import { Routes } from '@angular/router';
import { RegionsComponent } from './features/regions/regions.component';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { ForbiddenComponent } from './features/forbidden/forbidden.component';
import { Error404Component } from './features/error404/error404.component';
import { authGuard } from './core/guards/auth.guard';
<<<<<<< HEAD
=======
import { WeatherComponent } from './features/weather/weather.component';
>>>>>>> 3875b4f (weather)

export const routes: Routes = [
  {
    path: '', // Ruta inicial
    component: HomeComponent,
  },
  {
    path: 'login', // Página de inicio de sesión
    component: LoginComponent,
  },
  {
    path: 'regions', // Página protegida
    component: RegionsComponent,
    canActivate: [authGuard], 
  },
  {
    path: 'forbidden', // Página 403
    component: ForbiddenComponent,
  },
  {
    path: '**', // Ruta comodín para 404
    component: Error404Component,
  },
<<<<<<< HEAD
=======
  { path: 'weather',
    component: WeatherComponent 
  },

>>>>>>> 3875b4f (weather)
];
