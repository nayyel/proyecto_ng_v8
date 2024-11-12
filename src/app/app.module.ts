import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { CarritoComponent } from './carrito/carrito.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    EmpleadosComponent,
    CategoriasComponent,
    LibrosComponent,
    BusquedaComponent,
    InfoComponent,
    AdminComponent,
    CarritoComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
