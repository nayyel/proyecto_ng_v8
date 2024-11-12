import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadoService } from '../service/empleado.service';
import { CarritoService } from '../service/carrito.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categorias: any[] = [];
  libros: any[] = [];

  constructor(
    private router: Router,
    private serviceE: EmpleadoService,
    private carritoService: CarritoService
  ) { }

  ngOnInit(): void {
    const loggedInFromLogin = localStorage.getItem('loggedInFromLogin');
    if (loggedInFromLogin !== 'true') {
      this.router.navigate(['/empleado']);
    }
    this.mostrarCategorias();
  }

  mostrarCategorias(): void {
    this.serviceE.VerCategorias().subscribe((response: any) => {
      this.categorias = response.Categorias;
    });
  }

  MostrarDiv(id_categoria: number): void {
    this.serviceE.VerLibros().subscribe(response => {
      this.libros = response.Libros.filter((libro: any) => libro.id_categoria === id_categoria);
    });
  }

  agregarAlCarrito(libro: any): void {
    this.carritoService.agregarAlCarrito(libro); // Llama al servicio directamente
  }
}