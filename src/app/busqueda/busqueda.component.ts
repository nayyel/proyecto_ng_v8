import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadoService } from '../service/empleado.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {
  libros: any[] = [];
  categorias: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private empleadoService: EmpleadoService) { }

  ngOnInit(): void {
    const loggedInFromLogin = localStorage.getItem('loggedInFromLogin');
    if (loggedInFromLogin !== 'true') {
      this.router.navigate(['/empleado']);
    }
    window.addEventListener('message', this.receiveMessage.bind(this), false);
  }

  receiveMessage(event: MessageEvent) {
    if (event.data) {
      this.libros = event.data.Libros;
      this.categorias = event.data.Categorias;
      this.renderResults();
    }
  }

  renderResults(): void {
    let noBusqueda = document.getElementById("noBusca");
    if (noBusqueda) {
        noBusqueda.innerHTML = '';

        this.categorias.forEach((categoria: { nombre_categoria: any; id_categoria: any; }) => {
            let categoriaDiv = document.createElement('div');
            categoriaDiv.classList.add('categoria'); // Agrega la clase 'categoria' al div de categoría
            categoriaDiv.innerHTML = `<h3>Categoría ${categoria.nombre_categoria}</h3>`;

            const librosPorCategoria = this.libros.filter(libro => libro.id_categoria === categoria.id_categoria).slice(0, 5);

            let librosDiv = document.createElement('div');
            librosDiv.setAttribute("style", "display: flex; flex-direction: row; align-items: baseline;");

            librosPorCategoria.forEach(libro => {
                let tituloHtml = ''; 
                let tituloCortado = libro.titulo.match(/.{1,13}/g); // Divide el título en segmentos de máximo 13 caracteres
                tituloCortado.forEach((segmento: string) => {
                    tituloHtml += segmento + '<br>';
                });
                const libroDiv = document.createElement('div');
                libroDiv.classList.add('libro'); // Agrega la clase 'libro' al div de cada libro
                libroDiv.innerHTML = `<a href="/libro/${libro.id_libro}" target="_top"><img src="${libro.link}" width="100px"></a><br><span class="titulo">${tituloHtml}</span><br><span class="autor">${libro.autor}</span>`;
                librosDiv.appendChild(libroDiv);
            });

            categoriaDiv.appendChild(librosDiv);
            noBusqueda.appendChild(categoriaDiv);
        });
    } else {
        console.error("Elemento con ID 'noBusca' no encontrado");
    }
}



}
