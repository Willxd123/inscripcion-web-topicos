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
  correo: string = '';
  clave: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

 /*  onLogin(): void {
    if (!this.correo || !this.clave) {
      this.errorMessage = 'Por favor, ingrese su correo y contraseña';
      return;
    }

    this.authService.login(this.correo, this.clave).subscribe({
      next: () => {
        this.router.navigate(['/inicio']);
      },
      error: () => {
        this.errorMessage = 'Correo o clave incorrectos';
      },
    });
  } */
  onLogin(): void {
    this.router.navigate(['/materias']);
  }
}
