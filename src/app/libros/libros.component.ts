import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpleadoService } from '../service/empleado.service';
import { Router } from '@angular/router';
import { CarritoService } from '../service/carrito.service';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.css']
})
export class LibrosComponent implements OnInit {

  libros: any[] = [];
  libroId: number = 0;

  nuevaValoracion = {
    ID_usuario: 0,
    ID_libro: 0,
    valoracion: 0,
    comentario: ''
  };

  valoracionesLibro: any[] = [];

  constructor(
    private router: Router,
    private carritoService: CarritoService,
    private route: ActivatedRoute,
    private serviceE: EmpleadoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id_libro']) {
        this.libroId = +params['id_libro'];
        this.MostrarLibro();
        this.cargarValoraciones();  // Llamamos a cargarValoraciones() cuando se tiene el ID del libro
      } else {
        console.log('No se encontró el parámetro id_libro en la URL');
      }
    });
  }

  MostrarLibro(): void {
    this.serviceE.VerLibros().subscribe(response => {
      this.libros = response.Libros;
    });
  }

  get libroSeleccionado() {
    return this.libros.find(libro => libro.id_libro === this.libroId);
  }

  agregarAlCarrito(libro: any): void {
    const cantidadActual = this.carritoService.obtenerCantidadEnCarrito(libro);
    if (cantidadActual < libro.stock) {
      this.carritoService.agregarAlCarrito(libro);
    } else {
      console.log('No se puede agregar más, el stock está agotado.');
    }
  }

  // Crear una nueva valoración
  crearValoracion(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("Tienes que iniciar sesión, picha.");
      return;
    }
  
    const datosParaEnviar = {
      ID_usuario: parseInt(userId, 10),
      ID_libro: this.libroId,
      valoracion: this.nuevaValoracion.valoracion,
      comentario: this.nuevaValoracion.comentario
    };
  
    console.log('📝 Datos que se enviarán:', datosParaEnviar);
  
    // Usamos el nuevo método de actualización
    this.serviceE.actualizarValoracion(datosParaEnviar).subscribe(
      res => {
        console.log("Valoración actualizada:", res);
        this.nuevaValoracion.valoracion = 0;
        this.nuevaValoracion.comentario = '';
        this.cargarValoraciones();
      },
      err => {
        console.error("Error al actualizar valoración:", err);
        alert("Algo ha ido mal al actualizar tu comentario");
      }
    );
  }
  // Método para cargar las valoraciones del libro
  tieneComentario: boolean = false;
  averageRating: number = 0;
  estrellasLlenas: number[] = [];
  mediaDecimal: boolean = false;
  estrellasVacias: number[] = [];
  // Modifica cargarValoraciones para verificar si el usuario tiene comentario
  cargarValoraciones(): void {
    const userId = localStorage.getItem('userId');
  
    this.serviceE.verValoracionesPorLibro(this.libroId).subscribe(
      res => {
        console.log("📦 Valoraciones cargadas:", res);
        this.valoracionesLibro = res.valoraciones || [];
  
        // Verificar si el usuario actual tiene comentario
        if (userId) {
          this.tieneComentario = this.valoracionesLibro.some(
            val => val.ID_usuario === parseInt(userId, 10)
          );
        }
  
        // Calcular media
        const total = this.valoracionesLibro.reduce((sum, val) => sum + val.Valoracion, 0);
        this.averageRating = this.valoracionesLibro.length ? total / this.valoracionesLibro.length : 0;
  
        // Calcular estrellas
        const llenas = Math.floor(this.averageRating);
        const decimal = this.averageRating % 1 >= 0.5;
        const vacias = 5 - llenas - (decimal ? 1 : 0);
  
        this.estrellasLlenas = Array(llenas).fill(0);
        this.mediaDecimal = decimal;
        this.estrellasVacias = Array(vacias).fill(0);
      },
      err => {
        console.error("❌ Error al cargar valoraciones:", err);
      }
    );
  }
  
  // Método para borrar comentario
  borrarComentario(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("Debes iniciar sesión para borrar comentarios.");
      return;
    }
  
    if (confirm("¿Estás seguro de que quieres borrar tu comentario?")) {
      this.serviceE.borrarValoracion(parseInt(userId, 10), this.libroId).subscribe(
        res => {
           
          this.tieneComentario = false;
          this.cargarValoraciones();
        },
        err => {
          alert("No se pudo borrar el comentario.");
        }
      );
    }
  }
}