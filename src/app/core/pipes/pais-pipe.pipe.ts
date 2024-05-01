import { Pipe, PipeTransform } from '@angular/core';
import { Entity } from '../types/entity';

@Pipe({
  name: 'paisPipe',
  standalone: true
})
export class PaisPipePipe implements PipeTransform {

  transform(value: Entity[], args: string): any {
    const resultado = [];
    for (const pais of value) {
      // Normalizar el argumento de búsqueda
      const argsSinEspacios = args.replace(' ', '');
      const argsSinTildes = argsSinEspacios.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const argsMinusculas = argsSinTildes.toLowerCase();


      const paisSinEspacios = pais.pais.replace(' ', '');
      const paisSinTildes = paisSinEspacios.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const paisNormalizado = paisSinTildes.toLowerCase();


      if (paisNormalizado.includes(argsMinusculas)) {
        resultado.push(pais);
      }      
    }

    return resultado;
  }

}
