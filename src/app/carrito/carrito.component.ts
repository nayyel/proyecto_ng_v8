import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  
  carrito: any[] = []; // Aquí almacenamos los libros del carrito

  constructor() { }

  ngOnInit(): void {
    console.log('Carrito cargado en el componente:', this.carrito);
  }

  // Método para agregar libros al carrito
  agregarAlCarrito(libro: any): void {
    console.log('Añadir al carrito:', libro);
    this.carrito.push(libro); // Añadimos el libro al carrito
    console.log('Carrito actualizado:', this.carrito);
  }

  // Método para realizar la compra
  realizarCompra(): void {
    console.log('Realizando compra con los siguientes libros:', this.carrito);
    // Aquí va la lógica para realizar la compra
  }
}