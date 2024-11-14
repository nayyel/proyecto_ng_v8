import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: Map<any, number> = new Map();  // Usamos un Map para manejar el carrito
  private carritoSubject: BehaviorSubject<Map<any, number>> = new BehaviorSubject(this.carrito);

  constructor() { }

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
}
