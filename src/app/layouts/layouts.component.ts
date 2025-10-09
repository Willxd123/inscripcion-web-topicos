import { Component } from '@angular/core';
import { NavbarComponent } from "./components/navbar/navbar.component";

import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-layouts',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, ],
  templateUrl: './layouts.component.html',
  styleUrl: './layouts.component.css'
})
export class LayoutsComponent {

}
