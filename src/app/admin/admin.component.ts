import { Component } from '@angular/core';
import { EmpleadoService } from '../service/empleado.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  constructor(private serviceE: EmpleadoService) { }

  // Variables
  categorias: { id_categoria: number, nombre_categoria: string }[] = [];
  libros: any[] = [];
  id_libro: string = ''; // ID del libro
  id_categoria: string = '';
  titulo: string = '';
  autor: string = '';
  precio: number | null = null;
  stock: number | null = null;
  link: string = '';
  resumen: string = '';
  
  mensaje: string = ''; // Mensaje de notificación
  mostrarMensaje: boolean = false; // Controlar visibilidad del mensaje

  showCreateBookForm = false;
  showEditBookForm = false;
  showDeleteBookForm = false;
  showCreateCategoryForm = false;
  showEditCategoryForm = false;
  showDeleteCategoryForm = false;

  ngOnInit(): void {
    // Al inicializar el componente, cargar las categorías
    this.getCategorias();
    this.getLibros();
  }
  getLibros() {
    this.serviceE.VerLibros().subscribe(
      (respuesta: any) => {
        this.libros = respuesta.Libros; // Asegúrate de usar la propiedad correcta
        console.log('Libros:', this.libros); // Agregar este console.log
      },
      error => {
        console.error("Error al obtener los libros:", error);
      }
    );
  }
  getCategorias() {
    this.serviceE.VerCategorias().subscribe(
      (respuesta: any) => {
        this.categorias = respuesta.Categorias; // Asegúrate de usar la propiedad correcta
        console.log('Categorías:', this.categorias); // Agregar este console.log
      },
      error => {
        console.error("Error al obtener las categorías:", error);
      }
    );
  }
  
  // Funciones para alternar la visibilidad de los formularios
  toggleCreateBookForm() {
    this.showCreateBookForm = !this.showCreateBookForm;
  }

  toggleEditBookForm() {
    this.showEditBookForm = !this.showEditBookForm;
  }

  toggleDeleteBookForm() {
    this.showDeleteBookForm = !this.showDeleteBookForm;
  }

  toggleCreateCategoryForm() {
    this.showCreateCategoryForm = !this.showCreateCategoryForm;
  }

  toggleEditCategoryForm() {
    this.showEditCategoryForm = !this.showEditCategoryForm;
  }

  toggleDeleteCategoryForm() {
    this.showDeleteCategoryForm = !this.showDeleteCategoryForm;
  }

  // Función para crear un libro
  createBook() {
    const libro = {
      id_categoria: this.id_categoria,
      titulo: this.titulo,
      autor: this.autor,
      precio: this.precio,
      stock: this.stock,
      link: this.link,
      resumen: this.resumen
    };
  
    this.serviceE.Crearlibro(libro).subscribe(
      respuesta => {
        console.log(respuesta); // Verificar la respuesta del backend
        this.mensaje = 'Libro creado exitosamente'; // Establecer mensaje
        this.mostrarMensaje = true; // Mostrar el mensaje
  
        // Limpiar los campos del formulario
        this.id_categoria = '';
        this.titulo = '';
        this.autor = '';
        this.precio = null;
        this.stock = null;
        this.link = '';
        this.resumen = '';
  
        // Actualizar la lista de libros
        this.getLibros();
  
        // Ocultar el mensaje después de 4 segundos
        setTimeout(() => {
          this.mostrarMensaje = false;
        }, 4000);
      },
      error => {
        console.error(error); // Manejo de errores
        this.mensaje = 'Error al crear el libro'; // Establecer mensaje de error
        this.mostrarMensaje = true; // Mostrar el mensaje
  
        // Ocultar el mensaje después de 4 segundos
        setTimeout(() => {
          this.mostrarMensaje = false;
        }, 4000);
      }
    );
  }

  // Función para editar un libro
  editBook() {
    const libro = {
      id_libro: this.id_libro,
      id_categoria: this.id_categoria,
      titulo: this.titulo,
      autor: this.autor,
      precio: this.precio,
      stock: this.stock,
      link: this.link,
      resumen: this.resumen
    };
  
    this.serviceE.editarlibro(libro).subscribe(
      respuesta => {
        console.log(respuesta); // Verificar la respuesta del backend
        this.mensaje = 'Libro editado exitosamente'; // Establecer mensaje
        this.mostrarMensaje = true; // Mostrar el mensaje
  
        // Limpiar los campos del formulario
        this.id_libro = '';
        this.id_categoria = '';
        this.titulo = '';
        this.autor = '';
        this.precio = null;
        this.stock = null;
        this.link = '';
        this.resumen = '';
  
        // Ocultar el mensaje después de 4 segundos
        setTimeout(() => {
          this.mostrarMensaje = false;
        }, 4000);
  
        // Refrescar toda la página
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      },
      error => {
        console.error(error); // Manejo de errores
        this.mensaje = 'Error al editar el libro'; // Establecer mensaje de error
        this.mostrarMensaje = true; // Mostrar el mensaje
  
        // Ocultar el mensaje después de 4 segundos
        setTimeout(() => {
          this.mostrarMensaje = false;
        }, 4000);
      }
    );
  }
  

  // Función para eliminar un libro
  deleteBook() {
    this.serviceE.eliminarLibro(this.id_libro).subscribe(
      respuesta => {
        console.log(respuesta); // Verificar la respuesta del backend
        this.mensaje = 'Libro eliminado exitosamente'; // Establecer mensaje
        this.mostrarMensaje = true; // Mostrar el mensaje

        // Limpiar los campos del formulario
        this.id_libro = '';

        // Actualizar la lista de libros
        this.getLibros();

        // Ocultar el mensaje después de 4 segundos
        setTimeout(() => {
          this.mostrarMensaje = false;
        }, 4000);
      },
      error => {
        console.error(error); // Manejo de errores
        this.mensaje = 'Error al eliminar el libro'; // Establecer mensaje de error
        this.mostrarMensaje = true; // Mostrar el mensaje

        // Ocultar el mensaje después de 4 segundos
        setTimeout(() => {
          this.mostrarMensaje = false;
        }, 4000);
      }
    );
  }



}
