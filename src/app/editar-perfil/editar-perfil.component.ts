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
  

  // Variables para actualizar la contraseña
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  
  // Mensajes de éxito y error
  successMessage: string = '';
  errorMessage: string = '';
  successMessagePassword: string = '';
  errorMessagePassword: string = '';

  constructor(private router: Router, private serviceE: EmpleadoService) { }

  ngOnInit(): void {
    this.fotoPerfil = localStorage.getItem('Foto_Perfil') || '';
  }

  // Método para actualizar el perfil
  onSubmitPerfil(): void {
    const perfilData = {
      userId: localStorage.getItem('userId'),
      fotoPerfil: this.fotoPerfil
    };

    this.serviceE.actualizarPerfil(perfilData).subscribe(
      respuesta => {
        if (respuesta.success) {
          this.successMessage = "Perfil actualizado correctamente";
          this.errorMessage = '';
          localStorage.setItem('Foto_Perfil', this.fotoPerfil)
          window.location.reload();
        } else {
          this.successMessage = '';
          this.errorMessage = respuesta.error;
        }
      },
      error => {
        this.successMessage = '';
        this.errorMessage = "Error al actualizar el perfil. Intenta más tarde.";
      }
    );
  }

  // Método para actualizar la contraseña
  onSubmitPassword(): void {
 
    // Validación para que las contraseñas nuevas coincidan y no estén vacías
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessagePassword = "Las contraseñas no pueden estar vacías.";
      this.successMessagePassword = '';
      return;
    }
  
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessagePassword = "Las contraseñas no coinciden.";
      this.successMessagePassword = '';
      return;
    }
    // Objeto que contiene la información de la contraseña y el ID del usuario
    const passwordData = {
      userId: localStorage.getItem('userId'),  // Usar ID del usuario almacenado
      currentPassword: this.currentPassword,   // La contraseña actual puede ser cualquier cosa
      newPassword: this.newPassword
    };
   
    // Llamada al servicio para actualizar la contraseña
    this.serviceE.actualizarContrasena(passwordData).subscribe(
      respuesta => {
        // Si la respuesta es exitosa
        if (respuesta.success) {
          this.successMessagePassword = "Contraseña actualizada correctamente.";
          this.errorMessagePassword = '';
        } else {
          // Si ocurre un error
          this.successMessagePassword = '';
          this.errorMessagePassword = respuesta.error;
        }
      },
      error => {
        // En caso de error en la conexión o en el servidor
        this.successMessagePassword = '';
        this.errorMessagePassword = "Error al actualizar la contraseña. Intenta más tarde.";
      }
    );
  }
}
