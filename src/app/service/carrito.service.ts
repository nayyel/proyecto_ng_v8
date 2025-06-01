import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: Map<any, number> = new Map();
  private carritoSubject: BehaviorSubject<Map<any, number>> = new BehaviorSubject(this.carrito);
  api_procesar_compra: string = "http://localhost/api_procesar_compra.php"; 

  constructor(private http: HttpClient) {
    this.cargarDesdeLocalStorage();
  }

  private guardarEnLocalStorage(): void {
    const carritoArray = Array.from(this.carrito.entries()).map(([libro, cantidad]) => ({ libro, cantidad }));
    localStorage.setItem('carrito', JSON.stringify(carritoArray));
  }

  private cargarDesdeLocalStorage(): void {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      const items = JSON.parse(carritoGuardado);
      items.forEach((item: any) => {
        this.carrito.set(item.libro, item.cantidad);
      });
      this.carritoSubject.next(this.carrito);
    }
  }

  obtenerCarrito(): Observable<Map<any, number>> {
    return this.carritoSubject.asObservable();
  }

  obtenerCantidadEnCarrito(libro: any): number {
    const cantidad = this.carrito.get(libro);
    return cantidad || 0;
  }

  actualizarCarrito(libro: any, cantidad: number): void {
    this.carrito.set(libro, cantidad);
    this.carritoSubject.next(this.carrito);
    this.guardarEnLocalStorage();
  }

  eliminarDelCarrito(libro: any): void {
    this.carrito.delete(libro);
    this.carritoSubject.next(this.carrito);
    this.guardarEnLocalStorage();
  }

  agregarAlCarrito(libro: any): void {
    const cantidad = this.carrito.get(libro) || 0;
    this.carrito.set(libro, cantidad + 1);
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
