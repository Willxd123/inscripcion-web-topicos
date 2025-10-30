import { AuthService } from './../../auth/services/auth.service';
import { environment } from './../../environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Materia } from './materia.interface';

@Injectable({
  providedIn: 'root'
})
export class MateriasService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private baseUrl = environment.apiUrl;
  
  obtenerMaterias(): Observable<Materia[]> {
    const estudianteId = this.authService.getUsuarioId();

    if (!estudianteId) {
      throw new Error('No se pudo obtener el ID del estudiante');
    }
    
    return this.http.get<any>(`${this.baseUrl}/usuarios/estudiantes/${estudianteId}/materias-disponibles`).pipe(
      map(response => {
        // La API devuelve un objeto con materias_disponibles
        if (response.materias_disponibles && Array.isArray(response.materias_disponibles)) {
          return response.materias_disponibles.map((m: any) => this.transformarMateria(m));
        }
        return [];
      })
    );
  }

  obtenerMateriaPorId(id: number): Observable<Materia> {
    return this.http.get<any>(`${this.baseUrl}/materia/${id}`).pipe(
      map(m => this.transformarMateria(m))
    );
  }

  private transformarMateria(data: any): Materia {
    return {
      id: data.id,
      sigla: data.sigla,
      nombre: data.nombre,
      creditos: data.creditos,
      nivelId: data.nivelId || data.nivel_id,
      tipoId: data.tipoId || data.tipo_id,
      createdAt: data.createdAt || data.created_at || null,
      updatedAt: data.updatedAt || data.updated_at || null,
      nivel: {
        id: 0, // ID dummy
        nombre: typeof data.nivel === 'string' ? data.nivel : (data.nivel?.nombre || '1'),
        createdAt: '',
        updatedAt: ''
      },
      tipo: {
        id: 0, // ID dummy
        nombre: typeof data.tipo === 'string' ? data.tipo : (data.tipo?.nombre || 'Normal'),
        createdAt: '',
        updatedAt: ''
      }
    };
  }
}