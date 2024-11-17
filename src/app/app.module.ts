import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CategoriasComponent } from './categorias/categorias.component';
import { LibrosComponent } from './libros/libros.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { InfoComponent } from './info/info.component';
import { AdminComponent } from './admin/admin.component';
import { EditarPerfilComponent } from './editar-perfil/editar-perfil.component';
import { HistorialComponent } from './historial/historial.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    EmpleadosComponent,
    CategoriasComponent,
    LibrosComponent,
    BusquedaComponent,
    InfoComponent,
    EditarPerfilComponent,
    AdminComponent,
    EditarPerfilComponent,
    HistorialComponent
    
  ],
  imports: [
    
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
