import { Component } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { Entity } from './core/models/entity.interface';
import { NgFor, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as data from './data/entities.json';
import { NavbarComponent } from './components/navbar/navbar.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FooterComponent, NgFor, NgIf, ReactiveFormsModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor() { }
  title = 'Proveedores';
  listEntity: Entity[] = [];
  selectedEmpresa = {} as Entity;
  selectedIndex: number = 0;
  visible: boolean = false;
  able: boolean = false;
  submitted: boolean = false;
  edited: boolean = false;
  deleted: boolean = false;
  pageSize = 3;
  currentPage = 0;

  empresas = (data as any).default;

  totalPages = Math.round(this.empresas.length / this.pageSize);

  form = new FormGroup({
    Razon: new FormControl('', Validators.required),
    NombreEmpresa: new FormControl('', Validators.required),
    IdentificacionFiscal: new FormControl(0, Validators.required),
    NumeroTelefono: new FormControl(0, Validators.required),
    CorreoElectronico: new FormControl('', Validators.required),
    SitioWeb: new FormControl('', Validators.required),
    Direccion: new FormControl('', Validators.required),
    Pais: new FormControl('', Validators.required),
    Facturacion: new FormControl(0, Validators.required),
    FechaEdicion: new FormControl(new Date(), Validators.required),
  });

  nextPage() {
    this.currentPage++;
  }
  
  previousPage() {
    this.currentPage--;
  }

  verEmpresa(empresa: Entity) {
    this.visible  = true;
    if (this.able) {
      this.able = false;
    }
    this.selectedEmpresa = empresa;
    let dia = new Date(empresa.FechaEdicion);
    this.form.setValue({
      Razon: empresa.Razon,
      NombreEmpresa: empresa.NombreEmpresa,
      IdentificacionFiscal: empresa.IdentificacionFiscal,
      NumeroTelefono: empresa.NumeroTelefono,
      CorreoElectronico: empresa.CorreoElectronico,
      SitioWeb: empresa.SitioWeb,
      Direccion: empresa.Direccion,
      Pais: empresa.Pais,
      Facturacion: empresa.Facturacion,
      FechaEdicion: dia,
    });
    this.form.disable();
  }

  habilitarFormulario() {
    this.able = true;
    this.form.enable();
  }

  agregarEmpresa() {
    const empresa: Entity = {
      Razon: this.form.value.Razon || 'Razon',
      NombreEmpresa: this.form.value.NombreEmpresa || 'NombreEmpresa',
      IdentificacionFiscal: this.form.value.IdentificacionFiscal || 0,
      NumeroTelefono: this.form.value.NumeroTelefono || 0,
      CorreoElectronico: this.form.value.CorreoElectronico || 'CorreoElectronico',
      SitioWeb: this.form.value.SitioWeb || 'SitioWeb',
      Direccion: this.form.value.Direccion || 'Direccion',
      Pais: this.form.value.Pais || 'Pais',
      Facturacion: this.form.value.Facturacion || 0,
      FechaEdicion: this.form.value.FechaEdicion || new Date(),
    };
    this.empresas.push(empresa);
    setTimeout(() => {
      this.submitted = false;
    }, 3000);
    this.submitted = true;
    this.form.reset();
  }

  editarEmpresa() {
    if (this.selectedEmpresa) {
      const empresa: Entity = {
        Razon: this.form.value.Razon || 'Razon',
        NombreEmpresa: this.form.value.NombreEmpresa || 'NombreEmpresa',
        IdentificacionFiscal: this.form.value.IdentificacionFiscal || 0,
        NumeroTelefono: this.form.value.NumeroTelefono || 0,
        CorreoElectronico: this.form.value.CorreoElectronico || 'CorreoElectronico',
        SitioWeb: this.form.value.SitioWeb || 'SitioWeb',
        Direccion: this.form.value.Direccion || 'Direccion',
        Pais: this.form.value.Pais || 'Pais',
        Facturacion: this.form.value.Facturacion || 0,
        FechaEdicion: this.form.value.FechaEdicion || new Date(),
      };
      let index = this.empresas.indexOf(this.selectedEmpresa);
      this.empresas[index] = empresa;
      this.able = false;
      setTimeout(() => {
        this.edited = false;
      }, 3000);
      this.edited = true;
      this.visible = false;
      this.form.reset();
    } else {
      alert('No se encontró la empresa');
    }
  }

  eliminarEmpresa() {
    if (this.selectedEmpresa) {
      let index = this.empresas.indexOf(this.selectedEmpresa);
      this.empresas.splice(index, 1);
      this.able = false;
      setTimeout(() => {
        this.deleted = false;
      }, 3000);
      this.deleted = true;
      this.visible = false;
      this.form.reset();
    } else {
      alert('No se encontró la empresa');
    }
  }

  cancelar() {
    this.visible = false;
    this.able = false;
    this.form.enable();
    this.form.reset();
  }

  buscarEmpresa(nombre: string) {
    // Obtén la fila de la tabla con el nombre de la empresa
    let fila = document.getElementById("Empresa 1");
  
    // Haz scroll hasta la fila
    if (fila) {
      fila.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
