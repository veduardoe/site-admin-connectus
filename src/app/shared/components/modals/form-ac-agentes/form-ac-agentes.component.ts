import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UsuariosService } from 'src/app/shared/services/usuarios/usuarios.service';
import { TIPO_USUARIOS } from 'src/environments/items';

@Component({
  selector: 'app-form-ac-agentes',
  templateUrl: './form-ac-agentes.component.html',
  styleUrls: ['./form-ac-agentes.component.scss']
})
export class FormAcAgentesComponent implements OnInit {

  inputControl = new FormControl();
  agentes = [];
  filteredAgentes: Observable<any[]>;

  @Output() dialogEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private usuariosService: UsuariosService
  ) { }

  ngOnInit(): void {
    this.getAgentes();
   
  }

  getAgentes(){
    this.usuariosService.find({tipoUsuario:TIPO_USUARIOS.AGENTE}).then( (res:any) => {
      this.agentes = res.data;
      this.filteredAgentes = this.inputControl.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nombres),
        map(name => name ? this._filter(name) : this.agentes.slice())
      );
    });
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.agentes.filter(option => {
      const str = `${option.nombres} ${option.apellido_paterno} ${option.apellido_materno} ${option.rut}`;
      return str.toLowerCase().includes(filterValue)
    });
  }

  displayFn(entity): string {
    if(entity){
      return  (`${entity.nombres} ${entity.apellido_paterno} ${entity.apellido_materno}`).toUpperCase();
    }else{
      return '';
    }
  }

  selected(event){
    this.dialogEvent.emit(event.option.value)
  }
}
