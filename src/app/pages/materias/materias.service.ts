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

  private baseUrl = environment.apiUrl;
  obtenerMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.baseUrl}/materias/materia`);
  }

  obtenerMateriaPorId(id: number): Observable<Materia> {
    return this.http.get<Materia>(`${this.baseUrl}/materias/materia/${id}`);
  }
}