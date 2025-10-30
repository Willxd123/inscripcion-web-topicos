import { Materia } from './../../materias/materia.interface';
import { Grupo } from './../../grupos/grupo.interface';
import { MateriasService } from './../../materias/materias.service';
import { GruposService } from './../../grupos/grupos.service';
import { environment } from './../../../environment';
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InscripcionService } from '../inscripcion.service';
import { forkJoin, map, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // <-- 1. IMPORTA HttpClient

@Component({
  selector: 'app-estado-inscripcion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estado-inscripcion.component.html',
})
export class EstadoInscripcionComponent implements OnInit {
  private readonly inscripcionService = inject(InscripcionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly gruposService = inject(GruposService);
  private readonly materiasService = inject(MateriasService);
  private readonly http = inject(HttpClient); // <-- 2. INYECTA HttpClient

  transactionId = signal<string>('');
  estado = signal<'procesando' | 'procesado' | 'rechazado' | 'error' | null>(null);
  tipoError = signal<'sin_cupos' | 'choque_horario' | 'otro' | null>(null);
  mensaje = signal<string>('');
  detalleInscripcion = signal<any>(null);
  errorMensaje = signal<string>('');
  detalleEnriquecido = signal<{grupo: Grupo, materia: Materia}[]>([]);

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (!uuid) {
      this.router.navigate(['/materias']);
      return;
    }
    this.transactionId.set(uuid);
    this.consultarEstado();
  }

  consultarEstado(): void {
    this.inscripcionService.consultarEstado(this.transactionId()).subscribe({
      next: (response) => this.procesarRespuesta(response),
      error: (err) => {
        console.error('Error consultando estado:', err);
        this.estado.set('error');
        this.errorMensaje.set('Error al consultar el estado de la inscripción');
      },
    });
  }

  private obtenerNombreGrupo(grupoId: number): void {
    // Esta función auxiliar también la corregimos para usar las URLs correctas
    const grupoUrl = `${environment.apiUrl}/inscripciones/grupos/${grupoId}`;
    this.http.get<any>(grupoUrl).subscribe({
      next: (grupo) => {
        const materiaUrl = `${environment.apiUrl}/materias/materia/${grupo.materia_id}`;
        this.http.get<Materia>(materiaUrl).subscribe({
          next: (materia) => {
            const mensajeActual = this.errorMensaje();
            const mensajeActualizado = mensajeActual.replace(
              `ID ${grupoId}`,
              ` Sigla ${grupo.sigla} - ${materia.nombre}`
            );
            this.errorMensaje.set(mensajeActualizado);
          }
        });
      }
    });
  }


  procesarRespuesta(response: any): void {
    console.log('Respuesta recibida:', response);

    if ('status' in response && response.status === 'procesando') {
      this.estado.set('procesando');
      this.mensaje.set(response.message);
      return;
    }

    if ('Solicitud' in response) {
      const solicitud = response.Solicitud;

      if (solicitud.estado === 'procesando') {
        this.estado.set('procesando');
        this.mensaje.set('Tu inscripción está siendo procesada...');
      } else if (solicitud.estado === 'procesado') {
        if (solicitud.datos.success === false) {
          this.estado.set('rechazado');
          const mensaje = solicitud.datos.message;
          this.errorMensaje.set(mensaje);

          if (mensaje.includes('choque') || mensaje.includes('horario')) {
            this.tipoError.set('choque_horario');
          } else if (mensaje.includes('cupo') || mensaje.includes('ID')) {
            this.tipoError.set('sin_cupos');
            const match = mensaje.match(/ID (\d+)/);
            if (match) {
              const grupoId = parseInt(match[1]);
              this.obtenerNombreGrupo(grupoId);
            }
          } else {
            this.tipoError.set('otro');
          }
        } else if (solicitud.datos.success === true || solicitud.datos.data?.id) {
          this.estado.set('procesado');
          this.mensaje.set('¡Inscripción confirmada exitosamente!');
          const detalle = solicitud.datos.data || solicitud.datos;
          this.detalleInscripcion.set(detalle);

          // --- INICIO: LÓGICA CORREGIDA PARA ENRIQUECER DETALLES ---
          if (detalle && detalle.detalle && detalle.detalle.length > 0) {
            const observables = detalle.detalle.map((item: any) => {
              // 1. Usamos http.get con la URL correcta para el grupo
              const grupoUrl = `${environment.apiUrl}/inscripciones/grupos/${item.grupo_id}`;
              return this.http.get<any>(grupoUrl).pipe(
                switchMap(grupo => {
                  // 2. Usamos la propiedad `materia_id` y la URL correcta para la materia
                  const materiaUrl = `${environment.apiUrl}/materias/materia/${grupo.materia_id}`;
                  return this.http.get<Materia>(materiaUrl).pipe(
                    map(materia => ({ grupo, materia }))
                  );
                })
              );
            });

            forkJoin(observables).subscribe({
              next: (resultados) => {
                this.detalleEnriquecido.set(resultados as {grupo: Grupo, materia: Materia}[]);
              },
              error: (err) => {
                console.error('Error al enriquecer los detalles de la inscripción:', err);
              }
            });
          }
          // --- FIN: LÓGICA CORREGIDA ---

        } else {
          this.estado.set('error');
          this.errorMensaje.set('Respuesta inesperada del servidor');
        }
      } else if (solicitud.estado === 'error') {
        this.estado.set('error');
        this.errorMensaje.set(solicitud.error || 'Hubo un error al procesar tu inscripción');
      }
    }
  }

  recargarEstado(): void {
    this.consultarEstado();
  }

  volverAInicio(): void {
    localStorage.removeItem('materiasSeleccionadas');
    localStorage.removeItem('gruposSeleccionados');
    this.router.navigate(['/materias']);
  }

  intentarNuevamente(): void {
    localStorage.removeItem('gruposSeleccionados');
    this.router.navigate(['/grupos']);
  }
}