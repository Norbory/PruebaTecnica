import { Component, OnInit } from '@angular/core';
import { Entity } from './core/types/entity';
import { NgFor, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
// Componentes
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
// Consumo de API
import { EmpresaService } from './core/services/empresa.service';
import { ScreeningService } from './core/services/screening.service';
// Pipes para filtrar
import { NamePipePipe } from "./core/pipes/name-pipe.pipe";
import { PaisPipePipe } from "./core/pipes/pais-pipe.pipe";
import { TelefonoPipePipe } from "./core/pipes/telefono-pipe.pipe";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [FooterComponent, NgFor, NgIf, ReactiveFormsModule, NavbarComponent, NamePipePipe, FormsModule, PaisPipePipe, TelefonoPipePipe]
})
export class AppComponent implements OnInit{
  filtername: string = '';
  filterpais: string = '';
  filterTelefono: string = '';
  EmpresaBuscada: string = '';

  constructor(private _empresaService: EmpresaService, private _screeningService: ScreeningService) { }

  ngOnInit() {
    this.getAllEmpresas();
    this.grabarLocalStorage();
  }

  listEntity: Entity[] = [];
  pageSize = 5;
  currentPage = 1;
  totalPages = 0;
  opcionFilter: string = 'nombre';
  desplegar: boolean = false;
  opcionOrden: string = '';
  desplegarOrden: boolean = false;
  screening: boolean = false;
  modal: boolean = false;

