import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientesService } from 'src/app/shared/services/clientes/clientes.service';
import { UtilsService } from 'src/app/shared/services/common/utils.service';
import { PlanesAgentesService } from 'src/app/shared/services/planes-agentes/planes-agentes.service';
import { CONFIG } from 'src/environments/configurations';

@Component({
  selector: 'app-form-clientes',
  templateUrl: './form-clientes.component.html',
  styleUrls: ['./form-clientes.component.scss']
})
export class FormClientesComponent implements OnInit {

  @Output() dialogEvent: EventEmitter<any> = new EventEmitter();

  tiposIdentificaciones = ['PASAPORTE', 'RUT'];

  mainForm = new FormGroup({
    _id: new FormControl(null),
    nombres: new FormControl(null, [Validators.required]),
    apellidos: new FormControl(null, [Validators.required]),
    tipoIdentificacion: new FormControl(null, [Validators.required]),
    identificacion: new FormControl(null, [Validators.required]),
    correo: new FormControl(null, [Validators.required]),
    telefono: new FormControl(null, [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public input: { data: any },
    public utils: UtilsService,
    public clientesService: ClientesService,
  ) {

    if (this.input.data) {
      this.mainForm.patchValue(this.input.data);
    }

  }

  ngOnInit(): void {
  }

  save() {

    const data = this.mainForm.getRawValue();

    this.triggedValidation(true);
    
    if (!this.mainForm.valid) {
      return;
    }

    if(data.tipoIdentificacion === 'RUT' && !this.utils.validateRun(data.identificacion)){
      this.utils.fnMainDialog("Error", "El RUT ingresado es incorrecto. Revíselo e intente nuevamente.", "message");
    }
    
    if (!this.utils.validateEmail(data.correo)) {
      this.utils.fnMainDialog('Error', 'El correo ingresado es incorrecto. Revíselo e intente nuevamente.', 'message');
      return;
    }

    this.utils.setLoading(true);

    const prom = (data._id) ? this.clientesService.put(data._id, data) : this.clientesService.post(data);
    prom.then(res => {
      if (res['response']) {
        this.dialogEvent.emit(true)
      } else {
        this.utils.fnError();
      }
      this.utils.setLoading(false);

    }).catch(err => {

      if (err['error']['message']) {
        this.utils.fnMainDialog("Error", err['error']['message'], "message");
      } else {
        this.utils.fnError();
      }
      this.utils.setLoading(false);
    });

  }

  get mf() {
    return this.mainForm.controls;
  }

  triggedValidation(touched) {
    const obj = this.mainForm.value;
    Object.keys(obj).forEach(key => {
      touched ? this.mainForm.get(key).markAsTouched() : this.mainForm.get(key).markAsUntouched()
    });
  }

}
