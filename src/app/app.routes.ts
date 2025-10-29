import { DashComponent } from './pages/dash/dash.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { LayoutsComponent } from './layouts/layouts.component';
import { MateriasComponent } from './pages/materias/materias.component';
import { GruposComponent } from './pages/grupos/grupos.component';
import { InscripcionComponent } from './pages/inscripcion/inscripcion.component';
import { EstadoInscripcionComponent } from './pages/inscripcion/estado/estado-inscripcion.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { HistoricoComponent } from './pages/perfil/historico/historico.component';
import { LoginGuard } from './auth/guards/login.guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dash', 
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard] 
    },
  {
    path: '',
    component: LayoutsComponent,
    canActivate: [AuthGuard], 
    children: [
      {
        path: 'dash',
        component: DashComponent,
      },
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
      {
        path: 'perfil',
        component: PerfilComponent,
      },
      {
        path: 'historico',
        component: HistoricoComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];