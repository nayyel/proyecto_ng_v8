import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadoService } from '../service/empleado.service';
import { ChangeDetectorRef } from '@angular/core';
import jsPDF from 'jspdf';

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
  direccion?: string;
  tarjeta?: string;
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
      return;
    }

    this.empleadoService.cargarHistorialCompras({ userId: this.idUsuario }).subscribe({
      next: (response: any) => {
        console.log('Respuesta del servidor:', response);

        if (response.error) {
          console.error('Error del servidor:', response.error);
          return;
        }

        if (!response.detalles || !Array.isArray(response.detalles)) {
          console.error('La respuesta del servidor no tiene la estructura esperada.');
          return;
        }

        this.historialCompras = this.agruparPorVenta(response.detalles);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error en la petición HTTP:', err);
      }
    });
  }

  agruparPorVenta(detalles: any[]): Venta[] {
    const ventasAgrupadas: Venta[] = [];

    detalles.forEach((detalle: any) => {
      const ventaExistente = ventasAgrupadas.find(v => v.id_venta === detalle.id_venta);

      const libro: Libro = {
        id_libro: detalle.id_libro,
        titulo: detalle.titulo,
        link: detalle.link,
        cantidad: detalle.cantidad,
        precio: detalle.precio
      };

      if (ventaExistente) {
        ventaExistente.libros.push(libro);

        if (!ventaExistente.direccion && detalle.direccion_texto) {
          ventaExistente.direccion = detalle.direccion_texto;
        }

        if (!ventaExistente.tarjeta && detalle.tarjeta_texto) {
          ventaExistente.tarjeta = detalle.tarjeta_texto;
        }
      } else {
        ventasAgrupadas.push({
          id_venta: detalle.id_venta,
          fecha: detalle.fecha,
          total: detalle.total,
          direccion: detalle.direccion_texto || 'Sin dirección',
          tarjeta: detalle.tarjeta_texto || 'Sin tarjeta',
          libros: [libro]
        });
      }
    });

    return ventasAgrupadas;
  }

  generatePDF(venta: Venta): void {
    const doc = new jsPDF();
    let y = 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(`Factura - Venta Nº ${venta.id_venta}`, 10, y);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Fecha: ${venta.fecha}`, 10, y);
    y += 6;

    if (venta.direccion) {
      doc.text(`Dirección: ${venta.direccion}`, 10, y);
      y += 6;
    }

    if (venta.tarjeta) {
      doc.text(`Tarjeta: ${venta.tarjeta}`, 10, y);
      y += 6;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Detalles de la compra:`, 10, y);
    y += 10;

    venta.libros.forEach((libro, index) => {
      const precio = Number(libro.precio);
      const subtotal = precio * Number(libro.cantidad);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${libro.titulo}`, 10, y);
      y += 6;
      doc.text(`   Unidades: ${libro.cantidad}`, 10, y);
      y += 6;
      doc.text(`   Precio unidad: ${precio.toFixed(2)} €`, 10, y);
      y += 6;
      doc.text(`   Subtotal: ${subtotal.toFixed(2)} €`, 10, y);
      y += 10;
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`Total venta: ${Number(venta.total).toFixed(2)} €`, 10, y);

    doc.save(`factura_venta_${venta.id_venta}.pdf`);
  }
}
