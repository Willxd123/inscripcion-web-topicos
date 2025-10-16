import { environment } from './../../environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  InscripcionRequest,
  InscripcionResponse,
  EstadoInscripcion,
} from './inscripcion.interface';

@Injectable({
  providedIn: 'root',
})
export class InscripcionService {
  private readonly http = inject(HttpClient);

  private baseUrl = environment.apiUrl;
  crearInscripcion(datos: InscripcionRequest): Observable<InscripcionResponse> {
    return this.http.post<InscripcionResponse>(
      `${this.baseUrl}/inscripciones/inscripciones`,
      datos
    );
  }

  consultarEstado(transactionId: string): Observable<EstadoInscripcion> {
    return this.http.get<EstadoInscripcion>(
      `${this.baseUrl}/inscripciones/estado/${transactionId}`
    );
  }
}
