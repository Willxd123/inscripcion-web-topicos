import { MateriasService } from './../../materias/materias.service';
import { GruposService } from './../../grupos/grupos.service';
import { environment } from './../../../environment';
import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InscripcionService } from '../inscripcion.service';
import { EstadoRespuesta, EstadoProcesamdo } from '../inscripcion.interface';

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
  
  transactionId = signal<string>('');
  estado = signal<'procesando' | 'procesado' | 'rechazado' | 'error' | null>(null);
  tipoError = signal<'sin_cupos' | 'choque_horario' | 'otro' | null>(null);
  mensaje = signal<string>('');
  detalleInscripcion = signal<any>(null);
  errorMensaje = signal<string>('');

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
    this.gruposService.obtenerGrupoPorId(grupoId).subscribe({
      next: (grupo) => {
        this.materiasService.obtenerMateriaPorId(grupo.materiaId).subscribe({
          next: (materia) => {
            const mensajeActual = this.errorMensaje();
            const mensajeActualizado = mensajeActual.replace(
              `ID ${grupoId}`,
              ` Sigla ${grupo.sigla} - ${materia.nombre}`
            );
            this.errorMensaje.set(mensajeActualizado);
          },
          error: () => {
            const mensajeActual = this.errorMensaje();
            const mensajeActualizado = mensajeActual.replace(
              `ID ${grupoId}`,
              `Grupo ${grupo.sigla}`
            );
            this.errorMensaje.set(mensajeActualizado);
          },
        });
      },
      error: () => {
        // Mantener mensaje original si falla
      },
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
      } 
      else if (solicitud.estado === 'procesado') {
        if (solicitud.datos.success === false) {
          this.estado.set('rechazado');
          const mensaje = solicitud.datos.message;
          
          // Detectar tipo de error específico
          if (mensaje.includes('choque') || mensaje.includes('horario')) {
            this.tipoError.set('choque_horario');
            this.errorMensaje.set(mensaje);
          } 
          else if (mensaje.includes('cupo') || mensaje.includes('ID')) {
            this.tipoError.set('sin_cupos');
            this.errorMensaje.set(mensaje);
            
            // Obtener nombre del grupo si es error de cupos
            const match = mensaje.match(/ID (\d+)/);
            if (match) {
              const grupoId = parseInt(match[1]);
              this.obtenerNombreGrupo(grupoId);
            }
          }
          else {
            this.tipoError.set('otro');
            this.errorMensaje.set(mensaje);
          }
        } 
        else if (solicitud.datos.success === true || solicitud.datos.data?.id) {
          this.estado.set('procesado');
          this.mensaje.set('¡Inscripción confirmada exitosamente!');
          this.detalleInscripcion.set(solicitud.datos.data || solicitud.datos);
        } 
        else {
          this.estado.set('error');
          this.errorMensaje.set('Respuesta inesperada del servidor');
        }
      } 
      else if (solicitud.estado === 'error') {
        this.estado.set('error');
        this.errorMensaje.set(solicitud.error || 'Hubo un error al procesar tu inscripción');
      }
    }
  }
  /* procesarRespuesta(response: any): void {
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
          this.errorMensaje.set(solicitud.datos.message);

          const match = solicitud.datos.message.match(/ID (\d+)/);
          if (match) {
            const grupoId = parseInt(match[1]);
            this.obtenerNombreGrupo(grupoId);
          }
        } else if (solicitud.datos && solicitud.datos.id) {
          this.estado.set('procesado');
          this.mensaje.set('¡Inscripción confirmada exitosamente!');
          this.detalleInscripcion.set(solicitud.datos);
        } else {
          this.estado.set('error');
          this.errorMensaje.set('Respuesta inesperada del servidor');
        }
      } else if (solicitud.estado === 'error') {
        this.estado.set('error');
        this.errorMensaje.set(
          solicitud.error || 'Hubo un error al procesar tu inscripción'
        );
      } else if (solicitud.estado === 'rechazado') {
        this.estado.set('rechazado');
        this.errorMensaje.set(
          solicitud.error || 'No hay cupos disponibles en uno o más grupos'
        );
      }
    }
  } */

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