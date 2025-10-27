import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { HistoricoService } from './historico.service';
import { Historico } from './historico.interface';

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule], // Añadir CommonModule para usar @if, @for, etc.
  templateUrl: './historico.component.html',
})
export class HistoricoComponent implements OnInit {
  
  private historicoService = inject(HistoricoService);

  // Signals para manejar el estado del componente
  historial = signal<Historico[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.cargando.set(true);
    this.error.set(null);
    
    this.historicoService.obtenerHistorial().subscribe({
      next: (data) => {
        // TODO: Los datos de la API son incompletos (solo IDs).
        // Se necesita "enriquecerlos" llamando a las APIs de grupos y materias.
        this.historial.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error("Error al cargar historial:", err);
        this.error.set('No se pudo cargar el historial académico.');
        this.cargando.set(false);
      }
    });
  }

  // Función para determinar el estado de la materia
  obtenerEstado(nota: string | number | null): string {
    if (nota === null) {
      return 'Cursando';
    }
    return +nota >= 51 ? 'Aprobado' : 'Reprobado';
  }
}
