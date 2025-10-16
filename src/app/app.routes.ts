import { GruposComponent } from './pages/grupos/grupos.component';
import { Routes } from '@angular/router';

import { LoginComponent } from './auth/components/login/login.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { LayoutsComponent } from './layouts/layouts.component';
import { MateriasComponent } from './pages/materias/materias.component';
import { InscripcionComponent } from './pages/inscripcion/inscripcion.component';
import { EstadoInscripcionComponent } from './pages/inscripcion/estado/estado-inscripcion.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutsComponent, // 👈 AQUÍ está la magia: usamos el layout
    //canActivate: [AuthGuard],
    
    children: [
      {
        path: 'materias',
        component: MateriasComponent,
      },
      {
        path: 'grupos',
        component: GruposComponent,
      },
      {
        path: 'inscripcion',
        component: InscripcionComponent,
      },
      {
        path: 'inscripcion/estado/:uuid',
        component: EstadoInscripcionComponent,
      },
      
      
    ],
  },
];
