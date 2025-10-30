import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Grupo } from './grupo.interface';
import { environment } from '../../environment';


@Injectable({
  providedIn: 'root'
})
export class GruposService {
  private readonly http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  obtenerTodosGrupos(): Observable<Grupo[]> {
    return this.http.get<any[]>(`${this.baseUrl}/grupos/grupo`).pipe(
      map(grupos => grupos.map(g => this.transformarGrupo(g)))
    );
  }

  obtenerGruposPorMateria(materiaId: number): Observable<Grupo[]> {
    return this.http.get<any[]>(`${this.baseUrl}/inscripciones/grupos/materia/${materiaId}`).pipe(
      map(grupos => grupos.map(g => this.transformarGrupo(g)))
    );
  }

  obtenerGrupoPorId(id: number): Observable<Grupo> {
    return this.http.get<any>(`${this.baseUrl}/grupos/grupo/${id}`).pipe(
      map(g => this.transformarGrupo(g))
    );
  }

  private transformarGrupo(data: any): Grupo {
    return {
      id: data.id,
      sigla: data.sigla,
      cupo: data.cupo,
      materiaId: data.materia_id,
      docenteId: data.docente_id,
      gestionId: data.gestion_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      docente: data.docente ? {
        id: data.docente.id,
        registro: data.docente.registro,
        nombre: data.docente.nombre,
        email: data.docente.email,
        telefono: data.docente.telefono
      } : undefined,
      horarios: data.horarios ? data.horarios.map((h: any) => ({
        id: h.id,
        dia: h.dia,
        horaInicio: h.hora_inicio,
        horaFin: h.hora_fin,
        grupoId: h.grupo_id,
        aulaId: h.aula_id,
        moduloId: h.modulo_id
      })) : undefined
    };
  }
}