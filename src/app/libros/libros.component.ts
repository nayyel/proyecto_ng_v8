import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpleadoService } from '../service/empleado.service';
import { Router } from '@angular/router';
import { CarritoService } from '../service/carrito.service';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.css']
})
export class LibrosComponent implements OnInit { 

  libros: any[] = [];
  libroId: number = 0;

  constructor(
    private router: Router,   
    private carritoService: CarritoService,
    private route: ActivatedRoute,
    private serviceE: EmpleadoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id_libro']) {
        this.libroId = +params['id_libro']; // Convierte el parámetro a número
        this.MostrarLibro();
      } else {
        console.log('No se encontró el parámetro id_libro en la URL');
      }
    });
  }

  MostrarLibro(): void {
    this.serviceE.VerLibros().subscribe(response => {
      this.libros = response.Libros;
    });
  }

  // Getter para obtener el libro seleccionado
  get libroSeleccionado() {
    return this.libros.find(libro => libro.id_libro === this.libroId);
  }

  agregarAlCarrito(libro: any): void {
    const cantidadActual = this.carritoService.obtenerCantidadEnCarrito(libro);
    if (cantidadActual < libro.stock) {
      this.carritoService.agregarAlCarrito(libro);
    } else {
      console.log('No se puede agregar más, el stock está agotado.');
    }
  }
}
