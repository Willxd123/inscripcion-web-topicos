import { environment } from './../../environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '../../auth/services/auth.service';
import { Perfil } from './perfil.interfase';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  

private baseUrl = environment.apiUrl;
  /**
   * Obtiene el perfil del estudiante logueado
   */
  obtenerPerfilActual(): Observable<Perfil> {
    const estudianteId = this.authService.getUsuarioId();
    
    if (!estudianteId) {
      throw new Error('No se pudo obtener el ID del estudiante');
    }

    return this.http.get<Perfil>(`${this.baseUrl}/usuarios/estudiantes/${estudianteId}`);
  }
}