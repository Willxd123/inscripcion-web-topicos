import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InscripcionService } from './inscripcion.service';
import { GrupoSeleccionado, InscripcionRequest } from './inscripcion.interface';

@Component({
  selector: 'app-inscripcion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inscripcion.component.html',
})
export class InscripcionComponent implements OnInit {
  private readonly inscripcionService = inject(InscripcionService);
  private readonly router = inject(Router);

  gruposSeleccionados = signal<GrupoSeleccionado[]>([]);
  procesando = signal<boolean>(false);
  error = signal<string | null>(null);

  // Simulación de estudiante logueado (ID 1, Gestión 2)
  readonly ESTUDIANTE_ID = 1;
  readonly GESTION_ID = 2;
  readonly anioActual = new Date().getFullYear();

  ngOnInit(): void {
    this.cargarGruposSeleccionados();
  }

  cargarGruposSeleccionados(): void {
    const gruposJson = localStorage.getItem('gruposSeleccionados');
    
    if (!gruposJson) {
      this.router.navigate(['/materias']);
      return;
    }

    const grupos: GrupoSeleccionado[] = JSON.parse(gruposJson);
    
    if (grupos.length === 0) {
      this.router.navigate(['/materias']);
      return;
    }

    this.gruposSeleccionados.set(grupos);
  }

  volverAGrupos(): void {
    this.router.navigate(['/grupos']);
  }

  confirmarInscripcion(): void {
    if (this.procesando()) return;

    this.procesando.set(true);
    this.error.set(null);

    // Fecha en formato YYYY-MM-DD
    const fechaActual = `${this.anioActual}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

    const inscripcionData: InscripcionRequest = {
      estudiante_id: this.ESTUDIANTE_ID,
      gestion_id: this.GESTION_ID,
      fecha: fechaActual,
      grupos: this.gruposSeleccionados().map(g => g.grupoId)
    };

    console.log('Body enviado:', inscripcionData); // Para debug

    this.inscripcionService.crearInscripcion(inscripcionData).subscribe({
      next: (response) => {
        this.procesando.set(false);
        console.log('Respuesta:', response); // Para debug
        this.router.navigate(['/inscripcion/estado', response.transaction_id]);
      },
      error: (err) => {
        this.procesando.set(false);
        this.error.set(err.error?.message || 'Error al procesar la inscripción');
        console.error('Error en inscripción:', err);
      }
    });
  }
}