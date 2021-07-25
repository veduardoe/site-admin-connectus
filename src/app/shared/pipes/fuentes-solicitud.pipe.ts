import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fuenteSolicitud'
})
export class FuenteSolicitudPipe implements PipeTransform {

  transform(value: string): string {
    let txt = "";
    switch(value.toUpperCase()){
        case 'DDP' :
            txt = 'Directo desde una propiedad';
        break;
        case 'QBUA' :
            txt = 'Quiero buscar un arriendo';
        break;
        case 'QAMP' : 
            txt = 'Quiero arrendar mi propiedad';
        break;
        case 'QVMP' :
            txt = 'Quiero vender mi propiedad';
        break;
        case 'QQMC':
            txt = 'Quiero que me contacten';
        break;
        case 'QCUP':
            txt = 'Quiero comprar una prpiedad';
        break;
        case 'DPA':
            txt = 'Plataforma Administrativa';
        break;
        default:
            txt = '--'
            break;
    }

    return txt;
  }

}
