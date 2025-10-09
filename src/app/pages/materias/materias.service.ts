import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Materia } from './materia.interface';

@Injectable({
  providedIn: 'root'
})
export class MateriasService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/api';

  obtenerMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.API_URL}/materia`);
  }

  obtenerMateriaPorId(id: number): Observable<Materia> {
    return this.http.get<Materia>(`${this.API_URL}/materia/${id}`);
  }
}