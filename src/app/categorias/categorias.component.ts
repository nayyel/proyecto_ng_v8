import { Component, OnInit, OnDestroy, Renderer2, Inject, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadoService } from '../service/empleado.service';
import { CarritoService } from '../service/carrito.service'; 
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit, OnDestroy {

  @Output() agregarAlCarritoEvent = new EventEmitter<any>();  // Evento para pasar el libro al carrito
  categorias: any[] = [];
  libros: any[] = [];

  constructor(
    private router: Router,
    private serviceE: EmpleadoService,
    private carritoService: CarritoService, 
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    const loggedInFromLogin = localStorage.getItem('loggedInFromLogin');
    if (loggedInFromLogin !== 'true') {
      this.router.navigate(['/empleado']);
    }
    this.renderer.addClass(this.document.body, 'categoria-pagina');
    this.mostrarCategorias();
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'categoria-pagina');
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

  // Método para agregar un libro al carrito
  agregarAlCarrito(libro: any): void {
    console.log('Añadir al carrito:', libro);
    this.agregarAlCarritoEvent.emit(libro); // Emitimos el libro al componente padre
  }
}