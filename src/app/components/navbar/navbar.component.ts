import { Component } from '@angular/core';
import { EmpleadoService } from '../../service/empleado.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private router: Router, private empleadoService: EmpleadoService) { }

  // Mostrar iframe de carrito
  showIframeCarrito() {
    const iframeContainer = document.getElementById('iframe-container-carrito');
    if (iframeContainer) {
      iframeContainer.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Desactivar el scroll
    }
  }

  // Ocultar iframe de carrito
  hideIframeCarrito() {
    const iframeContainer = document.getElementById('iframe-container-carrito');
    if (iframeContainer) {
      iframeContainer.style.display = 'none';
      document.body.style.overflow = 'auto'; // Volver a activar el scroll
    }
  }

  // Mostrar iframe de búsqueda (ya estaba implementado)
  showIframeBusqueda() {
    const iframeContainer = document.getElementById('iframe-container-busqueda');
    if (iframeContainer) {
      iframeContainer.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Desactivar el scroll
    }
  }

  // Ocultar iframe de búsqueda (ya estaba implementado)
  hideIframeBusqueda() {
    const iframeContainer = document.getElementById('iframe-container-busqueda');
    if (iframeContainer) {
      iframeContainer.style.display = 'none';
      document.body.style.overflow = 'auto'; // Volver a activar el scroll
    }
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
      // Llama al servicio de búsqueda
      this.empleadoService.searchBooks({ query: searchTerm }).subscribe(
        response => {
          // Muestra el iframe con los resultados de la búsqueda
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
      console.error("El término de búsqueda está vacío..");
    }
  }
}
