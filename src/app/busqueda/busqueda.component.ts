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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private empleadoService: EmpleadoService
  ) {}

  ngOnInit(): void {
    window.addEventListener('message', this.receiveMessage.bind(this), false);
  }

  receiveMessage(event: MessageEvent) {
    if (event.data) {
      this.libros = event.data.Libros || [];
      this.categorias = event.data.Categorias || [];
    }
  }

  librosPorCategoria(id_categoria: number): any[] {
    return this.libros.filter(libro => libro.id_categoria === id_categoria).slice(0, 5);
  }

  dividirTitulo(titulo: string): string[] {
    return titulo.match(/.{1,13}/g) || []; // Divide el título en segmentos de 13 caracteres
  }
}
