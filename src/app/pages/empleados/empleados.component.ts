import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadoService } from '../../service/empleado.service';
import { CarritoService } from '../../service/carrito.service';
@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {
  passwd: string = '';
  user: string = '';
  
  //Variables Registro Abajo
  user_reg: string = '';
  pass_reg: string = '';
  pass_reg2: string = '';
  correo_reg: string = '';
  
  constructor(private router: Router, private serviceE: EmpleadoService,    private carritoService: CarritoService) { }

  ngOnInit(): void {
    localStorage.setItem('loggedInFromLogin', 'false');
        localStorage.setItem('admin', 'false');
                this.carritoService.vaciarCarrito(); // Vaciar carrito desde servicio
  }

  onSubmit(): void {
    const empleado = {
      nombre: this.user,
      password: this.passwd,
    };

    this.serviceE.Showempleado(empleado).subscribe(
      respuesta => {
        if (respuesta.exito) {
          // Guardar la URL de la foto de perfil en localStorage
          //localStorage.setItem('Foto_Perfil', respuesta.Foto_Perfil);  // Si no hay foto, guarda una cadena vacía
          localStorage.setItem('userId', respuesta.id_usuario);
          localStorage.setItem('loggedInFromLogin', 'true');          
      
          localStorage.setItem('Foto_Perfil', respuesta.Foto_Perfil);
  
          if(respuesta.rol == 'admin') {
              localStorage.setItem('admin', 'true');
            this.router.navigate(['/administracion']);
              
          } else {
            this.router.navigate(['/categoria']);
          }
        } else {
          // Mostrar mensaje de error en caso de que las credenciales sean incorrectas
          let texto = document.querySelector('.login-form .text-danger') as HTMLElement;
          if (texto) {
            texto.textContent = respuesta.mensaje;
            setTimeout(() => {
              texto.textContent = "";
            }, 4000);
          }
        }
      },
      error => {
        // Manejo de errores no relacionados con la autenticación (como problemas de red)
        let texto = document.querySelector('.login-form .text-danger') as HTMLElement;
        if (texto) {
          texto.textContent = "Error del servidor. Inténtalo de nuevo más tarde.";
          setTimeout(() => {
            texto.textContent = "";
          }, 4000);
        }
      }
    );
  }

  crearEmpleado(): void {
    // Verificar si las contraseñas coinciden
    if (this.pass_reg !== this.pass_reg2) {
      let textoError = document.querySelector('.signup-form .text-danger') as HTMLElement;
      if (textoError) {
        textoError.textContent = "Las contraseñas no coinciden.";
      }
      setTimeout(() => {
        textoError.textContent = "";
      }, 4000);
      return; // Salir de la función si las contraseñas no coinciden
    }

    const empleado = {
      nombre: this.user_reg,
      password: this.pass_reg,
      correo: this.correo_reg,
      rol: "usuario"
    };

    this.serviceE.CrearEmpleado(empleado).subscribe(
      respuesta => {
        let texto2 = document.querySelector('.signup-form .text-success') as HTMLElement;
        let textoError = document.querySelector('.signup-form .text-danger') as HTMLElement;

        if (respuesta.hasOwnProperty("error")) {
          if (textoError) {
            textoError.textContent = respuesta.error;
          }
          setTimeout(() => {
            textoError.textContent = "";
          }, 4000);
        } else {
          if (texto2) {
            texto2.textContent = "Usuario creado exitosamente.";
          }
          setTimeout(() => {
            texto2.textContent = "";
          }, 4000);
        }
      },
      error => {
        let textoError = document.querySelector('.signup-form .text-danger') as HTMLElement;
        if (textoError) {
          textoError.textContent = "Error al crear el usuario. Inténtelo de nuevo.";
        }
        setTimeout(() => {
          textoError.textContent = "";
        }, 4000);
      }
    );

    this.user_reg = '';
    this.pass_reg = '';
    this.pass_reg2 = '';
    this.correo_reg = '';
  }
}
