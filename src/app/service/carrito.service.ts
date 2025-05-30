import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: Map<any, number> = new Map();  // Usamos un Map para manejar el carrito
  private carritoSubject: BehaviorSubject<Map<any, number>> = new BehaviorSubject(this.carrito);
  api_procesar_compra: string = "http://localhost/api_procesar_compra.php"; 
  constructor(private http: HttpClient) { }

  // Obtener el carrito
  obtenerCarrito(): Observable<Map<any, number>> {
    return this.carritoSubject.asObservable();
  }
  obtenerCantidadEnCarrito(libro: any): number {
    const cantidad = this.carrito.get(libro);
    return cantidad || 0; // Si no está en el carrito, retornar 0
  }
  // Actualizar la cantidad de un libro en el carrito
  actualizarCarrito(libro: any, cantidad: number): void {
    this.carrito.set(libro, cantidad);
    this.carritoSubject.next(this.carrito);
  }

  // Eliminar un libro del carrito
  eliminarDelCarrito(libro: any): void {
    this.carrito.delete(libro);
    this.carritoSubject.next(this.carrito);
  }

  // Método para agregar al carrito (puede ser necesario dependiendo del flujo de tu aplicación)
  agregarAlCarrito(libro: any): void {
    const cantidad = this.carrito.get(libro) || 0;
    this.carrito.set(libro, cantidad + 1);
    this.carritoSubject.next(this.carrito);
  }


  procesarCompra(compra: { carrito: any[]; total: number}): Observable<any> {
    return this.http.post(this.api_procesar_compra, compra); // Ajusta la URL según tu backend
  }
  vaciarCarrito(): void {
    this.carrito.clear();  // Vacía el carrito (Map o array, según sea el caso)
  }
}
