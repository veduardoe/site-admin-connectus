import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ClientesService } from 'src/app/shared/services/clientes/clientes.service';

@Component({
  selector: 'app-form-ac-clientes',
  templateUrl: './form-ac-clientes.component.html',
  styleUrls: ['./form-ac-clientes.component.scss']
})
export class FormAcClientesComponent implements OnInit {

  inputControl = new FormControl();
  clientes = [];
  filteredClientes: Observable<any[]>;

  @Output() dialogEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private clientesService: ClientesService
  ) { }

  ngOnInit(): void {
    this.getClientes();
   
  }

  getClientes(){
    this.clientesService.find(null).then( (res:any) => {
      this.clientes = res.data;
      this.filteredClientes = this.inputControl.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nombres),
        map(name => name ? this._filter(name) : this.clientes.slice())
      );
    });
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.clientes.filter(option => {
      const str = `${option.nombres} ${option.apellidos} ${option.identificacion}`
      return str.toLowerCase().includes(filterValue)
    });
  }

  displayFn(entity): string {
    if(entity){
      return  (`${entity.nombres} ${entity.apellidos}`).toUpperCase();
    }else{
      return '';
    }
  }

  selected(event){
    this.dialogEvent.emit(event.option.value)
  }
}
