  interface Tarjeta {
  numero_tarjeta: string;
  titular: string;
  fecha_expiracion: string;
  cvv: string;
  [key: string]: string;
}
interface Direccion {
  calle: string;
  ciudad: string;
  provincia: string;
  codigo_postal: string;
  pais: string;
  [key: string]: string;  // <-- firma de índice para acceder dinámicamente
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadoService } from '../service/empleado.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})

export class EditarPerfilComponent implements OnInit {

  fotoPerfil: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  usuarioId: string = '';

  direcciones: any[] = [];
  tarjetas: any[] = [];

  direccionSeleccionada: any = null;
  tarjetaSeleccionada: any = null;

  nuevaDireccion: Direccion = {
  calle: '',
  ciudad: '',
  provincia: '',
  codigo_postal: '',
  pais: ''
};

 nuevaTarjeta: Tarjeta = {
    numero_tarjeta: '',
    titular: '',
    fecha_expiracion: '',
    cvv: ''
  };

  successMessage: string = '';
  errorMessage: string = '';
  successMessagePassword: string = '';
  errorMessagePassword: string = '';
  successMessageDireccion: string = '';
  errorMessageDireccion: string = '';
  successMessageTarjeta: string = '';
  errorMessageTarjeta: string = '';

  editandoDireccion: any = null;
  editandoTarjeta: any = null;

  errores: any = {};
  erroresDireccion: any = {};
  erroresTarjeta: any = {};

  constructor(
    private router: Router,
    private serviceE: EmpleadoService
  ) {}

  ngOnInit(): void {
    this.fotoPerfil = localStorage.getItem('Foto_Perfil') || '';
    this.usuarioId = localStorage.getItem('userId') || '';
    this.cargarDirecciones();
    this.cargarTarjetas();
  }

  // Validación foto perfil
  validarFotoPerfil(): void {
    if (!this.fotoPerfil.trim()) {
      this.errores.fotoPerfil = 'La foto de perfil no puede estar vacía.';
    } else {
      this.errores.fotoPerfil = '';
    }
  }

  onSubmitPerfil(): void {
    this.validarFotoPerfil();
    if (this.errores.fotoPerfil) return;

    const perfilData = {
      userId: this.usuarioId,
      fotoPerfil: this.fotoPerfil
    };
    this.serviceE.actualizarPerfil(perfilData).subscribe(
      res => {
        if (res.success) {
          this.successMessage = "Perfil actualizado correctamente";
          localStorage.setItem('Foto_Perfil', this.fotoPerfil);
          window.location.reload();
        } else {
          this.errorMessage = res.error;
        }
      },
      () => this.errorMessage = "Error al actualizar el perfil."
    );
  }

  onSubmitPassword(): void {
    this.errorMessagePassword = '';
    this.successMessagePassword = '';

    if (!this.newPassword.trim() || !this.confirmPassword.trim()) {
      this.errorMessagePassword = "Las contraseñas no pueden estar vacías.";
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessagePassword = "Las contraseñas no coinciden.";
      return;
    }
    const data = {
      userId: this.usuarioId,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };
    this.serviceE.actualizarContrasena(data).subscribe(
      res => {
        if (res.success) {
          this.successMessagePassword = "Contraseña actualizada.";
        } else {
          this.errorMessagePassword = res.error;
        }
      },
      () => this.errorMessagePassword = "Error al actualizar la contraseña."
    );
  }

  // ---------------- DIRECCIONES ----------------

  cargarDirecciones(): void {
    this.serviceE.verDireccionesPorUsuario(this.usuarioId).subscribe(res => {
      this.direcciones = res?.Direcciones || [];
    });
  }

  validarCampoDireccion(campo: string): void {
    if (!this.nuevaDireccion[campo]?.trim()) {
      this.erroresDireccion[campo] = `El campo ${campo} es obligatorio.`;
    } else {
      this.erroresDireccion[campo] = '';
    }
  }

  validarDireccionCompleta(): boolean {
    let valid = true;
    for (const campo of ['calle','ciudad','provincia','codigo_postal','pais']) {
      if (!this.nuevaDireccion[campo]?.trim()) {
        this.erroresDireccion[campo] = `El campo ${campo} es obligatorio.`;
        valid = false;
      } else {
        this.erroresDireccion[campo] = '';
      }
    }
    return valid;
  }

