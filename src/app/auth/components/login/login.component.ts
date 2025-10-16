import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',

})
export class LoginComponent {
  registro: string = '';
  codigo: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  /* onLogin(): void {
    if (!this.registro || !this.codigo) {
      this.errorMessage = 'Por favor, ingrese su registro y contraseña';
      return;
    }

    this.authService.login(this.registro, this.codigo).subscribe({
      next: () => {
        this.router.navigate(['/materias']);
      },
      error: () => {
        this.errorMessage = 'registro o codigo incorrectos';
      },
    });
  } */
  onLogin(): void {
    this.router.navigate(['/materias']);
  }
}
