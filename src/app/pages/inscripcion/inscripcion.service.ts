import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InscripcionRequest, InscripcionResponse, EstadoInscripcion } from './inscripcion.interface';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://127.0.0.1:80/api/inscripciones';

  crearInscripcion(datos: InscripcionRequest): Observable<InscripcionResponse> {
    return this.http.post<InscripcionResponse>(`${this.API_URL}/inscripciones`, datos);
  }

  consultarEstado(transactionId: string): Observable<EstadoInscripcion> {
    return this.http.get<EstadoInscripcion>(`${this.API_URL}/estado/${transactionId}`);
  }
}