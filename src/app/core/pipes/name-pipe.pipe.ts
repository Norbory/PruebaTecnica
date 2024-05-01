import { Pipe, PipeTransform } from '@angular/core';
import { Entity } from '../types/entity';

@Pipe({
  name: 'namePipe',
  standalone: true
})
export class NamePipePipe implements PipeTransform {

  transform(value: Entity[], args: string): any {
    // Crear un array vacío para almacenar los resultados
    const resultado = [];
    for(const empresa of value) {
      // Normalizar el argumento de búsqueda
      const argsSinEspacios = args.replace(' ', '');
      const argsSinTildes = argsSinEspacios.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const argsMinusculas = argsSinTildes.toLowerCase();

      // Normalizar el nombre de las empresas
      const nombreSinEspacios = empresa.nombreEmpresa.replace(' ', '');
      const nombreSinTildes = nombreSinEspacios.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const nombreNormalizado = nombreSinTildes.toLowerCase();

      // Comprobar si el nombre de la empresa incluye el argumento de búsqueda
      if(nombreNormalizado.includes(argsMinusculas)) {
        resultado.push(empresa);
      }
    }
    return resultado;
  }

}
