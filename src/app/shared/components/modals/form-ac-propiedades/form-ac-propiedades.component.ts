import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PropiedadesService } from 'src/app/shared/services/propiedades/propiedades.service';
import { TIPO_USUARIOS } from 'src/environments/items';

@Component({
  selector: 'app-form-ac-propiedades',
  templateUrl: './form-ac-propiedades.component.html',
  styleUrls: ['./form-ac-propiedades.component.scss']
})
export class FormAcPropiedadesComponent implements OnInit {

  inputControl = new FormControl();
  propiedades = [];
  filteredPropiedades: Observable<any[]>;

  @Output() dialogEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private propiedadesService: PropiedadesService
  ) { }

  ngOnInit(): void {
    this.getPropiedades();

  }

  getPropiedades() {
    this.propiedadesService.find(null).then((res: any) => {
      this.propiedades = res.data;
      this.filteredPropiedades = this.inputControl.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nombres),
        map(name => name ? this._filter(name) : this.propiedades.slice())
      );
    });
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.propiedades.filter(option => {
      const str = `${option.codigoReferencia} ${option.precio} ${option.titulo} ${option.tipoOperacion} ${option.comuna}`;
      return str.toLowerCase().includes(filterValue)
    });
  }

  displayFn(entity): string {
    if (entity) {
      return (`${entity.codigoReferencia} - UF${entity.precio} ${entity.titulo}`).toUpperCase();
    } else {
      return '';
    }
  }

  selected(event) {
    this.dialogEvent.emit(event.option.value)
  }
}
