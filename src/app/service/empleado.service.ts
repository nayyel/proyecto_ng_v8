import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  api: string = "http://localhost/api.php";
  api_alta: string = "http://localhost/apialta.php";
  api_categorias: string = "http://localhost/api_categorias.php";
  api_libros: string = "http://localhost/api_libros.php";
  api_search: string = "http://localhost/api_search.php";
  api_libro_crear: string = "http://localhost/api_crear_libro.php";
  api_libro_editar: string = "http://localhost/api_editar_libro.php";
  api_libro_eliminar: string = "http://localhost/api_borrar_libro.php"; 
  api_actualizar_perfil: string = "http://localhost/api_actualizar_perfil.php"; // URL para actualizar el perfil
  api_actualizar_contrasena: string = "http://localhost/api_actualizar_contrasena.php"; // URL para actualizar la contraseña

  constructor(private http: HttpClient) { }

  Showempleado(Buscador: any): Observable<any> {
    return this.http.post<any>(this.api + "?bs=", Buscador);
  }

  CrearEmpleado(empleado: any): Observable<any> {
    return this.http.post<any>(this.api_alta + "?bs=", empleado);
  }

  VerCategorias(): Observable<any> {
    return this.http.get<any>(this.api_categorias);
  }

  VerLibros(): Observable<any> {
    return this.http.get<any>(this.api_libros);
  }

  Crearlibro(libro: any): Observable<any> {
    return this.http.post<any>(this.api_libro_crear + "?bs=", libro);
  }

  editarlibro(libro: any): Observable<any> {
    return this.http.put<any>(this.api_libro_editar + "?bs=", libro);
  }

  eliminarLibro(id_libro: string): Observable<any> {
    return this.http.delete<any>(this.api_libro_eliminar, { body: { id_libro } });
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
}
