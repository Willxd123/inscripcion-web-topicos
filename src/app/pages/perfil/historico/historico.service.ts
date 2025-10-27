import { Historico } from './historico.interface';
import { Observable, throwError } from 'rxjs';
import { environment } from './../../../environment';
import { AuthService } from './../../../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private baseUrl = environment.apiUrl; // Asume que la API está en localhost:80 (Gateway)

  /**
   * Obtiene el historial académico del estudiante logueado
   */
  obtenerHistorial(): Observable<Historico[]> { // 2. Nombre y tipo de retorno corregidos
    const estudianteId = this.authService.getUsuarioId();
    
    if (!estudianteId) {
      // Devolver un Observable que falla
      return throwError(() => new Error('No se pudo obtener el ID del estudiante'));
    }

    // 3. URL Corregida: Asumo que tu gateway en :80 NO añade "/usuarios"
    // a la ruta de "grupos-estudiantes".
    return this.http.get<Historico[]>(`${this.baseUrl}/usuarios/grupos-estudiantes/estudiante/${estudianteId}`);
  }

}
