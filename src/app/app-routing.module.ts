import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { LibrosComponent } from './libros/libros.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { InfoComponent } from './info/info.component';
import { AdminComponent } from './admin/admin.component';
import { HistorialComponent } from './historial/historial.component';
import { EditarPerfilComponent } from './editar-perfil/editar-perfil.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/categoria' }, // Página inicial redirige a CategoriasComponent
  { path: 'empleado', component: EmpleadosComponent },
  { path: 'editar-perfil', component: EditarPerfilComponent },
  { path: 'categoria', component: CategoriasComponent },
  { path: 'libro/:id_libro', component: LibrosComponent },  // Ruta para mostrar un libro específico
  { path: 'busqueda', component: BusquedaComponent },
  { path: 'info', component: InfoComponent },
  { path: 'categoria/:id_categoria', component: CategoriasComponent },
  { path: 'administracion', component: AdminComponent },
  { path: 'historial', component: HistorialComponent },
  { path: '**', redirectTo: '/categoria' } // Ruta por defecto para cualquier URL no encontrada
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
