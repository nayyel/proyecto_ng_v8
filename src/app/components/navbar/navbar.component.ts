import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from '../../service/carrito.service';
import { EmpleadoService } from '../../service/empleado.service';

interface CarritoItem {  // Definir el tipo para los elementos del carrito
  libro: any;
  cantidad: number;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  carritoVisible: boolean = false;
  busquedaVisible: boolean = false;
  categorias: any[] = [];
  carrito: CarritoItem[] = [];  // Usamos el tipo CarritoItem para el carrito

  constructor(
    private router: Router, 
    private carritoService: CarritoService,
    private empleadoService: EmpleadoService
  ) {}

  ngOnInit(): void {
    // Obtener datos del carrito desde el servicio
    this.carritoService.obtenerCarrito().subscribe(carrito => {
      // Convertir el Map a un array de objetos con la estructura adecuada
      this.carrito = Array.from(carrito.entries()).map(([libro, cantidad]) => ({
        libro,
        cantidad
      }));
    });

    this.mostrarCategorias();
  }

  mostrarCategorias(): void {
    this.empleadoService.VerCategorias().subscribe((response: any) => {
      this.categorias = response.Categorias;
    });
  }

  // Aumentar la cantidad del libro en el carrito
  increaseQuantity(item: CarritoItem): void {  // Ahora 'item' tiene el tipo CarritoItem
    if (item.cantidad < item.libro.stock) { // Verifica que no sobrepase el stock
      item.cantidad++;
      this.carritoService.actualizarCarrito(item.libro, item.cantidad);  // Actualiza el carrito en el servicio
    }
  }

  // Disminuir la cantidad del libro en el carrito
  decreaseQuantity(item: CarritoItem): void {  // Ahora 'item' tiene el tipo CarritoItem
    if (item.cantidad > 1) { // Asegúrate de que no se pueda bajar a menos de 0
      item.cantidad--;
      this.carritoService.actualizarCarrito(item.libro, item.cantidad);  // Actualiza el carrito en el servicio
    }
  }

  // Eliminar el libro del carrito
  removeItem(item: CarritoItem): void {  // Ahora 'item' tiene el tipo CarritoItem
    this.carrito = this.carrito.filter(i => i !== item);
    this.carritoService.eliminarDelCarrito(item.libro);  // Elimina el libro del carrito en el servicio
  }

  // Calcular el total del carrito
  totalCarrito(): string {
    const total = this.carrito.reduce((total, item) => total + (item.libro.precio * item.cantidad), 0);
    return total.toFixed(2);  // Redondear a 2 decimales y devolverlo como string
  }

  showCarrito(): void {
    this.carritoVisible = true;
    document.body.style.overflow = 'auto';
  }

  hideCarrito(): void {
    this.carritoVisible = false;
    document.body.style.overflow = 'auto';
  }

  showIframeBusqueda(): void {
    this.busquedaVisible = true;
    document.body.style.overflow = 'auto';
  }

  hideIframeBusqueda(): void {
    this.busquedaVisible = false;
    document.body.style.overflow = 'auto';
  }

  agregarAlCarrito(libro: any): void {
    this.carritoService.agregarAlCarrito(libro);  // Asegúrate de que este servicio maneja correctamente el libro
  }

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

  // Método adicional para navegar a la página de categorías sin id específico
  navigateToCategoria() {
    this.router.navigate(['/categoria']);
  }

  // Navegar a la categoría con el id
  navigateToCategoriaWhitId(id_categoria: number): void {
    this.router.navigate(['/categoria', id_categoria]).then(() => {
      setTimeout(() => {
        this.scrollToCategory(id_categoria);
      }, 100); // Esperar que el DOM se actualice antes de hacer el scroll
    });
  }

  scrollToCategory(id_categoria: number): void {
    const categoriaElement = document.getElementById(`categoria-${id_categoria}`);
    if (categoriaElement) {
      categoriaElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
