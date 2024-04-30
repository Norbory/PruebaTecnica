import { Component, OnInit } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { Entity } from './core/types/entity';
import { NgFor, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EmpresaService } from './core/services/empresa.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FooterComponent, NgFor, NgIf, ReactiveFormsModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  constructor(private _empresaService: EmpresaService) { }

  ngOnInit() {
    this.getAllEmpresas();
  }

  listEntity: Entity[] = [];

  // Obtener todas las empresas de la base de datos
  getAllEmpresas() {
    this._empresaService.getAllEmpresas().subscribe(
      response => {
        this.listEntity = response;
        console.log(this.listEntity);
        console.log(this.totalPages);
      },
      error => {
        console.log(error);
    });
  }

  selectedEmpresa = {} as Entity;
  visible: boolean = false;
  able: boolean = false;
  submitted: boolean = false;
  edited: boolean = false;
  deleted: boolean = false;
  pageSize = 3;
  currentPage = 0;

  totalPages = this.listEntity.length / this.pageSize;

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

  // Petición para obtener crear una empresa
  agregarEmpresa() {
    const empresa: Entity = {
      Id: 0,
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
    this._empresaService.createEmpresa(empresa).subscribe(
      response => {
        this.listEntity.push(response);
        setTimeout(() => {
          this.submitted = false;
        }, 3000);
        this.submitted = true;
        this.form.reset();
      },
      error => {
        console.log(error);
    });  
  }

  // Petición para obtener una empresa por id
  verEmpresa(id: number) {
    this._empresaService.getEmpresaById(id).subscribe(
      response => {
        this.selectedEmpresa = response;
        let dia = new Date(response.FechaEdicion);
        this.form.setValue({
          Razon: response.Razon,
          NombreEmpresa: response.NombreEmpresa,
          IdentificacionFiscal: response.IdentificacionFiscal,
          NumeroTelefono: response.NumeroTelefono,
          CorreoElectronico: response.CorreoElectronico,
          SitioWeb: response.SitioWeb,
          Direccion: response.Direccion,
          Pais: response.Pais,
          Facturacion: response.Facturacion,
          FechaEdicion: dia,
        });
        this.visible  = true;
        if (this.able) {
          this.able = false;
        }
        this.form.disable();
      },
      error => {
        console.log(error);
    });
  }

  // Habilitar formulario para editar empresa
  habilitarFormulario() {
    this.able = true;
    this.form.enable();
  }

  // Petición para actualizar una empresa
  editarEmpresa(index: number) {
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
        Id: 0
      };
      this._empresaService.updateEmpresa(index, empresa).subscribe(
        response => {
          this.listEntity[index] = response;
          this.able = false;
          setTimeout(() => {
            this.edited = false;
          }, 3000);
          this.edited = true;
          this.visible = false;
          this.form.reset();
        },
        error => {
          console.log(error);
      });
    } else {
      alert('No se encontró la empresa');
    }
  }

  eliminarEmpresa(index: number) {
    if (this.selectedEmpresa) {
      this._empresaService.deleteEmpresa(index).subscribe(
        response => {
          this.listEntity.splice(index, 1);
          this.able = false;
          setTimeout(() => {
            this.deleted = false;
          }, 3000);
          this.deleted = true;
          this.visible = false;
          this.form.reset();
        },
        error => {
          console.log(error);
      });
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

  nextPage() {
    this.currentPage++;
  }
  
  previousPage() {
    this.currentPage--;
  }
}
