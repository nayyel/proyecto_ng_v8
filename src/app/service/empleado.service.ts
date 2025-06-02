import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
const ngrokBase = window.location.origin;

@Injectable({
  providedIn: 'root'
})

export class EmpleadoService {

api: string = `${ngrokBase}/api.php`;
api_alta: string = `${ngrokBase}/apialta.php`;
api_categorias: string = `${ngrokBase}/api_categorias.php`;
api_libros: string = `${ngrokBase}/api_libros.php`;
api_search: string = `${ngrokBase}/api_search.php`;
api_actualizar_perfil: string = `${ngrokBase}/api_actualizar_perfil.php`;
api_actualizar_contrasena: string = `${ngrokBase}/api_actualizar_contrasena.php`;
api_historial: string = `${ngrokBase}/api_historial.php`;
api_valoraciones: string = `${ngrokBase}/api_valoracion.php`;
api_direcciones: string = `${ngrokBase}/api_direcciones.php`;
api_tarjetas: string = `${ngrokBase}/api_tarjetas.php`;
  constructor(private http: HttpClient) { }

  Showempleado(Buscador: any): Observable<any> {
    return this.http.post<any>(this.api + "?bs=", Buscador);
  }

  CrearEmpleado(empleado: any): Observable<any> {
    return this.http.post<any>(this.api_alta, empleado);
  }

  VerCategorias(): Observable<any> {
    return this.http.get<any>(this.api_categorias);
  }
  CrearCategoria(categoria: any) {
    return this.http.post(this.api_categorias, categoria);
  }

  EditarCategoria(categoria: any) {
    return this.http.put(this.api_categorias, categoria);
  }

  EliminarCategoria(id: string) {
    return this.http.delete(this.api_categorias, {
      body: { id_categoria: id }
    });
  } 

  VerUsuarios(): Observable<any> {
    return this.http.get<any>(this.api_alta);
  }
  
  // Crear nuevo usuario
  CrearUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.api_alta, usuario);
  }
  
  // Editar usuario
  EditarUsuario(usuario: any) {
    return this.http.put(this.api_alta, usuario);
  }
  
  

  EliminarUsuario(id_usuario: number) {
    return this.http.delete(this.api_alta, {
      body: { id_usuario: id_usuario.toString() }
    });
  }
  VerLibros(): Observable<any> {
    return this.http.get<any>(this.api_libros);
  }
  verValoracionesPorLibro(id_libro: number): Observable<any> {
    return this.http.get<any>(`${this.api_valoraciones}?id_libro=${id_libro}`);
  }

  Crearlibro(libro: any): Observable<any> {
    return this.http.post<any>(this.api_libros + "?bs=", libro);
  }

  editarlibro(libro: any): Observable<any> {
    return this.http.put<any>(this.api_libros + "?bs=", libro);
  }

  eliminarLibro(id_libro: string): Observable<any> {
    return this.http.delete<any>(this.api_libros, { body: { id_libro } });
  }

  searchBooks(data: { query: string }): Observable<any> {
    return this.http.post<any>(this.api_search, data);
  }

  // Nuevo método para actualizar el perfil
  actualizarPerfil(usuario: any): Observable<any> {
    return this.http.put<any>(this.api_actualizar_perfil + "?bs=",usuario);
  }
  
  actualizarContrasena(datos: any): Observable<any> {
    return this.http.put<any>(this.api_actualizar_contrasena,datos);
  }

 
  cargarHistorialCompras(usuario: any): Observable<any> {
    return this.http.put<any>(this.api_historial, usuario);
  }

  crearValoracion(valoracion: any): Observable<any> {
    return this.http.post<any>(this.api_valoraciones, valoracion);
  }
  

  
  borrarValoracion(ID_usuario: number, ID_libro: number): Observable<any> {
    return this.http.delete<any>(this.api_valoraciones, {
      body: { ID_usuario, ID_libro }
    });
  }


  // Método actualizado para crear/actualizar valoración
  actualizarValoracion(valoracionData: any): Observable<any> {
    return new Observable(observer => {
      // Primero borramos si existe
      this.borrarValoracion(valoracionData.ID_usuario, valoracionData.ID_libro).subscribe({
        next: (deleteResponse) => {
          console.log('Valoración anterior borrada:', deleteResponse);
          // Luego creamos la nueva
          this.crearValoracion(valoracionData).subscribe({
            next: (createResponse) => {
              observer.next(createResponse);
              observer.complete();
            },
            error: (createError) => {
              observer.error(createError);
            }
          });
        },
        error: (deleteError) => {
          observer.error(deleteError);
        }
      });
    });
  }


  // === DIRECCIONES ===
crearDireccion(direccion: any): Observable<any> {
  return this.http.post<any>(this.api_direcciones, direccion);
}

verDireccionesPorUsuario(id_usuario: string): Observable<any> {
  return this.http.get<any>(`${this.api_direcciones}?id_usuario=${id_usuario}`);
}

editarDireccion(direccion: any): Observable<any> {
  return this.http.put<any>(this.api_direcciones, direccion);
}

eliminarDireccion(id_direccion: number): Observable<any> {
  return this.http.delete<any>(this.api_direcciones, {
    body: { id_direccion: id_direccion.toString() }
  });
}

// === TARJETAS ===
crearTarjeta(tarjeta: any): Observable<any> {
  return this.http.post<any>(this.api_tarjetas, tarjeta);
}

verTarjetasPorUsuario(id_usuario: string): Observable<any> {
  return this.http.get<any>(`${this.api_tarjetas}?id_usuario=${id_usuario}`);
}

editarTarjeta(tarjeta: any): Observable<any> {
  return this.http.put<any>(this.api_tarjetas, tarjeta);
}

eliminarTarjeta(id_tarjeta: number): Observable<any> {
  return this.http.delete<any>(this.api_tarjetas, {
    body: { id_tarjeta: id_tarjeta.toString() }
  });
}

}