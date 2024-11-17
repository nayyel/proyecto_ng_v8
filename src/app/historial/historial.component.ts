import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadoService } from '../service/empleado.service';
import { ChangeDetectorRef } from '@angular/core';

// Definir las interfaces para los detalles de la compra
interface Libro {
  id_libro: number;
  titulo: string;
  link: string;
  cantidad: number;
  precio: number;
}

interface Venta {
  id_venta: number;
  fecha: string;
  total: number;
  libros: Libro[];
}

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})

export class HistorialComponent implements OnInit {

  historialCompras: Venta[] = [];
  idUsuario: string | null = localStorage.getItem('userId');
  
  constructor(
    private router: Router,
    private empleadoService: EmpleadoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  if (!this.idUsuario) {
    console.error("No se encontró el ID del usuario en localStorage");
    return; // Salir si no hay ID
  }

  this.empleadoService.cargarHistorialCompras({ userId: this.idUsuario }).subscribe((response: any) => {
    console.log('Respuesta del servidor:', response);  // Verifica si la respuesta tiene la estructura correcta

    if (!response || !response.detalles || !Array.isArray(response.detalles)) {
      console.error('La respuesta del servidor no tiene la estructura esperada.');
      return;
    }

    // Aseguramos que la respuesta es un arreglo de detalles
    const compras = response.detalles;

    // Agrupar por id_venta
    const ventas = this.agruparPorVenta(compras);
    console.log('Ventas agrupadas:', ventas);  // Muestra cómo quedaron agrupadas las ventas
    this.historialCompras = ventas;

    // Forzar la detección de cambios
    this.cdr.detectChanges();
  });
}

  // Método para agrupar las compras por id_venta
  agruparPorVenta(detalles: any[]): Venta[] {
    const ventasAgrupadas: Venta[] = []; // Ahora tiene un tipo explícito

    detalles.forEach((detalle: any) => {
      const ventaExistente = ventasAgrupadas.find(venta => venta.id_venta === detalle.id_venta);

      if (ventaExistente) {
        ventaExistente.libros.push(detalle);
      } else {
        ventasAgrupadas.push({
          id_venta: detalle.id_venta,
          fecha: detalle.fecha,
          total: detalle.total,
          libros: [detalle]  // Inicializa el array de libros
        });
      }
    });

    return ventasAgrupadas;
  }

  cargarHistorialCompras(): void {
    // Este método no está siendo usado, lo puedes eliminar si no lo necesitas
  }
}
