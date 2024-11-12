// navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from '../../service/carrito.service'; // Asegúrate de importar el servicio
import { EmpleadoService } from '../../service/empleado.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  carritoVisible: boolean = false;
  busquedaVisible: boolean = false;
  carrito: { libro: any, cantidad: number }[] = [];

  constructor(
    private router: Router, 
    private carritoService: CarritoService ,
    private empleadoService: EmpleadoService// Inyección del servicio
  ) { }

  ngOnInit(): void {
    // Suscribirse a los cambios en el carrito
    this.carritoService.obtenerCarrito().subscribe(carrito => {
      // Convertir el Map a un array de objetos { libro, cantidad }
      this.carrito = Array.from(carrito.values());
    });
  }
  showCarrito() {
    this.carritoVisible = true;
    // Bloquear el scroll solo en el body
    document.body.style.overflow = 'auto';  // Bloquear scroll cuando el carrito esté visible
  }

  // Ocultar carrito
  hideCarrito() {
    this.carritoVisible = false;
    // Restaurar el scroll en el body
    document.body.style.overflow = 'auto'; // Permitir el scroll cuando el carrito esté oculto
  }

  // Mostrar iframe de búsqueda
  showIframeBusqueda() {
    this.busquedaVisible = true;
    document.body.style.overflow = 'auto';  // Bloquear scroll al mostrar el iframe de búsqueda
  }

  // Ocultar iframe de búsqueda
  hideIframeBusqueda() {
    this.busquedaVisible = false;
    document.body.style.overflow = 'auto'; // Restaurar el scroll al ocultar el iframe de búsqueda
  }
  // Función que recibe el libro y lo agrega al carrito
  agregarAlCarrito(libro: any) {
    console.log('Libro añadido al carrito:', libro);
    this.carritoService.agregarAlCarrito(libro); // Usa el servicio para agregar al carrito
  }

  // Navegar a la categoría
  navigateToCategoria() {
    this.router.navigate(['/categoria']);
  }

  // Lógica de búsqueda
  onSearch(event: Event) {
    event.preventDefault();
    const inputElement = (event.target as HTMLFormElement).querySelector('#search-input') as HTMLInputElement;
    const searchTerm = inputElement.value.trim();

    if (searchTerm) {
      // Llamada al servicio de búsqueda
      this.empleadoService.searchBooks({ query: searchTerm }).subscribe(
        response => {
          this.showIframeBusqueda(); 
          const iframe = document.querySelector('#iframe-container-busqueda iframe') as HTMLIFrameElement;
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(response, '*');
          } else {
            console.error("El iframe o su contenido no están disponibles.");
          }
        },
        error => {
          console.error("Error en la solicitud de búsqueda:", error);
        }
      );
    } else {
      console.error("El término de búsqueda está vacío.");
    }
  }
}
