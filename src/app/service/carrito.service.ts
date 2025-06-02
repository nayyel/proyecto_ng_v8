import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
const ngrokBase = window.location.origin;
@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: Map<number, { libro: any, cantidad: number }> = new Map();
  private carritoSubject: BehaviorSubject<Map<number, { libro: any, cantidad: number }>> = new BehaviorSubject(this.carrito);

api_procesar_compra: string = `${ngrokBase}/api_procesar_compra.php`;
  constructor(private http: HttpClient) {
    this.cargarDesdeLocalStorage();
  }

  private guardarEnLocalStorage(): void {
    const carritoArray = Array.from(this.carrito.entries()).map(([id, { libro, cantidad }]) => ({
      id,
      libro,
      cantidad
    }));
    localStorage.setItem('carrito', JSON.stringify(carritoArray));
  }
obtenerItem(id_libro: number): { libro: any, cantidad: number } | undefined {
  return this.carrito.get(id_libro);
}
  private cargarDesdeLocalStorage(): void {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      const items = JSON.parse(carritoGuardado);
      items.forEach((item: any) => {
        this.carrito.set(item.id, { libro: item.libro, cantidad: item.cantidad });
      });
      this.carritoSubject.next(this.carrito);
    }
  }

  obtenerCarrito(): Observable<Map<number, { libro: any, cantidad: number }>> {
    return this.carritoSubject.asObservable();
  }
obtenerCarritoValor(): Map<number, { libro: any, cantidad: number }> {
  return this.carrito;
}
  obtenerCantidadEnCarrito(libro: any): number {
    const item = this.carrito.get(libro.id_libro);
    return item ? item.cantidad : 0;
  }

  actualizarCarrito(libro: any, cantidad: number, accion: 'increase' | 'decrease'): void {
    this.carrito.set(libro.id_libro, { libro, cantidad });
      if (accion === 'increase') {
    libro.cantidad = cantidad + 1;
  } else if (accion === 'decrease') {
    libro.cantidad = cantidad - 1;
  }

    this.carritoSubject.next(this.carrito);
    this.guardarEnLocalStorage();
  }

  eliminarDelCarrito(libro: any): void {
    this.carrito.delete(libro.id_libro);
    this.carritoSubject.next(this.carrito);
    libro.cantidad = 0
    this.guardarEnLocalStorage();
  }

  agregarAlCarrito(libro: any): void {
    const item = this.carrito.get(libro.id_libro);
    const cantidad = item ? item.cantidad : 0;
    this.carrito.set(libro.id_libro, { libro, cantidad: cantidad + 1 });
    libro.cantidad = cantidad + 1
    this.carritoSubject.next(this.carrito);
    this.guardarEnLocalStorage();
  }

  procesarCompra(compra: { carrito: any[]; total: number }): Observable<any> {
    return this.http.post(this.api_procesar_compra, compra);
  }

  vaciarCarrito(): void {
    this.carrito.clear();
    this.carritoSubject.next(this.carrito);
    localStorage.removeItem('carrito');
  }
}
