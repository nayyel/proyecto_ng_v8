import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  librosFiltrados: any[] = []; // Esta lista almacenará los libros filtrados
  idCategoria: number | null = null;

  constructor(
    private router: Router,
    private serviceE: EmpleadoService,
    private carritoService: CarritoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const loggedInFromLogin = localStorage.getItem('loggedInFromLogin');
    if (loggedInFromLogin !== 'true') {
      
    }
    this.mostrarCategorias();
    this.cargarLibros(); // Cargar todos los libros al principio
  }

  mostrarCategorias(): void {
    this.serviceE.VerCategorias().subscribe((response: any) => {
      this.categorias = response.Categorias || []; // Asignar un array vacío si es undefined
    });
  }
  
  cargarLibros(): void {
    this.serviceE.VerLibros().subscribe((response: any) => {
      this.libros = response.Libros || []; // Asignar un array vacío si es undefined
      this.librosFiltrados = this.libros;
      this.handleCategoryChange(); // Llamar después de cargar los libros
    });
  }
  

  // Método para manejar el cambio en el filtro de categorías
  // En tu componente de Angular
onCategoriaChange(event: any): void {
  // Si el evento viene de un botón
  let categoriaId = event.target.value;
  
  // Actualizar clase active
  const botones = document.querySelectorAll('.categoria-btn');
  botones.forEach(btn => {
    (btn as HTMLElement).classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Filtrar los libros por categoría
  if (categoriaId === '') {
    this.librosFiltrados = this.libros; // Mostrar todos los libros
  } else {
    this.librosFiltrados = this.libros.filter(libro => 
      libro.id_categoria.toString() === categoriaId
    );
  }
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

  // Esta función maneja la categoría desde la URL (cuando llegas desde el navbar)
  handleCategoryChange(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id_categoria');
      if (id) {
        this.idCategoria = +id; // Convertir a número
        // Filtrar los libros de la categoría
        this.librosFiltrados = this.libros.filter(libro => libro.id_categoria === this.idCategoria);
      }
    });
  }

  scrollToCategory(): void {
    if (this.idCategoria) {
      const categoriaElement = document.getElementById(`categoria-${this.idCategoria}`);
      if (categoriaElement) {
        categoriaElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
