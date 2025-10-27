import { AuthService } from './../../auth/services/auth.service';
import { environment } from './../../environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Materia } from './materia.interface';

@Injectable({
  providedIn: 'root'
})
export class MateriasService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private baseUrl = environment.apiUrl;
  obtenerMaterias(): Observable<Materia[]> {

    const estudianteId = this.authService.getUsuarioId(); // Aquí deberías obtener el ID del estudiante logueado si es necesario

    if (!estudianteId) {
      throw new Error('No se pudo obtener el ID del estudiante');
    }
    return this.http.get<Materia[]>(`${this.baseUrl}/usuarios/estudiantes/${estudianteId}/materias-disponibles`);
  }

  obtenerMateriaPorId(id: number): Observable<Materia> {
    return this.http.get<Materia>(`${this.baseUrl}/materia/${id}`);
  }
}