import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Grupo } from './grupo.interface';


@Injectable({
  providedIn: 'root'
})
export class GruposService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3001/api';

  obtenerTodosGrupos(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(`${this.API_URL}/grupo`);
  }

  obtenerGruposPorMateria(materiaId: number): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(`${this.API_URL}/grupo/materia/${materiaId}`);
  }

  obtenerGrupoPorId(id: number): Observable<Grupo> {
    return this.http.get<Grupo>(`${this.API_URL}/grupo/${id}`);
  }
}