  onAgregarDireccion(): void {
    this.errorMessageDireccion = '';
    this.successMessageDireccion = '';
    if (!this.validarDireccionCompleta()) {
      return;
    }

    const body = { ...this.nuevaDireccion, id_usuario: this.usuarioId };
    this.serviceE.crearDireccion(body).subscribe({
      next: () => {
        this.successMessageDireccion = 'Dirección guardada.';
        this.errorMessageDireccion = '';
        this.nuevaDireccion = { calle: '', ciudad: '', provincia: '', codigo_postal: '', pais: '' };
        this.cargarDirecciones();
      },
      error: () => this.errorMessageDireccion = 'Error al guardar la dirección.'
    });
  }

  editarDireccion(d: any): void {
    this.editandoDireccion = { ...d };
  }

  guardarEdicionDireccion(): void {
    if (!this.editandoDireccion) return;
    const { calle, ciudad, provincia, codigo_postal, pais } = this.editandoDireccion;
    if (!calle.trim() || !ciudad.trim() || !provincia.trim() || !codigo_postal.trim() || !pais.trim()) {
      alert('Por favor, rellena todos los campos de la dirección antes de guardar.');
      return;
    }

    const data = { ...this.editandoDireccion, id_usuario: this.usuarioId };
    this.serviceE.editarDireccion(data).subscribe({
      next: () => {
        this.editandoDireccion = null;
        this.cargarDirecciones();
      },
      error: () => alert('Error al editar dirección.')
    });
  }

  cancelarEdicionDireccion(): void {
    this.editandoDireccion = null;
  }

  eliminarDireccion(id: number): void {
    this.serviceE.eliminarDireccion(id).subscribe(() => this.cargarDirecciones());
  }

  // ---------------- TARJETAS ----------------

  cargarTarjetas(): void {
    this.serviceE.verTarjetasPorUsuario(this.usuarioId).subscribe(res => {
      this.tarjetas = res?.Tarjetas || [];
    });
  }

  validarCampoTarjeta(campo: string): void {
    if (!this.nuevaTarjeta[campo]?.trim()) {
      this.erroresTarjeta[campo] = `El campo ${campo} es obligatorio.`;
    } else {
      this.erroresTarjeta[campo] = '';
    }
  }

  validarTarjetaCompleta(): boolean {
    let valid = true;
    for (const campo of ['numero_tarjeta','titular','fecha_expiracion','cvv']) {
      if (!this.nuevaTarjeta[campo]?.trim()) {
        this.erroresTarjeta[campo] = `El campo ${campo} es obligatorio.`;
        valid = false;
      } else {
        this.erroresTarjeta[campo] = '';
      }
    }
    return valid;
  }

  onAgregarTarjeta(): void {
    this.errorMessageTarjeta = '';
    this.successMessageTarjeta = '';
    if (!this.validarTarjetaCompleta()) {
      return;
    }

    const body = { ...this.nuevaTarjeta, id_usuario: this.usuarioId };
    this.serviceE.crearTarjeta(body).subscribe({
      next: () => {
        this.successMessageTarjeta = 'Tarjeta guardada.';
        this.errorMessageTarjeta = '';
        this.nuevaTarjeta = { numero_tarjeta: '', titular: '', fecha_expiracion: '', cvv: '' };
        this.cargarTarjetas();
      },
      error: () => this.errorMessageTarjeta = 'Error al guardar la tarjeta.'
    });
  }

  editarTarjeta(t: any): void {
    this.editandoTarjeta = { ...t };
  }

  guardarEdicionTarjeta(): void {
    if (!this.editandoTarjeta) return;
    const { numero_tarjeta, titular, fecha_expiracion, cvv } = this.editandoTarjeta;
    if (!numero_tarjeta.trim() || !titular.trim() || !fecha_expiracion.trim() || !cvv.trim()) {
      alert('Por favor, rellena todos los campos de la tarjeta antes de guardar.');
      return;
    }

    const data = { ...this.editandoTarjeta, id_usuario: this.usuarioId };
    this.serviceE.editarTarjeta(data).subscribe({
      next: () => {
        this.editandoTarjeta = null;
        this.cargarTarjetas();
      },
      error: () => alert('Error al editar tarjeta.')
    });
  }

  cancelarEdicionTarjeta(): void {
    this.editandoTarjeta = null;
  }

  eliminarTarjeta(id: number): void {
    this.serviceE.eliminarTarjeta(id).subscribe(() => this.cargarTarjetas());
  }
}
