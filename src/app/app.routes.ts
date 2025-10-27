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

export const routes: Routes = [
  // Ruta raíz - redirige al login
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },

  // Ruta de login (sin layout ni guard)
  {
    path: 'login',
    component: LoginComponent,
  },

  // Rutas protegidas con layout
  {
    path: '',
    component: LayoutsComponent,
    //canActivate: [AuthGuard], // Descomenta esto cuando tengas listo el AuthGuard
    children: [
      // Materias - página principal después del login
      {
        path: 'materias',
        component: MateriasComponent,
      },

      // Grupos
      {
        path: 'grupos',
        component: GruposComponent,
      },

      // Inscripción
      {
        path: 'inscripcion',
        component: InscripcionComponent,
      },

      // Estado de inscripción con parámetro UUID
      {
        path: 'inscripcion/estado/:uuid',
        component: EstadoInscripcionComponent,
      },

      // Perfil del usuario
      {
        path: 'perfil',
        component: PerfilComponent,
      },

      // Histórico académico
      {
        path: 'historico',
        component: HistoricoComponent,
      },

      // Ruta por defecto dentro del layout protegido
      {
        path: '',
        redirectTo: '/materias',
        pathMatch: 'full',
      },
    ],
  },

  // Ruta wildcard - cualquier ruta no encontrada va al login
  {
    path: '**',
    redirectTo: '/login',
  },
];