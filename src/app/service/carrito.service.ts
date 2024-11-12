// carrito.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito = new BehaviorSubject<Map<string, { libro: any, cantidad: number }>>(new Map()); // Usamos un Map
  carrito$ = this.carrito.asObservable(); // Observable para obtener el carrito

  // Método para agregar un libro al carrito
  agregarAlCarrito(libro: any) {
    const carritoActual = this.carrito.value; // Accedemos al carrito actual (que es un Map)
    const claveLibro = libro.id_libro; // Usamos el id_libro como clave única

    // Verificar si el libro ya está en el carrito
    if (carritoActual.has(claveLibro)) {
      let item = carritoActual.get(claveLibro);
      if (item) { // Asegurarnos de que 'item' no sea undefined
        item.cantidad += 1; // Incrementar la cantidad
      }
    } else {
      carritoActual.set(claveLibro, { libro, cantidad: 1 }); // Si no está, agregarlo con cantidad 1
    }

    // Actualizamos el carrito con el nuevo Map
    this.carrito.next(new Map(carritoActual));
  }

  // Método para obtener el carrito
  obtenerCarrito() {
    return this.carrito$;
  }
}
