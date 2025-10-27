import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilService } from './perfil.service';
import { Perfil } from './perfil.interfase';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
})
export class PerfilComponent implements OnInit {
  private readonly perfilService = inject(PerfilService);

  perfil = signal<Perfil | null>(null);
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.perfilService.obtenerPerfilActual().subscribe({
      next: (data) => {
        this.perfil.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar el perfil:', err);
        this.error.set('No se pudo cargar la información del perfil');
        this.cargando.set(false);
      }
    });
  }

  recargarPerfil(): void {
    this.cargarPerfil();
  }

  /**
   * Obtiene las iniciales del nombre para mostrar en el avatar
   */
  getNombreIniciales(): string {
    const perfilData = this.perfil();
    if (!perfilData || !perfilData.nombre) return '';

    const nombres = perfilData.nombre.split(' ');
    const primerNombre = nombres[0] || '';
    const segundoNombre = nombres[1] || '';

    const primeraInicial = primerNombre.charAt(0).toUpperCase();
    const segundaInicial = segundoNombre.charAt(0).toUpperCase();

    return primeraInicial + segundaInicial;
  }
}