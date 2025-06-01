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
  loggedIn: boolean = false;
  busquedaVisible: boolean = false;
  imageUrl: string = ''; // Aquí va la URL de la imagen que quieres verificar

  categorias: any[] = [];
  carrito: CarritoItem[] = [];  // Usamos el tipo CarritoItem para el carrito

  constructor(
    private router: Router, 
    private carritoService: CarritoService,
    private empleadoService: EmpleadoService
  ) {}

  ngOnInit(): void { 
       // Comprobar el estado de login desde localStorage
       this.loggedIn = localStorage.getItem('loggedInFromLogin') === 'true';
       let fotoPerfil = localStorage.getItem('Foto_Perfil');
       this.imageUrl = fotoPerfil && fotoPerfil !== "" ? fotoPerfil : "https://static.vecteezy.com/system/resources/previews/027/728/804/non_2x/faceless-businessman-user-profile-icon-business-leader-profile-picture-portrait-user-member-people-icon-in-flat-style-circle-button-with-avatar-photo-silhouette-free-png.png";
    // Obtener datos del carrito desde el servicio
    this.carritoService.obtenerCarrito().subscribe(carrito => {
      // Re-sincronizar el carrito después de la compra
      this.carrito = Array.from(carrito.entries()).map(([libro, cantidad]) => ({
        libro,
        cantidad
      }));
    });

    this.mostrarCategorias();
  }
  logout(): void {
    localStorage.removeItem('loggedInFromLogin');
    localStorage.removeItem('Foto_Perfil');
    this.loggedIn = false;  // Actualizar el estado local
    // Redirigir a la página de inicio de sesión
    window.location.href = '/empleado';
  }
  checkImageUrl(url: string): string {
    const img = new Image();
    img.src = url;
    return img.complete ? url : this.imageUrl;
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
    this.busquedaVisible = true; // Configura la bandera para mostrar el iframe
  
    // Asegurar que el DOM refleje el cambio
    setTimeout(() => {
      const iframeContainer = document.getElementById('iframe-container-busqueda');
      if (iframeContainer) {
        iframeContainer.style.display = 'block';
      } else {
        console.warn('El contenedor del iframe no se encontró.');
      }
    }, 0);
  
    // Deshabilita el desplazamiento del cuerpo mientras el iframe está abierto
    document.body.style.overflow = 'hidden';
  }
  
  hideIframeBusqueda(): void {
    this.busquedaVisible = false; // Configura la bandera para ocultar el iframe
  
    // Restaurar el desplazamiento del cuerpo
    document.body.style.overflow = 'auto';
  }

  agregarAlCarrito(libro: any): void {
    this.carritoService.agregarAlCarrito(libro);  // Asegúrate de que este servicio maneja correctamente el libro
  }

  onSearch(event: Event) {
       event.preventDefault();
  
    // Obtener el término de búsqueda
    const inputElement = (event.target as HTMLFormElement).querySelector('#search-input') as HTMLInputElement;
    const searchTerm = inputElement.value.trim();
  
    const iframe = document.querySelector('#iframe-container-busqueda iframe') as HTMLIFrameElement;
  
    if (searchTerm) {
      // Llamada al servicio de búsqueda
      this.empleadoService.searchBooks({ query: searchTerm }).subscribe(
        response => {
      
  
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(response, '*'); // Enviar resultados al iframe
          } else {
            console.error("El iframe o su contenido no están disponibles.");
          }
        },
        error => {
         
          console.error("Error en la solicitud de búsqueda:", error);
  
          // Asegurar que el iframe se actualice incluso en caso de error
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ Libros: [], Categorias: [] }, '*');
          }
        }
        
      );

    } else {

  
      // Enviar un mensaje vacío al iframe
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ Libros: [], Categorias: [] }, '*');
      }
    }
           this.showIframeBusqueda(); 
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
procesarCompra(): void {
  if (!this.loggedIn) {
    alert('Tienes que iniciar sesión para poder comprar.');
    return;
  }

  const total = parseFloat(this.totalCarrito());

  const compra = {
    carrito: this.carrito,
    total: total,
    id_usuario: localStorage.getItem('userId')
  };

  this.hideCarrito();  // Oculta el modal o panel del carrito

  // Navega a la pasarela con los datos de la compra
  this.router.navigate(['/pasarela'], { state: { compra } });
}


}


