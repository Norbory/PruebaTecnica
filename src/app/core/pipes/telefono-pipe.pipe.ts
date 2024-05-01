import { Pipe, PipeTransform } from '@angular/core';
import { Entity } from '../types/entity';

@Pipe({
  name: 'telefonoPipe',
  standalone: true
})
export class TelefonoPipePipe implements PipeTransform {

  transform(value: Entity[], args: string): any {
    const resultado = [];
    for (const telefono of value) {
      if (telefono.numeroTelefono.toString().includes(args)) {
        resultado.push(telefono);
      }
    }
    return resultado;
  }

}
