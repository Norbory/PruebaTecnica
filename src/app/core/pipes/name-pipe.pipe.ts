import { Pipe, PipeTransform } from '@angular/core';
import { Entity } from '../types/entity';

@Pipe({
  name: 'namePipe',
  standalone: true
})
export class NamePipePipe implements PipeTransform {

  transform(value: Entity[], args: string): any {
    const resultado = [];
    for (const nombre of value) {
      let nombreSinEspacios = nombre.nombreEmpresa.replace(' ', '');
      if (nombreSinEspacios.indexOf(args) > -1 || 
          nombre.nombreEmpresa.toLowerCase().indexOf(args) > -1 ||
          nombre.nombreEmpresa.toUpperCase().indexOf(args) > -1 ||
          nombre.nombreEmpresa.indexOf(args) > -1) {
        resultado.push(nombre);
      }
    }

    return resultado;
  }

}
