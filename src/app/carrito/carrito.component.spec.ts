// carrito.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CarritoService } from '../service/carrito.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit, OnDestroy {

  carrito: any[] = [];
  carritoSubscription: Subscription | null = null; // Para gestionar la suscripción al carrito

  constructor(private carritoService: CarritoService) { }

  ngOnInit(): void {
    // Nos suscribimos al carrito para escuchar sus actualizaciones
    this.carritoSubscription = this.carritoService.carrito$.subscribe((carrito: any[]) => {
      console.log('Carrito actualizado recibido en el componente:', carrito); // Verificamos que llega el carrito
      this.carrito = [...carrito]; // Creamos una copia para asegurarnos de que Angular detecte la actualización
    });
  }

  ngOnDestroy(): void {
    // Nos desuscribimos al destruir el componente para evitar fugas de memoria
    if (this.carritoSubscription) {
      this.carritoSubscription.unsubscribe();
      //a
    }
  }

  realizarCompra(): void {
    console.log('Realizando compra con los siguientes libros:', this.carrito);
    // Implementa la lógica de la compra aquí
  }
}
