import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadoService } from '../service/empleado.service';
import { CarritoService } from '../service/carrito.service';

@Component({
  selector: 'app-pasarela',
  templateUrl: './pasarela.component.html',
  styleUrls: ['./pasarela.component.css']
})
export class PasarelaComponent implements OnInit {
  compra: any;
  usuarioId: string = '';

  direcciones: any[] = [];
  tarjetas: any[] = [];

  direccionSeleccionada: any = null;
  tarjetaSeleccionada: any = null;

  mostrarAgregarDireccion: boolean = false;
  mostrarAgregarTarjeta: boolean = false;

  nuevaDireccion = {
    calle: '',
    ciudad: '',
    provincia: '',
    codigo_postal: '',
    pais: ''
  };

  nuevaTarjeta = {
    numero_tarjeta: '',
    titular: '',
    fecha_expiracion: '',
    cvv: ''
  };

  errorMensajeDireccion: string = '';
  successMensajeDireccion: string = '';

  errorMensajeTarjeta: string = '';
  successMensajeTarjeta: string = '';

  errorMensajeCompra: string = '';
  successMensajeCompra: string = '';

  constructor(
    private router: Router,
    private empleadoService: EmpleadoService,
    private carritoService: CarritoService
  ) {
    const nav = this.router.getCurrentNavigation();
    this.compra = nav?.extras?.state?.['compra'];
  }

  ngOnInit(): void {
    this.usuarioId = localStorage.getItem('userId') || '';
    this.cargarDirecciones();
    this.cargarTarjetas();
  }

  cargarDirecciones(): void {
    this.empleadoService.verDireccionesPorUsuario(this.usuarioId).subscribe(res => {
      this.direcciones = res?.Direcciones || [];
    });
  }

  cargarTarjetas(): void {
    this.empleadoService.verTarjetasPorUsuario(this.usuarioId).subscribe(res => {
      this.tarjetas = res?.Tarjetas || [];
    });
  }

  agregarDireccion(): void {
    this.errorMensajeDireccion = '';
    this.successMensajeDireccion = '';

    const { calle, ciudad, provincia, codigo_postal, pais } = this.nuevaDireccion;
    if (!calle.trim() || !ciudad.trim() || !provincia.trim() || !codigo_postal.trim() || !pais.trim()) {
      this.errorMensajeDireccion = 'Por favor, rellena todos los campos de la dirección.';
      return;
    }

    const body = { ...this.nuevaDireccion, id_usuario: this.usuarioId };
    this.empleadoService.crearDireccion(body).subscribe({
      next: () => {
        this.successMensajeDireccion = 'Dirección guardada.';
        this.nuevaDireccion = {
          calle: '',
          ciudad: '',
          provincia: '',
          codigo_postal: '',
          pais: ''
        };
        this.mostrarAgregarDireccion = false;
        this.cargarDirecciones();
      },
      error: () => this.errorMensajeDireccion = 'Error al guardar la dirección.'
    });
  }

  agregarTarjeta(): void {
    this.errorMensajeTarjeta = '';
    this.successMensajeTarjeta = '';

    const { numero_tarjeta, titular, fecha_expiracion, cvv } = this.nuevaTarjeta;
    if (!numero_tarjeta.trim() || !titular.trim() || !fecha_expiracion.trim() || !cvv.trim()) {
      this.errorMensajeTarjeta = 'Por favor, rellena todos los campos de la tarjeta.';
      return;
    }

    const body = { ...this.nuevaTarjeta, id_usuario: this.usuarioId };
    this.empleadoService.crearTarjeta(body).subscribe({
      next: () => {
        this.successMensajeTarjeta = 'Tarjeta guardada.';
        this.nuevaTarjeta = {
          numero_tarjeta: '',
          titular: '',
          fecha_expiracion: '',
          cvv: ''
        };
        this.mostrarAgregarTarjeta = false;
        this.cargarTarjetas();
      },
      error: () => this.errorMensajeTarjeta = 'Error al guardar la tarjeta.'
    });
  }

  confirmarCompra(): void {
    this.errorMensajeCompra = '';
    this.successMensajeCompra = '';

    if (!this.direccionSeleccionada || !this.tarjetaSeleccionada) {
      this.errorMensajeCompra = 'Selecciona una dirección y una tarjeta antes de finalizar.';
      return;
    }
    const direccionTexto = `${this.direccionSeleccionada.calle}, ${this.direccionSeleccionada.ciudad}, ${this.direccionSeleccionada.pais}`;
    const ultimos2 = this.tarjetaSeleccionada.numero_tarjeta.slice(-2);
    const tarjetaTexto = `****${ultimos2} - ${this.tarjetaSeleccionada.titular}`;

    const datosCompraFinal = {
      carrito: this.compra.carrito,
      total: this.compra.total,
      id_usuario: this.usuarioId,
      direccion_texto: direccionTexto,
      tarjeta_texto: tarjetaTexto
    };

    this.carritoService.procesarCompra(datosCompraFinal).subscribe(
      response => {
        console.log('Compra procesada con éxito:', response, tarjetaTexto, direccionTexto);
        this.carritoService.vaciarCarrito(); // Vaciar carrito desde servicio
        this.successMensajeCompra = 'Compra realizada correctamente. ¡Gracias por tu pedido!';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      },
      error => {
        console.error('Error al procesar la compra:', error);
        this.errorMensajeCompra = 'Error al realizar la compra. Intenta más tarde.';
      }
    );
  }
}
