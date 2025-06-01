import { Component } from '@angular/core';
import { EmpleadoService } from '../service/empleado.service';
import { Router } from '@angular/router';
interface CategoriaResponse {
  mensaje?: string;
  warning?: string;
  error?: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  constructor(private serviceE: EmpleadoService ,   private router: Router ) { }

  // Variables para libros
  libros: any[] = [];
  categorias: any[] = [];
  id_libro: string = '';
  id_categoria: string = '';
  titulo: string = '';
  autor: string = '';
  precio: number | null = null;
  stock: number | null = null;
  link: string = '';
  resumen: string = '';

  // Variables para categorías
  id_categoria_edit: string = '';
  nombre_categoria: string = '';
  link_categoria: string = '';

  // Variables de estado
  mensaje: string = '';
  mostrarMensaje: boolean = false;
  showCreateBookForm = false;
  showEditBookForm = false;
  showCreateCategoryForm = false;
  showEditCategoryForm = false;
  showCategories = false;

  // ================= AÑADIDOS PARA USUARIOS =================
  usuarios: any[] = [];
  id_usuario_editando: number | null = null;
  nombre_usuario: string = '';
  password_usuario: string = '';
  rol_usuario: string = '';
  correo_usuario: string = '';

  showUsers = false;
  showCreateUserForm = false;
  showEditUserForm = false;
  // ===========================================================

  ngOnInit(): void {
       const admin = localStorage.getItem('admin');
    if (admin !== 'true') {
    this.router.navigate(['/categoria']);
    }
    this.getCategorias();
    this.getLibros();
    this.getUsuarios();
  }

  // Métodos para libros
  getLibros() {
    this.serviceE.VerLibros().subscribe(
      (respuesta: any) => {
        this.libros = respuesta.Libros;
      },
      error => {
        console.error("Error al obtener los libros:", error);
        this.showMessage('Error al cargar libros');
      }
    );
  }

