import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { interval } from 'rxjs';

interface SolicitudGuardada {
  uuid: string;
  fecha: string;
  tipo: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  
  menuUsuarioAbierto = signal(false);
  menuHistorialAbierto = signal(false);
  solicitudesGuardadas = signal<SolicitudGuardada[]>([]);
  
  private intervaloActualizacion?: any;
  
  ngOnInit(): void {
    this.inicializarEventListeners();
    this.cargarSolicitudesGuardadas();
    this.iniciarActualizacionAutomatica();
  }

  ngOnDestroy(): void {
    this.removerEventListeners();
    if (this.intervaloActualizacion) {
      clearInterval(this.intervaloActualizacion);
    }
  }

  private inicializarEventListeners(): void {
    document.addEventListener('click', this.manejarClickDocumento.bind(this));
    
    const botonMenuUsuario = document.getElementById('user-menu-button');
    if (botonMenuUsuario) {
      botonMenuUsuario.addEventListener('click', this.alternarMenuUsuario.bind(this));
    }

    const botonHistorial = document.getElementById('historial-button');
    if (botonHistorial) {
      botonHistorial.addEventListener('click', this.alternarMenuHistorial.bind(this));
    }
  }

  private removerEventListeners(): void {
    document.removeEventListener('click', this.manejarClickDocumento.bind(this));
  }

  private manejarClickDocumento(event: Event): void {
    const objetivo = event.target as HTMLElement;
    
    // Cerrar menú de usuario si se hace click fuera
    const botonMenuUsuario = document.getElementById('user-menu-button');
    const dropdownUsuario = document.getElementById('dropdown-user');
    
    if (botonMenuUsuario && dropdownUsuario && 
        !botonMenuUsuario.contains(objetivo) && 
        !dropdownUsuario.contains(objetivo)) {
      this.cerrarMenuUsuario();
    }

    // Cerrar menú de historial si se hace click fuera
    const botonHistorial = document.getElementById('historial-button');
    const dropdownHistorial = document.getElementById('dropdown-historial');
    
    if (botonHistorial && dropdownHistorial && 
        !botonHistorial.contains(objetivo) && 
        !dropdownHistorial.contains(objetivo)) {
      this.cerrarMenuHistorial();
    }
  }

  private alternarMenuUsuario(): void {
    this.menuUsuarioAbierto.set(!this.menuUsuarioAbierto());
    const dropdown = document.getElementById('dropdown-user');
    
    if (dropdown) {
      if (this.menuUsuarioAbierto()) {
        dropdown.classList.remove('hidden', 'opacity-0', 'scale-95');
        dropdown.classList.add('opacity-100', 'scale-100');
      } else {
        dropdown.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
          dropdown.classList.add('hidden');
          dropdown.classList.remove('opacity-100', 'scale-100');
        }, 200);
      }
    }
  }

  private alternarMenuHistorial(): void {
    this.menuHistorialAbierto.set(!this.menuHistorialAbierto());
    const dropdown = document.getElementById('dropdown-historial');
    
    if (dropdown) {
      if (this.menuHistorialAbierto()) {
        dropdown.classList.remove('hidden', 'opacity-0', 'scale-95');
        dropdown.classList.add('opacity-100', 'scale-100');
      } else {
        dropdown.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
          dropdown.classList.add('hidden');
          dropdown.classList.remove('opacity-100', 'scale-100');
        }, 200);
      }
    }
  }

  private cerrarMenuUsuario(): void {
    this.menuUsuarioAbierto.set(false);
    const dropdown = document.getElementById('dropdown-user');
    
    if (dropdown) {
      dropdown.classList.add('opacity-0', 'scale-95');
      setTimeout(() => {
        dropdown.classList.add('hidden');
        dropdown.classList.remove('opacity-100', 'scale-100');
      }, 200);
    }
  }

  private cerrarMenuHistorial(): void {
    this.menuHistorialAbierto.set(false);
    const dropdown = document.getElementById('dropdown-historial');
    
    if (dropdown) {
      dropdown.classList.add('opacity-0', 'scale-95');
      setTimeout(() => {
        dropdown.classList.add('hidden');
        dropdown.classList.remove('opacity-100', 'scale-100');
      }, 200);
    }
  }

  private iniciarActualizacionAutomatica(): void {
    // Actualizar el historial cada 5 segundos para reflejar nuevas solicitudes
    this.intervaloActualizacion = setInterval(() => {
      this.cargarSolicitudesGuardadas();
    }, 5000);
  }

  cargarSolicitudesGuardadas(): void {
    const solicitudesJson = localStorage.getItem('solicitudesInscripcion');
    if (solicitudesJson) {
      const solicitudes = JSON.parse(solicitudesJson);
      this.solicitudesGuardadas.set(solicitudes);
      console.log('Solicitudes cargadas en navbar:', solicitudes.length);
    } else {
      console.log('No hay solicitudes en localStorage');
    }
  }

  verSolicitud(uuid: string): void {
    this.cerrarMenuHistorial();
    this.router.navigate(['/inscripcion/estado', uuid]);
  }

  limpiarHistorial(): void {
    if (confirm('¿Estás seguro de que deseas limpiar todo el historial?')) {
      localStorage.removeItem('solicitudesInscripcion');
      this.solicitudesGuardadas.set([]);
      this.cerrarMenuHistorial();
    }
  }

  cerrarSesion(): void {
    this.cerrarMenuUsuario();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}