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
      // Verifica si el parámetro id_libro está presente
      if (params['id_libro']) {
        this.libroId = +params['id_libro']; // Convierte el parámetro a número
        this.MostrarLibro(this.libroId);
      } else {
        console.log('No se encontró el parámetro id_libro en la URL');
      }
    });
  }

  MostrarLibro(libroId: number): void {
    this.serviceE.VerLibros().subscribe(response => {
      this.libros = response.Libros;
      const libro = this.libros.find(libro => libro.id_libro === libroId);

      if (libro) {
        console.log(libro);
        // Aquí puedes agregar el código para mostrar el libro
      } else {
        console.log('Libro no encontrado');
      }
    });
  }

  agregarAlCarrito(libro: any): void {
    // Primero, obtener la cantidad actual del libro en el carrito
    const cantidadActual = this.carritoService.obtenerCantidadEnCarrito(libro);
  
    // Verificar si la cantidad actual es menor al stock disponible
    if (cantidadActual < libro.stock) {
      // Si aún hay stock disponible, agregar el libro al carrito
      this.carritoService.agregarAlCarrito(libro);
    } else {
      // Si no hay stock suficiente, mostrar un mensaje o desactivar el botón
      console.log('No se puede agregar más, el stock está agotado.');
    }
  }
}