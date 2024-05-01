import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private AppUrl = 'https://localhost:7154/';
  private ApiUrl = 'api/Empresa/';

  constructor(private http: HttpClient) { }

  //Obtener todas las empresas
  getAllEmpresas(): Observable<any> {
    return this.http.get(`${this.AppUrl + this.ApiUrl}`);
  }

  //Obtener una empresa por id
  getEmpresaById(id: number): Observable<any> {
    return this.http.get(`${this.AppUrl + this.ApiUrl + id}`);
  }

  //Crear una empresa
  createEmpresa(empresa: any): Observable<any> {
    return this.http.post(`${this.AppUrl + this.ApiUrl}`, empresa);
  }

  //Actualizar una empresa
  updateEmpresa(empresa: any): Observable<any> {
    return this.http.put(`${this.AppUrl + this.ApiUrl}`, empresa);
  }

  //Eliminar una empresa
  deleteEmpresa(id: number): Observable<any> {
    return this.http.delete(this.AppUrl + this.ApiUrl + id);
  }

  //Obtener empresa por nombre
  getEmpresaByNombre(nombre: string): Observable<any> {
    return this.http.get(`${this.AppUrl + this.ApiUrl + 'buscar/' + nombre}`);
  }

  // Listar empresas por campo
  getEmpresasByField(campo: string): Observable<any> {
    return this.http.get(`${this.AppUrl + this.ApiUrl + 'ordenar/' + campo}`);
  }
}
