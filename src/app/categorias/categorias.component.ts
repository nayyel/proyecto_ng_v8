import { Component, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadoService } from '../service/empleado.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit, OnDestroy {

  categorias: any[] = [];
  libros: any[] = [];

  constructor(private router: Router, private serviceE: EmpleadoService, private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    const loggedInFromLogin = localStorage.getItem('loggedInFromLogin');
    if (loggedInFromLogin !== 'true') {
      this.router.navigate(['/empleado']);
    }
    this.renderer.addClass(this.document.body, 'categoria-pagina');
    this.mostrarCategorias();
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'categoria-pagina');
  }
// Este metodo imprime los containers de cada categoría y añade su css
  mostrarCategorias(): void {
    this.serviceE.VerCategorias().subscribe((response: any) => {
      this.categorias = response.Categorias;
    });
  }
// Este metodo imprime los containers de cada libro y añade su css
  MostrarDiv(id_categoria: number): void {
    this.serviceE.VerLibros().subscribe(response => {
      this.libros = response.Libros.filter((libro: any) => libro.id_categoria === id_categoria);
    });
  }
}
