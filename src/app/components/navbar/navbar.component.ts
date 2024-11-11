import { Component } from '@angular/core';
import { EmpleadoService } from '../../service/empleado.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private router: Router,private empleadoService: EmpleadoService) { }

  

  showIframe() {
    const iframeContainer = document.getElementById('iframe-container');
    if (iframeContainer) {
      iframeContainer.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Desactiva el scroll de la página principal
    }
  }

  navigateToCategoria() {
    this.router.navigate(['/categoria']);
  }
  hideIframe() {
    const iframeContainer = document.getElementById('iframe-container');
    if (iframeContainer) {
      iframeContainer.style.display = 'none';
      document.body.style.overflow = 'auto'; // Activa el scroll de la página principal
    }
  }

  onSearch(event: Event) {
    event.preventDefault();
    const inputElement = (event.target as HTMLFormElement).querySelector('#search-input') as HTMLInputElement;
    const searchTerm = inputElement.value.trim(); // Cambiado a tipo primitivo string y eliminado "?" en la URL

    if (searchTerm) {
      // Llama al servicio de búsqueda
      this.empleadoService.searchBooks({ query: searchTerm }).subscribe(
        response => {
          // Muestra el iframe con los resultados
          this.showIframe();
          const iframe = document.querySelector('#iframe-container iframe') as HTMLIFrameElement;
          if (iframe && iframe.contentWindow) {
            // Accede al contenido del iframe y le envía los resultados de la búsqueda
            iframe.contentWindow.postMessage(response, '*');
          } else {
            console.error("El iframe o su contenido no están disponibles.");
          }
        },
        error => {
          console.error("Error en la solicitud de búsqueda:", error);
          // Manejar el error adecuadamente, por ejemplo, mostrar un mensaje al usuario
        }
      );
    } else {
      console.error("El término de búsqueda está vacío.");
      // Podrías mostrar un mensaje al usuario indicando que el campo de búsqueda está vacío
    }
  }
}
