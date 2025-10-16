import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Grupo } from './grupo.interface';
import { environment } from '../../environment';


@Injectable({
  providedIn: 'root'
})
export class GruposService {
  private readonly http = inject(HttpClient);
  //private readonly API_URL = 'http://localhost:80/api/grupos';
  private baseUrl = environment.apiUrl;
  obtenerTodosGrupos(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(`${this.baseUrl}/grupos/grupo`);
  }

  obtenerGruposPorMateria(materiaId: number): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(`${this.baseUrl}/grupos/grupo/materia/${materiaId}`);
  }

  obtenerGrupoPorId(id: number): Observable<Grupo> {
    return this.http.get<Grupo>(`${this.baseUrl}/grupos/grupo/${id}`);
  }
}