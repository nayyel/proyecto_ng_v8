import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpleadoService } from '../service/empleado.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.css'] // Corrección aquí
})
export class LibrosComponent implements OnInit { 

  libros: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private serviceE: EmpleadoService) { }

  ngOnInit(): void {
    const loggedInFromLogin = localStorage.getItem('loggedInFromLogin');
    if (loggedInFromLogin !== 'true') {
      this.router.navigate(['/empleado']);
    }

    this.route.params.subscribe(params => {
      const libroId = params['id_libro'];
      this.MostrarLibro(libroId);
    });
  }

  // Metodo para mostrar el libro con el botón de compra
  MostrarLibro(libroId: number): void {
    this.serviceE.VerLibros().subscribe(response => {
      this.libros = response.Libros;
      let libroDiv = document.getElementById("verlibro");

      if (libroDiv) {
        libroDiv.innerHTML = `
        <style>
          .libro {
            background-color: #eaddca;
            border-radius: 15px;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
            transition: 0.3s;
            width: 90%;
            margin-top:15vh;
          }

          .libro:hover {
            box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
          }

          .libro img {
            border-radius: 5px 5px 0 0;
            width: 20%;
            height: 40vh;
            margin-left:28vw;
          }

          #Titulo {
            color: #8B4513;
            font-size: 22px;
            text-align: center;
            padding: 10px;
          }

          #Autor, #Resumen, #precio, #stock {
            color: #A0522D;
            padding: 2px 16px;
          }

          #Autor:hover, #Resumen:hover, #precio:hover, #stock:hover {
            background-color: #987a6b;
            transition: background-color 0.5s ease;
            color:white;
          }
          
          .btn-comprar {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            text-align: center;
            display: block;
            margin: 10px auto;
          }

          .btn-comprar:hover {
            background-color: #45a049;
          }
        </style>`;

        for (let i = 0; i < this.libros.length; i++) {
          if (this.libros[i].id_libro == libroId) {
            libroDiv.innerHTML += `
            <div class='libro' id='${this.libros[i].id_libro}'>
              <img src='${this.libros[i].link}' alt='${this.libros[i].titulo}'>
              <h2 id="Titulo">${this.libros[i].titulo}</h2>
              <p id="Autor">Autor: ${this.libros[i].autor}</p>
              <p id="Resumen">Resumen: ${this.libros[i].resumen}</p>
              <p id="precio">Precio: ${this.libros[i].precio}€</p>  
              <p id="stock">Stock: ${this.libros[i].stock} Unidades</p>
              <button class="btn-comprar" onclick="comprarLibro(${this.libros[i].id_libro})">Comprar</button>
            </div><br>`;
            break;
          }
        }
      }
    });
  }

  // Función de compra
  comprarLibro(libroId: number): void {
    console.log(`Libro con ID ${libroId} comprado.`);
    // Aquí puedes agregar más lógica para manejar el proceso de compra, como redirigir a una página de pago, agregar al carrito, etc.
  }
}