  toggleCreateBookForm() {
    this.showCreateBookForm = !this.showCreateBookForm;
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
        this.showMessage('Libro creado exitosamente');
        this.getLibros();
        this.resetBookForm();
        this.showCreateBookForm = false;
      },
      error => {
        this.showMessage('Error al crear el libro');
      }
    );
  }

  prepareEditBook(libro: any) {
    this.id_libro = libro.id_libro;
    this.id_categoria = libro.id_categoria;
    this.titulo = libro.titulo;
    this.autor = libro.autor;
    this.precio = libro.precio;
    this.stock = libro.stock;
    this.link = libro.link;
    this.resumen = libro.resumen;
    this.showEditBookForm = true;

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
        this.showMessage('Libro editado exitosamente');
        this.getLibros();
        this.showEditBookForm = false;
      },
      error => {
        this.showMessage('Error al editar el libro');
      }
    );
  }

  deleteBookById(id_libro: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
      this.serviceE.eliminarLibro(id_libro).subscribe(
        respuesta => {
          this.showMessage('Libro eliminado exitosamente');
          this.getLibros();
        },
        error => {
          this.showMessage('Error al eliminar el libro');
        }
      );
    }
  }

  // Métodos para categorías
  getCategorias() {
    this.serviceE.VerCategorias().subscribe(
      (respuesta: any) => {
        this.categorias = respuesta.Categorias;
      },
      error => {
        console.error("Error al obtener las categorías:", error);
        this.showMessage('Error al cargar categorías');
      }
    );
  }

  toggleView() {
    this.showCategories = !this.showCategories;
    this.showUsers = false; // cerrar vista usuarios si estás en categorías
  }

  toggleCreateCategoryForm() {
    this.showCreateCategoryForm = !this.showCreateCategoryForm;
  }

  createCategory() {
    const categoria = {
      nombre_categoria: this.nombre_categoria,
      link: this.link_categoria
    };

    this.serviceE.CrearCategoria(categoria).subscribe(
      respuesta => {
        this.showMessage('Categoría creada exitosamente');
        this.getCategorias();
        this.resetCategoryForm();
        this.showCreateCategoryForm = false;
      },
      error => {
        this.showMessage('Error al crear la categoría: ' + (error.error?.message || error.message));
      }
    );
  }

  prepareEditCategory(categoria: any) {
    this.id_categoria_edit = categoria.id_categoria;
    this.nombre_categoria = categoria.nombre_categoria;
    this.link_categoria = categoria.link;
    this.showEditCategoryForm = true;

    setTimeout(() => {
      const editForm = document.getElementById('editCategoryForm');
      if (editForm) {
        editForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }

  editCategory() {
    const categoria = {
      id_categoria: this.id_categoria_edit,
      nombre_categoria: this.nombre_categoria,
      link: this.link_categoria
    };

    this.serviceE.EditarCategoria(categoria).subscribe(
      respuesta => {
        this.showMessage('Categoría actualizada exitosamente');
        this.getCategorias();
        this.showEditCategoryForm = false;
      },
      error => {
        this.showMessage('Error al actualizar la categoría: ' + (error.error?.message || error.message));
      }
    );
  }

  deleteCategoryById(id_categoria: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.serviceE.EliminarCategoria(id_categoria).subscribe(
        (respuesta: CategoriaResponse) => {
          if (respuesta.warning) {
            this.showMessage(respuesta.warning);
          } else if (respuesta.mensaje) {
            this.showMessage(respuesta.mensaje);
            this.getCategorias();
          } else if (respuesta.error) {
            this.showMessage("La categoria tiene libros asociados, no se puede eliminar.");
          } else {
            this.showMessage('Respuesta inesperada del servidor.');
          }
        },
        error => {
          this.showMessage(error.error?.error || 'Error al eliminar la categoría');
        }
      );
    }
  }

  // MÉTODOS PARA USUARIOS (AÑADIDOS)
  toggleUsersView() {
    this.showUsers = !this.showUsers;
    this.showCategories = false;
    if (this.showUsers) this.getUsuarios();
  }

  getUsuarios() {
    this.serviceE.VerUsuarios().subscribe(
      (respuesta: any) => {
        this.usuarios = respuesta.usuarios;
      },
      error => {
        this.showMessage('Error al cargar usuarios');
      }
    );
  }

  toggleCreateUserForm() {
    this.showCreateUserForm = !this.showCreateUserForm;
    this.resetUserForm();
  }

  createUser() {
    if (!this.nombre_usuario || !this.password_usuario || !this.rol_usuario) {
      this.showMessage('Todos los campos son obligatorios');
      return;
    }

    const nuevoUsuario = {
      nombre: this.nombre_usuario,
      password: this.password_usuario,
      rol: this.rol_usuario,
      correo: this.correo_usuario
    };

    this.serviceE.CrearEmpleado(nuevoUsuario).subscribe(
      res => {
        this.showMessage(res.mensaje || 'Usuario creado correctamente');
        this.getUsuarios();
        this.resetUserForm();
        this.showCreateUserForm = false;
      },
      err => {
        this.showMessage(err.error?.error || 'Error al crear usuario');
      }
    );
  }

  prepareEditUser(usuario: any) {
    this.id_usuario_editando = usuario.id_usuario;
    this.nombre_usuario = usuario.nombre;
    this.rol_usuario = usuario.rol;
    this.correo_usuario = usuario.correo; // <--- esto faltaba
    this.password_usuario = '';
    this.showEditUserForm = true;
    this.showCreateUserForm = false;

        setTimeout(() => {
      const editForm = document.getElementById('editUserForm');
      if (editForm) {
        editForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }
  setView(vista: string) {
    this.showCategories = vista === 'categorias';
    this.showUsers = vista === 'usuarios';
    this.showEditBookForm = false;
    this.showEditCategoryForm = false;
    this.showEditUserForm = false;
  }
  
  editUser() {
    if (!this.nombre_usuario || !this.rol_usuario) {
      this.showMessage('Faltan datos para editar el usuario');
      return;
    }

    const usuarioActualizado: any = {
      id_usuario: this.id_usuario_editando,
      nombre: this.nombre_usuario,
      rol: this.rol_usuario,
      correo: this.correo_usuario
    };

    if (this.password_usuario) {
      usuarioActualizado.password = this.password_usuario;
    }

    this.serviceE.EditarUsuario(usuarioActualizado).subscribe(
      res => {
        this.showMessage((res as any).mensaje || 'Usuario actualizado correctamente');
        this.getUsuarios();
        this.resetUserForm();
        this.showEditUserForm = false;
      },
      err => {
        this.showMessage(err.error?.error || 'Error al editar usuario');
      }
    );
  }

  deleteUserById(id_usuario: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.serviceE.EliminarUsuario(id_usuario).subscribe(
        res => {
          this.showMessage((res as any).mensaje || 'Usuario eliminado correctamente');

          this.getUsuarios();
        },
        err => {
          this.showMessage(err.error?.error || 'Error al eliminar usuario');
        }
      );
    }
  }

  // Auxiliares
  resetBookForm() {
    this.id_categoria = '';
    this.titulo = '';
    this.autor = '';
    this.precio = null;
    this.stock = null;
    this.link = '';
    this.resumen = '';
  }

  resetCategoryForm() {
    this.id_categoria_edit = '';
    this.nombre_categoria = '';
    this.link_categoria = '';
  }

  resetUserForm() {
    this.id_usuario_editando = null;
    this.nombre_usuario = '';
    this.password_usuario = '';
    this.rol_usuario = '';
    this.correo_usuario = '';
  }

  showMessage(msg: string) {
    this.mensaje = msg;
    this.mostrarMensaje = true;
    setTimeout(() => this.mostrarMensaje = false, 5000);
  }
}
