import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreeningService {

  constructor(private http: HttpClient) { }

  private AppUrl = 'https://localhost:5000/api/';
  private OffShore = 'OffShore';
  private Ofac = 'Ofac';
  private WorldBank = 'WorldBank';

  //Realizar screening en OffShore
  screeningOffShore(nombre:string): Observable<any> {
    return this.http.get(`${this.AppUrl + this.OffShore}`, {params: {name: nombre}});
  }

  //Realizar screening en Ofac
  screeningOfac(nombre:string): Observable<any> {
    return this.http.get(`${this.AppUrl + this.Ofac}`, {params: {name: nombre}});
  }

  //Realizar screening en WorldBank
  screeningWorldBank(nombre:string): Observable<any> {
    return this.http.get(`${this.AppUrl + this.WorldBank}`, {params: {name: nombre}});
  }
}
