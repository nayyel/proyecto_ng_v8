import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carritoSubject = new BehaviorSubject<any[]>([]);  // Inicializamos con un carrito vacío
  carrito$ = this.carritoSubject.asObservable();

  constructor() { }

  // Método para agregar un libro al carrito
  agregarAlCarrito(libro: any): void {
    const carritoActual = this.carritoSubject.value;
    carritoActual.push(libro);
    this.carritoSubject.next(carritoActual); // Emitimos el carrito actualizado
    console.log('Libro añadido al carrito:', libro);
    console.log('Carrito actualizado en el servicio:', carritoActual);
  }
}