  // Local storage
  // Este servira para los usuarios registrados para guardar su información y token
  grabarLocalStorage() {
    let email: string = "string@hotmail.com";
    let password: string = "str1_ng";
    let twoFactorCode: string = "123456";
    let twoFactorRecoveryCode: string = "123456";
    
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
    localStorage.setItem('twoFactorCode', twoFactorCode);
    localStorage.setItem('twoFactorRecoveryCode', twoFactorRecoveryCode);
  }
  // Obtener todas las empresas de la base de datos
  getAllEmpresas() {
    this._empresaService.getAllEmpresas().subscribe(
      response => {
        this.listEntity = response;
        const totalPages = Math.trunc(this.listEntity.length / this.pageSize)+1;
        this.totalPages = totalPages;
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
  status: number = 0;

  // Respuestas de screening
  //Offshore
  offshore = {
    "Entity": "",
    "Jurisdiction": "",
    "LinkedTo": "",
    "DataFrom": ""
  }
  //Ofac
  ofac = {
    "Name": "",
    "Address": "",
    "Type": "",
    "Program": "",
    "List": "",
    "Score": 0
  }
  //WorldBank
  worldBank = {
    "Name": "",
    "Address": "",
    "Country": "",
    "FromDate": "",
    "ToDate": "",
    "Grounds": ""
  }
  // Respuesta negativa
  negative: string = ""

  form = new FormGroup({
    id: new FormControl(0),
    Razon: new FormControl('', Validators.required),
    NombreEmpresa: new FormControl('', Validators.required),
    IdentificacionFiscal: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^\d+$/)]),
    NumeroTelefono: new FormControl('', [Validators.required, Validators.maxLength(9), Validators.minLength(9), Validators.pattern(/^\d+$/)]),
    CorreoElectronico: new FormControl('', [Validators.required, Validators.email]),
    SitioWeb: new FormControl('', [Validators.required, Validators.pattern(/^(http|https):\/\/[^ "]+$/)]),
    Direccion: new FormControl('', Validators.required),
    Pais: new FormControl('', Validators.required),
    Facturacion: new FormControl(0, Validators.required),
    FechaEdicion: new FormControl(new Date(), Validators.required),
  });

  // Petición para obtener crear una empresa
  agregarEmpresa() {
    const empresa: Entity = {
      id: 0,
      razon: this.form.value.Razon || 'Razon',
      nombreEmpresa: this.form.value.NombreEmpresa || 'NombreEmpresa',
      identificacionFiscal: Number(this.form.value.IdentificacionFiscal) || 12345678901,
      numeroTelefono: Number(this.form.value.NumeroTelefono) || 123456789,
      correoElectronico: this.form.value.CorreoElectronico || 'CorreoElectronico',
      sitioWeb: this.form.value.SitioWeb || 'SitioWeb',
      direccion: this.form.value.Direccion || 'Direccion',
      pais: this.form.value.Pais || 'Pais',
      facturacion: this.form.value.Facturacion || 0,
      fechaEdicion: this.form.value.FechaEdicion || new Date(),
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
        let dia = new Date(response.fechaEdicion);
        this.form.setValue({
          Razon: response.razon,
          NombreEmpresa: response.nombreEmpresa,
          IdentificacionFiscal: response.identificacionFiscal,
          NumeroTelefono: response.numeroTelefono,
          CorreoElectronico: response.correoElectronico,
          SitioWeb: response.sitioWeb,
          Direccion: response.direccion,
          Pais: response.pais,
          Facturacion: response.facturacion,
          FechaEdicion: dia,
          id: response.id
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
      const empresa: Entity = {
        razon: this.form.value.Razon || 'Razon',
        nombreEmpresa: this.form.value.NombreEmpresa || 'NombreEmpresa',
        identificacionFiscal: Number(this.form.value.IdentificacionFiscal) || 12345678901,
        numeroTelefono: Number(this.form.value.NumeroTelefono) || 987654321,
        correoElectronico: this.form.value.CorreoElectronico || 'CorreoElectronico',
        sitioWeb: this.form.value.SitioWeb || 'SitioWeb',
        direccion: this.form.value.Direccion || 'Direccion',
        pais: this.form.value.Pais || 'Pais',
        facturacion: this.form.value.Facturacion || 0,
        fechaEdicion: this.form.value.FechaEdicion || new Date(),
        id: index,
      };
      this._empresaService.updateEmpresa(empresa).subscribe(
        response => { 
            this.listEntity = response
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
  }

  eliminarEmpresa(index: number) {
    this._empresaService.deleteEmpresa(index).subscribe(
      data => {
        this.getAllEmpresas();
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
  }

  // Obtener empresa por nombre
  buscarEmpresaPorNombre(nombre: string) {
    this._empresaService.getEmpresaByNombre(nombre).subscribe(
      response => {
        if (response == null) {
          this.status = 2;
          this.screening = false;
          this.selectedEmpresa = {} as Entity;
          console.log('No se encontró la empresa');
          return;
        }
        this.status = 1;
        this.screening = true;
        this.selectedEmpresa = response;
      },
      error => {
        this.status = 2;
        this.screening = false;
        this.selectedEmpresa = {} as Entity;
        console.log(error);
    });
  }

  // Abrir Modal de screening
  toggleModal() {
    this.modal = !this.modal;
    if (!this.modal) {
      this.negative = '';
      this.offshore = {
        "Entity": "",
        "Jurisdiction": "",
        "LinkedTo": "",
        "DataFrom": ""
      };
      this.ofac = {
        "Name": "",
        "Address": "",
        "Type": "",
        "Program": "",
        "List": "",
        "Score": 0
      };
      this.worldBank = {
        "Name": "",
        "Address": "",
        "Country": "",
        "FromDate": "",
        "ToDate": "",
        "Grounds": ""
      };
    }
  }

  // Realizar screening en OffShore
  screeningOffShore(name: string) {
    this._screeningService.screeningOffShore(name).subscribe(
      response => {
        if (typeof response === 'string'){
          this.negative = response;
          return;
        }
        this.offshore = response;
        
      },
      error => {
        console.log(error);
    });
  }

  // Realizar screening en Ofac
  screeningOfac(name: string) {
    this._screeningService.screeningOfac(name).subscribe(
      response => {
        if (typeof response === 'string'){
          this.negative = response;
          return;
        }
        this.ofac = response;
      },
      error => {
        console.log(error);
    });
  }

  // Realizar screening en WorldBank
  screeningWorldBank(name: string) {
    this._screeningService.screeningWorldBank(name).subscribe(
      response => {
        if (typeof response === 'string'){
          this.negative = response;
          return;
        }
        this.worldBank = response;
      },
      error => {
        console.log(error);
    });
  }

  cancelar() {
    this.visible = false;
    this.able = false;
    this.form.enable();
    this.form.reset();
  }

  nextPage() {
    this.currentPage++;
  }
  
  previousPage() {
    this.currentPage--;
  }

  goSelectedPage(page: number) {
    this.currentPage = page;
  }

  // Cambiar opción de filtrado
  changeOption(option: string) {
    this.opcionFilter = option;
    this.desplegar = !this.desplegar;
  }
  
  despliegaOpciones() {
    this.desplegar = !this.desplegar;
  }

  despliegaOpcionesOrden() {
    this.desplegarOrden = !this.desplegarOrden;
  }

  // Cambiar opción de ordenado
  changeOptionOrden(option: string) {
    this.opcionOrden = option;
    this.desplegarOrden = !this.desplegarOrden;
    this._empresaService.getEmpresasByField(option).subscribe(
      response => {
        this.listEntity = response;
      },
      error => {
        console.log(error);
    });
  }

  
}
