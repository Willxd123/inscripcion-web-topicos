import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MateriasService } from './materias.service';
import { Materia } from './materia.interface';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './materias.component.html',
})
export class MateriasComponent implements OnInit {
  private readonly materiasService = inject(MateriasService);
  private readonly router = inject(Router);

  materias = signal<Materia[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);
  materiasSeleccionadas = signal<Materia[]>([]);

  nivelSeleccionado = signal<string>('all');
  tipoSeleccionado = signal<string>('all');
  terminoBusqueda = signal<string>('');

  // Computed signals para filtros
  niveles = computed(() => {
    const nivelesSet = new Set(this.materias().map(m => m.nivel.nombre));
    return Array.from(nivelesSet).sort();
  });

  tipos = computed(() => {
    const tiposSet = new Set(this.materias().map(m => m.tipo.nombre));
    return Array.from(tiposSet);
  });

  materiasFiltradas = computed(() => {
    return this.materias().filter(materia => {
      const coincideNivel = this.nivelSeleccionado() === 'all' || 
        materia.nivel.nombre === this.nivelSeleccionado();
      
      const coincideTipo = this.tipoSeleccionado() === 'all' || 
        materia.tipo.nombre === this.tipoSeleccionado();
      
      const coincideBusqueda = this.terminoBusqueda() === '' || 
        materia.nombre.toLowerCase().includes(this.terminoBusqueda().toLowerCase()) ||
        materia.sigla.toLowerCase().includes(this.terminoBusqueda().toLowerCase());
      
      return coincideNivel && coincideTipo && coincideBusqueda;
    });
  });

  ngOnInit(): void {
    this.cargarMaterias();
  }

  cargarMaterias(): void {
    this.cargando.set(true);
    this.materiasService.obtenerMaterias().subscribe({
      next: (data) => {
        this.materias.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar las materias');
        this.cargando.set(false);
        console.error(err);
      }
    });
  }

  alternarMateria(materia: Materia): void {
    const actual = this.materiasSeleccionadas();
    const indice = actual.findIndex(m => m.id === materia.id);
    
    if (indice > -1) {
      this.materiasSeleccionadas.set(actual.filter(m => m.id !== materia.id));
    } else {
      this.materiasSeleccionadas.set([...actual, materia]);
    }
  }

  estaSeleccionada(materia: Materia): boolean {
    return this.materiasSeleccionadas().some(m => m.id === materia.id);
  }

  continuarAGrupos(): void {
    if (this.materiasSeleccionadas().length === 0) return;
    localStorage.setItem('materiasSeleccionadas', JSON.stringify(this.materiasSeleccionadas()));
    this.router.navigate(['/grupos']);
  }

  limpiarSeleccion(): void {
    this.materiasSeleccionadas.set([]);
  }

  establecerFiltroNivel(nivel: string): void {
    this.nivelSeleccionado.set(nivel);
  }

  establecerFiltroTipo(tipo: string): void {
    this.tipoSeleccionado.set(tipo);
  }

  establecerTerminoBusqueda(termino: string): void {
    this.terminoBusqueda.set(termino);
  }
}