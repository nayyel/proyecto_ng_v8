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
   usuario?: {
    nombre: string;
    correo: string;
  }; 
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

generatePDF(venta: Venta) {
  this.getBase64ImageFromURL('assets/images/logolibreria.png').then(logoBase64 => {
    const doc = new jsPDF();
    let y = 15;

    //  Logo
    doc.addImage(logoBase64, 'PNG', 120, 10, 25, 25); // x, y, ancho, alto

    //  Encabezado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Librería Libera', 10, y);
    y += 7;

    doc.setFontSize(11);
    doc.text('Centro Comercial La Vaguada', 10, y);
    y += 5;
    doc.text('Av. de Monforte de Lemos, 36, 28029 Madrid, España', 10, y);
    y += 10;

    doc.setDrawColor(180);
    doc.line(10, y, 200, y);
    y += 10;

    //  Info de venta
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text(`Factura - Venta Nº ${venta.id_venta}`, 10, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Fecha: ${venta.fecha}`, 10, y);
    y += 10;

    //  Datos del cliente
    if (venta.usuario?.nombre) {
      doc.text(`Cliente: ${venta.usuario.nombre}`, 10, y);
      y += 6;
    }
    if (venta.usuario?.correo) {
      doc.text(`Email: ${venta.usuario.correo}`, 10, y);
      y += 6;
    }
    if (venta.direccion) {
      doc.text(`Dirección: ${venta.direccion}`, 10, y);
      y += 6;
    }
    if (venta.tarjeta) {
      // Anonimizar tarjeta: mostrar solo los últimos 4 dígitos
      const last4 = venta.tarjeta.slice(-4);
      doc.text(`Tarjeta: **** **** **** ${last4}`, 10, y);
      y += 6;
    }
    
    // Espacio extra después de datos del cliente
    y += 4;

    // 🛍️ Detalles de la compra
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(`Detalles de la compra:`, 10, y);
    y += 8;

    venta.libros.forEach((libro, index) => {
      const precio = Number(libro.precio);
      const subtotal = precio * Number(libro.cantidad);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${libro.titulo}`, 10, y, { maxWidth: 190 });
      y += 6;

      doc.text(`Unidades: ${libro.cantidad}`, 15, y);
      doc.text(`Precio unidad: ${precio.toFixed(2)} €`, 70, y);
      doc.text(`Subtotal: ${subtotal.toFixed(2)} €`, 150, y, { align: 'right' });
      y += 8;

      doc.setDrawColor(230);
      doc.line(10, y, 200, y);
      y += 5;

      // Verificar si es necesario agregar salto de página
      if (y > 250) {
        this.agregarFooter(doc);
        doc.addPage();
        y = 15;
      }
    });

    //  Total
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(80, 0, 0);
    doc.text(`Total venta: ${Number(venta.total).toFixed(2)} €`, 10, y);

    //  Pie de página (Footer)
    this.agregarFooter(doc);

    doc.save(`factura_venta_${venta.id_venta}.pdf`);
  }).catch(err => {
    console.error('Error al cargar el logo:', err);
  });
}

getBase64ImageFromURL(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject('Error al obtener el contexto del canvas');
      }
    };
    img.onerror = (error) => reject(error);
  });
}

agregarFooter(doc: jsPDF) {
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont('helvetica', 'italic');
  doc.text(
    'Gracias por su compra. ¡Esperamos verlo pronto en Librería Libera!',
    105,
    pageHeight - 10,
    { align: 'center' }
  );
}
}
