// navbar.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isUserMenuOpen = false;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeEventListeners();
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
  }

  private initializeEventListeners(): void {
    // Event listener para el botón del menú de usuario
    document.addEventListener('click', this.handleDocumentClick.bind(this));
    
    // Event listener para el toggle del sidebar
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', this.toggleSidebar.bind(this));
    }

    // Event listener para el menú de usuario
    const userMenuButton = document.getElementById('user-menu-button');
    if (userMenuButton) {
      userMenuButton.addEventListener('click', this.toggleUserMenu.bind(this));
    }
  }

  private removeEventListeners(): void {
    document.removeEventListener('click', this.handleDocumentClick.bind(this));
  }

  private handleDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const userMenuButton = document.getElementById('user-menu-button');
    const userDropdown = document.getElementById('dropdown-user');
    
    if (userMenuButton && userDropdown && 
        !userMenuButton.contains(target) && 
        !userDropdown.contains(target)) {
      this.closeUserMenu();
    }
  }

  private toggleSidebar(): void {
    const sidebar = document.getElementById('logo-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar && overlay) {
      sidebar.classList.toggle('-translate-x-full');
      overlay.classList.toggle('hidden');
    }
  }

  private toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    const dropdown = document.getElementById('dropdown-user');
    
    if (dropdown) {
      if (this.isUserMenuOpen) {
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

  private closeUserMenu(): void {
    this.isUserMenuOpen = false;
    const dropdown = document.getElementById('dropdown-user');
    
    if (dropdown) {
      dropdown.classList.add('opacity-0', 'scale-95');
      setTimeout(() => {
        dropdown.classList.add('hidden');
        dropdown.classList.remove('opacity-100', 'scale-100');
      }, 200);
    }
  }

  logout(): void {
    this.closeUserMenu();
    this.authService.logout();
  }
}