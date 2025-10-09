import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { InscripcionService } from '../inscripcion.service';
import { EstadoRespuesta, EstadoProcesamdo } from '../inscripcion.interface';

@Component({
  selector: 'app-estado-inscripcion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estado-inscripcion.component.html',
})
export class EstadoInscripcionComponent implements OnInit, OnDestroy {
  private readonly inscripcionService = inject(InscripcionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  transactionId = signal<string>('');
  estado = signal<'procesando' | 'procesado' | 'error' | null>(null);
  mensaje = signal<string>('');
  detalleInscripcion = signal<any>(null);
  errorMensaje = signal<string>('');

  private pollingSubscription?: Subscription;
  private readonly POLLING_INTERVAL = 3000; // 3 segundos

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    
    if (!uuid) {
      this.router.navigate(['/materias']);
      return;
    }

    this.transactionId.set(uuid);
    this.iniciarPolling();
  }

  ngOnDestroy(): void {
    this.detenerPolling();
  }

  iniciarPolling(): void {
    // Primera consulta inmediata
    this.consultarEstado();

    // Polling cada 3 segundos
    this.pollingSubscription = interval(this.POLLING_INTERVAL)
      .pipe(
        switchMap(() => this.inscripcionService.consultarEstado(this.transactionId()))
      )
      .subscribe({
        next: (response) => this.procesarRespuesta(response),
        error: (err) => {
          console.error('Error en polling:', err);
          this.estado.set('error');
          this.errorMensaje.set('Error al consultar el estado de la inscripción');
        }
      });
  }

  consultarEstado(): void {
    this.inscripcionService.consultarEstado(this.transactionId()).subscribe({
      next: (response) => this.procesarRespuesta(response),
      error: (err) => {
        console.error('Error consultando estado:', err);
        this.estado.set('error');
        this.errorMensaje.set('Error al consultar el estado de la inscripción');
      }
    });
  }

  procesarRespuesta(response: any): void {
    console.log('Respuesta recibida:', response); // Para debug
    
    // Si la respuesta tiene 'status' es porque está procesando (primera vez)
    if ('status' in response && response.status === 'procesando') {
      this.estado.set('procesando');
      this.mensaje.set(response.message);
      return;
    }
  
    // Si tiene 'Solicitud' es la respuesta del estado
    if ('Solicitud' in response) {
      const solicitud = response.Solicitud;
  
      if (solicitud.estado === 'procesando') {
        this.estado.set('procesando');
        this.mensaje.set('Tu inscripción está siendo procesada...');
      } 
      else if (solicitud.estado === 'procesado') {
        this.estado.set('procesado');
        this.mensaje.set('¡Inscripción confirmada exitosamente!');
        this.detalleInscripcion.set(solicitud.datos);
        this.detenerPolling();
      } 
      else if (solicitud.estado === 'error') {
        this.estado.set('error');
        this.errorMensaje.set(solicitud.error || 'Hubo un error al procesar tu inscripción');
        this.detenerPolling();
      }
    }
  }
  detenerPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
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