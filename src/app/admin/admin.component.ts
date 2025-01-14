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
  id_libro: string = '';
  id_categoria: string = '';
  titulo: string = '';
  autor: string = '';
  precio: number | null = null;
  stock: number | null = null;
  link: string = '';
  resumen: string = '';
  mensaje: string = '';
  mostrarMensaje: boolean = false;
  showCreateBookForm = false;
  showEditBookForm = false;
  showCategories = false;

  ngOnInit(): void {
    this.getCategorias();
    this.getLibros();
  }

  getLibros() {
    this.serviceE.VerLibros().subscribe(
      (respuesta: any) => {
        this.libros = respuesta.Libros;
      },
      error => {
        console.error("Error al obtener los libros:", error);
      }
    );
  }

  getCategorias() {
    this.serviceE.VerCategorias().subscribe(
      (respuesta: any) => {
        this.categorias = respuesta.Categorias;
      },
      error => {
        console.error("Error al obtener las categorías:", error);
      }
    );
  }

  toggleCreateBookForm() {
    this.showCreateBookForm = !this.showCreateBookForm;
  }

  toggleView() {
    this.showCategories = !this.showCategories;
  }

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
        this.mensaje = 'Libro creado exitosamente';
        this.mostrarMensaje = true;
        this.getLibros();
        this.resetForm();
      },
      error => {
        this.mensaje = 'Error al crear el libro';
        this.mostrarMensaje = true;
      }
    );
  }

  prepareEditBook(libro: any) {
    // Rellenar los datos del formulario
    this.id_libro = libro.id_libro;
    this.id_categoria = libro.id_categoria;
    this.titulo = libro.titulo;
    this.autor = libro.autor;
    this.precio = libro.precio;
    this.stock = libro.stock;
    this.link = libro.link;
    this.resumen = libro.resumen;
  
    // Mostrar el formulario de edición
    this.showEditBookForm = true;
  
    // Esperar un pequeño momento para asegurar que el formulario se renderice y luego desplazar
    setTimeout(() => {
      const editForm = document.getElementById('editBookForm');
      if (editForm) {
        editForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }

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
        this.mensaje = 'Libro editado exitosamente';
        this.mostrarMensaje = true;
        this.getLibros();
        this.showEditBookForm = false;
      },
      error => {
        this.mensaje = 'Error al editar el libro';
        this.mostrarMensaje = true;
      }
    );
  }

  deleteBookById(id_libro: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
      this.serviceE.eliminarLibro(id_libro).subscribe(
        respuesta => {
          this.mensaje = 'Libro eliminado exitosamente';
          this.mostrarMensaje = true;
          this.getLibros();
        },
        error => {
          this.mensaje = 'Error al eliminar el libro';
          this.mostrarMensaje = true;
        }
      );
    }
  }

  resetForm() {
    this.id_categoria = '';
    this.titulo = '';
    this.autor = '';
    this.precio = null;
    this.stock = null;
    this.link = '';
    this.resumen = '';
  }
}
