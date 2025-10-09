import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { GruposService } from './grupos.service';
import { Grupo, GrupoSeleccionado } from './grupo.interface';
import { Materia } from '../materias/materia.interface';

interface MateriaConGrupos {
  materia: Materia;
  grupos: Grupo[];
  grupoSeleccionado: number | null;
}

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grupos.component.html',
})
export class GruposComponent implements OnInit {
  private readonly gruposService = inject(GruposService);
  private readonly router = inject(Router);

  materiasConGrupos = signal<MateriaConGrupos[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);

  todasSeleccionadas = computed(() => {
    return this.materiasConGrupos().every(m => m.grupoSeleccionado !== null);
  });

  materiasSeleccionadas = computed(() => {
    return this.materiasConGrupos().filter(m => m.grupoSeleccionado !== null).length;
  });

  tieneAlMenosUnaSeleccionada = computed(() => {
    return this.materiasSeleccionadas() > 0;
  });

  progresoSeleccion = computed(() => {
    const total = this.materiasConGrupos().length;
    const seleccionadas = this.materiasSeleccionadas();
    return total > 0 ? Math.round((seleccionadas / total) * 100) : 0;
  });

  ngOnInit(): void {
    this.cargarGruposPorMaterias();
  }

  cargarGruposPorMaterias(): void {
    const materiasSeleccionadasJson = localStorage.getItem('materiasSeleccionadas');
    
    if (!materiasSeleccionadasJson) {
      this.router.navigate(['/materias']);
      return;
    }

    const materiasSeleccionadas: Materia[] = JSON.parse(materiasSeleccionadasJson);
    
    if (materiasSeleccionadas.length === 0) {
      this.router.navigate(['/materias']);
      return;
    }

    this.cargando.set(true);

    const peticiones = materiasSeleccionadas.map(materia =>
      this.gruposService.obtenerGruposPorMateria(materia.id)
    );

    forkJoin(peticiones).subscribe({
      next: (resultados) => {
        const materiasConGrupos: MateriaConGrupos[] = materiasSeleccionadas.map((materia, index) => ({
          materia,
          grupos: resultados[index],
          grupoSeleccionado: null
        }));

        this.materiasConGrupos.set(materiasConGrupos);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los grupos de las materias');
        this.cargando.set(false);
        console.error(err);
      }
    });
  }

  seleccionarGrupo(materiaId: number, grupoId: number): void {
    const materias = this.materiasConGrupos();
    const materiaIndex = materias.findIndex(m => m.materia.id === materiaId);
    
    if (materiaIndex !== -1) {
      materias[materiaIndex].grupoSeleccionado = grupoId;
      this.materiasConGrupos.set([...materias]);
    }
  }

  gruposConCupo(grupos: Grupo[]): Grupo[] {
    return grupos.filter(grupo => grupo.cupo > 0);
  }

  volverAMaterias(): void {
    this.router.navigate(['/materias']);
  }

  continuarAInscripcion(): void {
    if (!this.tieneAlMenosUnaSeleccionada()) {
      alert('Debes seleccionar al menos un grupo');
      return;
    }

    // Solo guardar las materias que tienen grupo seleccionado
    const gruposSeleccionados: GrupoSeleccionado[] = this.materiasConGrupos()
      .filter(mc => mc.grupoSeleccionado !== null)
      .map(mc => {
        const grupoSeleccionado = mc.grupos.find(g => g.id === mc.grupoSeleccionado);
        return {
          materiaId: mc.materia.id,
          materiaNombre: mc.materia.nombre,
          materiaSigla: mc.materia.sigla,
          grupoId: grupoSeleccionado!.id,
          grupoSigla: grupoSeleccionado!.sigla,
          docenteId: grupoSeleccionado!.docenteId
        };
      });

    localStorage.setItem('gruposSeleccionados', JSON.stringify(gruposSeleccionados));
    this.router.navigate(['/inscripcion']);
  }

  formatearHora(hora: string): string {
    // Convierte "08:00:00" o "08:00" a "08:00"
    return hora.substring(0, 5);
  }
}