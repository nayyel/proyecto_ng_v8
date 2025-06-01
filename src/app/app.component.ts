import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Libreria Libera';
  constructor(private router: Router,) { }
  isLoginPage(): boolean {
    return this.router.url === '/empleado' || this.router.url === '/registro' || this.router.url === '/busqueda'|| this.router.url === '/carrito';
  }
isCategoryPage(): boolean {
  return this.router.url.startsWith('/categoria');
}
}
