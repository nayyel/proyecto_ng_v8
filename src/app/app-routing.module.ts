import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { LibrosComponent } from './libros/libros.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { InfoComponent } from './info/info.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/empleado' },
  { path: 'empleado', component: EmpleadosComponent },
  { path: 'categoria', component: CategoriasComponent },
  { path: 'libro/:id_libro', component: LibrosComponent },
  { path: 'busqueda', component: BusquedaComponent },
  { path: 'info', component: InfoComponent },
  { path: 'administracion', component: AdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
